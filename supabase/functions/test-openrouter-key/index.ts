import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

    if (!openRouterKey) {
      return new Response(
        JSON.stringify({
          success: false,
          configured: false,
          message: 'OPENROUTER_API_KEY not configured in Supabase Edge Function secrets',
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!openRouterKey.startsWith('sk-or-')) {
      return new Response(
        JSON.stringify({
          success: false,
          configured: true,
          validFormat: false,
          message: 'OPENROUTER_API_KEY is configured but has invalid format (should start with sk-or-)',
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com',
        'X-Title': 'Formation Document Processor - API Test',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: 'Respond with exactly one word: OK'
        }],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          success: false,
          configured: true,
          validFormat: true,
          apiError: true,
          status: response.status,
          message: `OpenRouter API returned error: ${response.status}`,
          details: errorText.substring(0, 500),
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        configured: true,
        validFormat: true,
        working: true,
        message: 'OpenRouter API key is correctly configured and working',
        model: 'google/gemini-2.0-flash-exp:free',
        testResponse: data.choices?.[0]?.message?.content || 'No response',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Error testing OpenRouter API key',
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
