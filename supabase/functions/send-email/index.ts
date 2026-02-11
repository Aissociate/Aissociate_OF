import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendEmailPayload {
  to_email: string;
  to_name: string;
  subject: string;
  body_html: string;
  body_text: string;
  from_name?: string;
  template_id?: string;
  company_id?: string;
  contact_id?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorise" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Non autorise" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .maybeSingle();

    const payload: SendEmailPayload = await req.json();

    if (!payload.to_email || !payload.subject || !payload.body_html) {
      return new Response(
        JSON.stringify({ error: "Email, sujet et corps requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const DEFAULT_EMAIL = "sales@lemarchepublic.fr";
    const senderName = payload.from_name || "Le Marche Public";
    const fromEmail = DEFAULT_EMAIL;
    const replyToEmail = DEFAULT_EMAIL;

    const { data: emailRecord, error: insertError } = await adminClient
      .from("crm_sent_emails")
      .insert({
        sender_id: user.id,
        template_id: payload.template_id || null,
        from_email: fromEmail,
        from_name: senderName,
        to_email: payload.to_email,
        to_name: payload.to_name || "",
        subject: payload.subject,
        body_html: payload.body_html,
        body_text: payload.body_text || "",
        reply_to: replyToEmail,
        status: "queued",
        company_id: payload.company_id || null,
        contact_id: payload.contact_id || null,
      })
      .select("id")
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'enregistrement", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailId = emailRecord.id;
    const trackingBaseUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/email-tracking`;
    const trackingPixel = `<img src="${trackingBaseUrl}?type=open&id=${emailId}" width="1" height="1" style="display:none" alt="" />`;
    const htmlWithTracking = payload.body_html + trackingPixel;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      await adminClient
        .from("crm_sent_emails")
        .update({ status: "failed", error_message: "RESEND_API_KEY non configure" })
        .eq("id", emailId);

      return new Response(
        JSON.stringify({ error: "Service email non configure", email_id: emailId }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${fromEmail}>`,
        to: [payload.to_email],
        reply_to: [replyToEmail],
        subject: payload.subject,
        html: htmlWithTracking,
        text: payload.body_text || "",
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      await adminClient
        .from("crm_sent_emails")
        .update({
          status: "failed",
          error_message: resendData.message || JSON.stringify(resendData),
        })
        .eq("id", emailId);

      return new Response(
        JSON.stringify({ error: "Echec d'envoi", details: resendData, email_id: emailId }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await adminClient
      .from("crm_sent_emails")
      .update({
        status: "sent",
        resend_id: resendData.id || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", emailId);

    return new Response(
      JSON.stringify({
        success: true,
        email_id: emailId,
        resend_id: resendData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erreur interne", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
