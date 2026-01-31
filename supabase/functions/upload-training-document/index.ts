import { createClient } from 'npm:@supabase/supabase-js@2';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const AI_CONFIG = {
  model: 'google/gemini-2.0-flash-exp:free',
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  referer: 'https://your-app.com',
  appTitle: 'Formation Document Processor',
  maxTextLength: 25000,
  maxTokens: 2000,
  temperature: 0.2,
};

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

async function logToDatabase(
  supabase: any,
  level: string,
  message: string,
  metadata: any = {}
) {
  try {
    await supabase.from('function_logs').insert({
      function_name: 'upload-training-document',
      level,
      message,
      metadata,
    });
    console.log(`[${level}] ${message}`, metadata);
  } catch (error) {
    console.error('Failed to log to database:', error);
  }
}

// ============================================================================
// AUTHENTICATION & USER MANAGEMENT
// ============================================================================

async function authenticateUser(authHeader: string | null) {
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.replace('Bearer ', '');

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const { data: { user }, error: authError } = await authClient.auth.getUser(token);

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  return user;
}

async function ensureTenantExists(supabase: any) {
  let tenantId = (await supabase
    .from('tenants')
    .select('id')
    .limit(1)
    .maybeSingle()).data?.id;

  if (!tenantId) {
    await logToDatabase(supabase, 'INFO', 'No tenant exists, creating default tenant');
    const { data: newTenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: 'Organisation par défaut',
        settings: {}
      })
      .select()
      .single();

    if (tenantError) {
      throw new Error('Failed to create default tenant');
    }

    tenantId = newTenant.id;
  }

  return tenantId;
}

async function getOrCreateUserQualiopi(supabase: any, user: any) {
  let userQualiopi = (await supabase
    .from('users_qualiopi')
    .select('id, tenant_id, role')
    .eq('auth_user_id', user.id)
    .maybeSingle()).data;

  if (!userQualiopi) {
    await logToDatabase(supabase, 'WARNING', 'User not found in Qualiopi system, creating entry', { auth_user_id: user.id });

    const tenantId = await ensureTenantExists(supabase);

    const { data: newUserQualiopi, error: userError } = await supabase
      .from('users_qualiopi')
      .insert({
        auth_user_id: user.id,
        tenant_id: tenantId,
        email: user.email,
        role: 'admin'
      })
      .select()
      .single();

    if (userError) {
      throw new Error('Failed to create user in Qualiopi system');
    }

    userQualiopi = newUserQualiopi;
    await logToDatabase(supabase, 'INFO', 'User created successfully', {
      user_qualiopi_id: userQualiopi.id,
      tenant_id: userQualiopi.tenant_id
    });
  }

  return userQualiopi;
}

// ============================================================================
// FILE VALIDATION & STORAGE
// ============================================================================

function validateFile(file: File | null) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.includes('pdf')) {
    throw new Error('Only PDF files are allowed');
  }
}

async function uploadFileToStorage(
  supabase: any,
  file: File,
  tenantId: string
): Promise<{ filename: string; publicUrl: string; fileData: Uint8Array }> {
  const timestamp = Date.now();
  const filename = `${tenantId}/${timestamp}_${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('qualiopi-documents')
    .upload(filename, fileData, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('qualiopi-documents')
    .getPublicUrl(filename);

  return {
    filename,
    publicUrl: urlData.publicUrl,
    fileData
  };
}

async function saveDocumentRecord(
  supabase: any,
  params: {
    tenantId: string;
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    extractedText: string;
    uploadedBy: string;
  }
) {
  const { data: docData, error: docError } = await supabase
    .from('document_originals')
    .insert({
      tenant_id: params.tenantId,
      filename: params.filename,
      file_url: params.fileUrl,
      file_size: params.fileSize,
      mime_type: params.mimeType,
      doc_type: 'OTHER',
      extracted_text: params.extractedText,
      uploaded_by: params.uploadedBy,
    })
    .select()
    .single();

  if (docError) {
    throw docError;
  }

  return docData;
}

// ============================================================================
// PDF EXTRACTION
// ============================================================================

function extractRawTextFromPDF(pdfData: Uint8Array): string {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(pdfData);

  let extractedText = '';

  const streamRegex = /stream\s*([\s\S]*?)\s*endstream/g;
  let match;

  while ((match = streamRegex.exec(text)) !== null) {
    const streamContent = match[1];
    const cleanedContent = streamContent
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanedContent.length > 10) {
      extractedText += cleanedContent + ' ';
    }
  }

  const textRegex = /\(([^)]+)\)/g;
  while ((match = textRegex.exec(text)) !== null) {
    const content = match[1]
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\/g, '');

    if (content.length > 2) {
      extractedText += content + ' ';
    }
  }

  return extractedText.trim();
}

async function extractPDFContent(pdfData: Uint8Array): Promise<string> {
  try {
    const rawText = extractRawTextFromPDF(pdfData);

    if (!rawText || rawText.length < 50) {
      return 'Contenu PDF extrait mais vide ou incomplet';
    }

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterKey || !openRouterKey.startsWith('sk-or-')) {
      console.warn('OpenRouter API key not configured or invalid, returning raw text');
      return rawText.substring(0, 50000);
    }

    const structuredText = await enhanceTextWithAI(rawText.substring(0, 30000), openRouterKey);
    return structuredText || rawText.substring(0, 50000);
  } catch (error) {
    console.error('Error extracting PDF:', error);
    return 'Extraction échouée - contenu non disponible';
  }
}

// ============================================================================
// AI PROCESSING
// ============================================================================

function validateApiKey(apiKey: string): boolean {
  return !!(apiKey && apiKey.startsWith('sk-or-'));
}

async function callOpenRouterAPI(
  apiKey: string,
  prompt: string,
  temperature: number = 0.3,
  maxTokens: number = 4000
): Promise<string> {
  if (!validateApiKey(apiKey)) {
    console.warn('Invalid OpenRouter API key format');
    return '';
  }

  try {
    const response = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': AI_CONFIG.referer,
        'X-Title': AI_CONFIG.appTitle,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return '';
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return '';
  }
}

async function enhanceTextWithAI(rawText: string, apiKey: string): Promise<string> {
  const prompt = `Tu es un assistant spécialisé dans l'extraction et la structuration de programmes de formation. Voici le contenu brut extrait d'un PDF de programme de formation.

Ton objectif : nettoyer, structurer et organiser ce contenu de manière claire et lisible.

Extrait les informations suivantes si disponibles :
- Titre de la formation
- Objectifs pédagogiques
- Public cible / Prérequis
- Durée et modalités
- Programme détaillé (modules, chapitres, thèmes)
- Compétences visées
- Modalités d'évaluation
- Intervenant(s)

Contenu brut :
${rawText}

Réponds UNIQUEMENT avec le texte structuré et nettoyé, sans commentaires additionnels.`;

  return await callOpenRouterAPI(apiKey, prompt, 0.3, 4000);
}

async function extractStructuredTrainingData(
  rawText: string,
  apiKey: string,
  supabase: any
): Promise<any> {
  if (!validateApiKey(apiKey)) {
    await logToDatabase(supabase, 'WARNING', 'Invalid API key format');
    return null;
  }

  try {
    const keyPreview = `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;
    await logToDatabase(supabase, 'INFO', 'Calling OpenRouter API for structured extraction', {
      textLength: rawText.length,
      model: AI_CONFIG.model,
      keyPreview,
    });

    const prompt = `Tu es un assistant spécialisé dans l'extraction de données structurées depuis des programmes de formation.

Analyse le contenu suivant et extrait les informations dans un format JSON strict.

Retourne UNIQUEMENT un objet JSON valide avec ces champs (tous optionnels) :
{
  "title": "Titre exact de la formation",
  "description": "Description complète incluant objectifs pédagogiques, compétences visées, public cible",
  "duration_days": nombre de jours (integer, extraire depuis "X jours", "X heures" -> convertir en jours),
  "meta_json": {
    "objectives": ["objectif 1", "objectif 2"],
    "prerequisites": "Prérequis si mentionnés",
    "target_audience": "Public cible",
    "program_details": "Programme détaillé avec modules",
    "evaluation": "Modalités d'évaluation",
    "trainer": "Nom du formateur si mentionné"
  }
}

Règles importantes :
- Si une information n'est pas disponible, ne pas inclure le champ
- duration_days doit être un nombre entier (ex: "14 heures" = 2 jours, "35 heures" = 5 jours)
- Extraire le maximum d'informations pertinentes
- Ne retourne QUE le JSON, aucun texte avant ou après

Contenu à analyser :
${rawText.substring(0, AI_CONFIG.maxTextLength)}`;

    const content = await callOpenRouterAPI(
      apiKey,
      prompt,
      AI_CONFIG.temperature,
      AI_CONFIG.maxTokens
    );

    if (!content || content.trim().length === 0) {
      await logToDatabase(supabase, 'WARNING', 'AI returned empty content');
      return null;
    }

    await logToDatabase(supabase, 'INFO', 'Received AI response', {
      contentLength: content.length,
      contentPreview: content.substring(0, 200)
    });

    return parseAIJsonResponse(content, supabase);
  } catch (error) {
    await logToDatabase(supabase, 'ERROR', 'Error in AI extraction', {
      error: error.message,
      stack: error.stack
    });
    return null;
  }
}

function parseAIJsonResponse(content: string, supabase: any): any {
  try {
    const cleanContent = content.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logToDatabase(supabase, 'ERROR', 'No JSON found in AI response', {
        content: content.substring(0, 500)
      });
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    logToDatabase(supabase, 'INFO', 'Successfully parsed AI response', {
      keys: Object.keys(parsed),
      hasMetaJson: !!parsed.meta_json
    });

    return parsed;
  } catch (parseError) {
    logToDatabase(supabase, 'ERROR', 'Failed to parse JSON', {
      error: parseError.message,
      content: content.substring(0, 500)
    });
    return null;
  }
}

// ============================================================================
// TRAINING UPDATE
// ============================================================================

async function updateTrainingWithDocument(
  supabase: any,
  trainingId: string,
  documentId: string,
  extractedText: string,
  tenantId: string
) {
  await logToDatabase(supabase, 'INFO', 'Processing training update', { trainingId });

  const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
  const hasValidKey = !!(openRouterKey && validateApiKey(openRouterKey));
  let trainingData: any = { program_document_id: documentId };
  let extractedMetadata: any = null;

  await logToDatabase(supabase, 'INFO', 'API Key Status Check', {
    hasValidApiKey: hasValidKey,
    keyLength: openRouterKey?.length || 0,
    textLength: extractedText?.length || 0
  });

  if (!openRouterKey || !hasValidKey) {
    await logToDatabase(supabase, 'WARNING', 'OPENROUTER_API_KEY not configured - AI extraction disabled', {
      hasValidApiKey: false
    });
  } else if (extractedText && extractedText.length > 50) {
    await logToDatabase(supabase, 'INFO', 'Calling AI to extract structured data', {
      hasValidApiKey: true
    });
    const structuredData = await extractStructuredTrainingData(extractedText, openRouterKey, supabase);

    if (structuredData) {
      await logToDatabase(supabase, 'INFO', 'AI extraction successful', {
        fields: Object.keys(structuredData),
        hasValidApiKey: true
      });
      trainingData = { ...trainingData, ...structuredData };
      extractedMetadata = structuredData;
    } else {
      await logToDatabase(supabase, 'WARNING', 'AI extraction returned no data', {
        hasValidApiKey: true
      });
    }
  } else {
    await logToDatabase(supabase, 'INFO', 'Skipping AI extraction', {
      hasValidApiKey: hasValidKey,
      textLength: extractedText?.length,
      reason: extractedText?.length <= 50 ? 'Text too short' : 'Unknown'
    });
  }

  const { error: updateError } = await supabase
    .from('trainings')
    .update(trainingData)
    .eq('id', trainingId)
    .eq('tenant_id', tenantId);

  if (updateError) {
    await logToDatabase(supabase, 'ERROR', 'Training update failed', {
      error: updateError.message,
      trainingId
    });
    throw updateError;
  }

  await logToDatabase(supabase, 'INFO', 'Training updated successfully', { trainingId });

  return extractedMetadata;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  let supabase: any;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    await logToDatabase(supabase, 'INFO', 'Starting upload process');

    const user = await authenticateUser(supabase, req.headers.get('Authorization'));
    await logToDatabase(supabase, 'INFO', 'User authenticated', { user_id: user.id });

    const userQualiopi = await getOrCreateUserQualiopi(supabase, user);
    await logToDatabase(supabase, 'INFO', 'User belongs to tenant', {
      tenant_id: userQualiopi.tenant_id,
      role: userQualiopi.role
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const trainingId = formData.get('trainingId') as string;

    await logToDatabase(supabase, 'INFO', 'File received', {
      filename: file?.name,
      size: file?.size,
      type: file?.type,
      trainingId
    });

    validateFile(file);

    await logToDatabase(supabase, 'INFO', 'Uploading to storage');
    const { filename, publicUrl, fileData } = await uploadFileToStorage(
      supabase,
      file,
      userQualiopi.tenant_id
    );
    await logToDatabase(supabase, 'INFO', 'File uploaded successfully', { filename });

    await logToDatabase(supabase, 'INFO', 'Extracting PDF content');
    const extractedText = await extractPDFContent(fileData);
    await logToDatabase(supabase, 'INFO', 'PDF content extracted', { length: extractedText.length });

    const docData = await saveDocumentRecord(supabase, {
      tenantId: userQualiopi.tenant_id,
      filename: file.name,
      fileUrl: publicUrl,
      fileSize: file.size,
      mimeType: file.type,
      extractedText,
      uploadedBy: userQualiopi.id,
    });
    await logToDatabase(supabase, 'INFO', 'Document saved', { document_id: docData.id });

    let extractedMetadata = null;
    if (trainingId) {
      extractedMetadata = await updateTrainingWithDocument(
        supabase,
        trainingId,
        docData.id,
        extractedText,
        userQualiopi.tenant_id
      );
    }

    await logToDatabase(supabase, 'INFO', 'Upload process completed', {
      document_id: docData.id,
      training_id: trainingId,
      has_metadata: !!extractedMetadata
    });

    return new Response(
      JSON.stringify({
        success: true,
        document: docData,
        extractedMetadata,
        message: 'Document uploaded successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (!supabase) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }

    await logToDatabase(supabase, 'ERROR', 'Upload process failed', {
      error: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
