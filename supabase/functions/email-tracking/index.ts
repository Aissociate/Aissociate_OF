import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TRANSPARENT_PIXEL = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
  (c) => c.charCodeAt(0)
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const emailId = url.searchParams.get("id");
    const link = url.searchParams.get("url");

    if (!emailId || !type) {
      return new Response("Missing params", { status: 400, headers: corsHeaders });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "";

    await adminClient.from("crm_email_tracking_events").insert({
      email_id: emailId,
      event_type: type,
      metadata: {
        user_agent: userAgent,
        ip: ip,
        link: link || null,
        timestamp: new Date().toISOString(),
      },
    });

    if (type === "open") {
      const { data: email } = await adminClient
        .from("crm_sent_emails")
        .select("opened_at, open_count")
        .eq("id", emailId)
        .maybeSingle();

      if (email) {
        await adminClient
          .from("crm_sent_emails")
          .update({
            opened_at: email.opened_at || new Date().toISOString(),
            open_count: (email.open_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", emailId);
      }

      return new Response(TRANSPARENT_PIXEL, {
        headers: {
          ...corsHeaders,
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    if (type === "click" && link) {
      const { data: email } = await adminClient
        .from("crm_sent_emails")
        .select("clicked_at, click_count")
        .eq("id", emailId)
        .maybeSingle();

      if (email) {
        await adminClient
          .from("crm_sent_emails")
          .update({
            clicked_at: email.clicked_at || new Date().toISOString(),
            click_count: (email.click_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", emailId);
      }

      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          Location: link,
        },
      });
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
