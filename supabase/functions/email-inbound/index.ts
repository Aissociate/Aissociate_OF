import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload = await req.json();

    const fromEmail = payload.from?.email || payload.from || "";
    const fromName = payload.from?.name || "";
    const toEmail = payload.to?.email || payload.to || "";
    const subject = payload.subject || "(Sans objet)";
    const bodyHtml = payload.html || payload.body_html || "";
    const bodyText = payload.text || payload.body_text || "";
    const messageId = payload.message_id || payload.id || "";
    const inReplyToHeader = payload.in_reply_to || payload.headers?.["In-Reply-To"] || "";

    let ownerId: string | null = null;
    let inReplyToEmailId: string | null = null;
    let companyId: string | null = null;
    let contactId: string | null = null;

    const { data: recentSent } = await adminClient
      .from("crm_sent_emails")
      .select("id, sender_id, company_id, contact_id")
      .eq("to_email", fromEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentSent) {
      ownerId = recentSent.sender_id;
      inReplyToEmailId = recentSent.id;
      companyId = recentSent.company_id;
      contactId = recentSent.contact_id;
    }

    if (!ownerId) {
      const toLocal = toEmail.split("@")[0]?.toLowerCase();
      if (toLocal) {
        const { data: profileByRole } = await adminClient
          .from("profiles")
          .select("id")
          .eq("role", toLocal)
          .limit(1)
          .maybeSingle();

        if (profileByRole) {
          ownerId = profileByRole.id;
        }
      }
    }

    if (!ownerId) {
      const { data: anyAdmin } = await adminClient
        .from("profiles")
        .select("id")
        .eq("is_admin", true)
        .limit(1)
        .maybeSingle();

      if (anyAdmin) {
        ownerId = anyAdmin.id;
      }
    }

    if (!ownerId) {
      return new Response(
        JSON.stringify({ error: "No owner found for this email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: inserted, error: insertError } = await adminClient
      .from("crm_received_emails")
      .insert({
        owner_id: ownerId,
        from_email: fromEmail,
        from_name: fromName,
        to_email: toEmail,
        subject,
        body_html: bodyHtml,
        body_text: bodyText,
        in_reply_to_email_id: inReplyToEmailId,
        resend_message_id: messageId,
        is_read: false,
        company_id: companyId,
        contact_id: contactId,
        received_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to store email", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, email_id: inserted.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
