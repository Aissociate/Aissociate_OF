import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  request_type: string;
  message: string;
  source?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const requestData: ContactRequest = await req.json();

    console.log('Received contact request:', {
      email: requestData.email,
      type: requestData.request_type,
      source: requestData.source
    });

    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        email: requestData.email,
        phone: requestData.phone || 'Non renseigné',
        company: requestData.company,
        request_type: requestData.request_type,
        message: requestData.message,
        source: requestData.source || 'unknown',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Contact request saved successfully:', data.id);

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: 'Contact request submitted successfully'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing contact request:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
