import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SyncPayload {
  source_table: "dossiers" | "contact_requests";
  source_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  source?: string;
  status?: string;
  product_type?: string;
  sector?: string;
  notes?: string;
  tags?: string[];
}

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_KEY =
  Deno.env.get("GHL_API_KEY") || "pit-4c70f781-72d4-40e5-82e6-b1c09700b1b9";
const GHL_LOCATION_ID =
  Deno.env.get("GHL_LOCATION_ID") || "QgFd2CSdLClLqXBncDm0";

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  "Content-Type": "application/json",
  Version: "2021-07-28",
};

async function findFormationPipeline(): Promise<{
  pipelineId: string;
  stageId: string;
} | null> {
  try {
    const res = await fetch(
      `${GHL_API_BASE}/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`,
      { headers: ghlHeaders }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const pipelines = data?.pipelines || [];

    const formation = pipelines.find(
      (p: { name: string }) =>
        p.name.toLowerCase().includes("formation")
    );

    if (!formation) return null;

    const stages = formation.stages || [];
    const firstStage =
      stages.find(
        (s: { name: string }) =>
          s.name.toLowerCase().includes("nouveau") ||
          s.name.toLowerCase().includes("new")
      ) || stages[0];

    if (!firstStage) return null;

    return { pipelineId: formation.id, stageId: firstStage.id };
  } catch {
    return null;
  }
}

async function createOpportunity(
  contactId: string,
  contactName: string,
  pipelineId: string,
  stageId: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${GHL_API_BASE}/opportunities/`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        pipelineId,
        pipelineStageId: stageId,
        locationId: GHL_LOCATION_ID,
        contactId,
        name: contactName,
        status: "open",
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const payload: SyncPayload = await req.json();

    if (!payload.first_name || !payload.last_name || !payload.phone) {
      return new Response(
        JSON.stringify({
          error: "Donnees manquantes: first_name, last_name et phone requis",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const tags: string[] = [...(payload.tags || [])];
    if (payload.source_table === "dossiers") tags.push("dossier-crm");
    if (payload.source_table === "contact_requests")
      tags.push("formulaire-web");
    if (payload.product_type) tags.push(payload.product_type);
    if (payload.source) tags.push(`source:${payload.source}`);

    const ghlContact: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      firstName: payload.first_name,
      lastName: payload.last_name,
      phone: payload.phone,
      source:
        payload.source_table === "contact_requests"
          ? "Website Form"
          : "CRM Internal",
    };

    if (payload.email) ghlContact.email = payload.email;
    if (payload.company) ghlContact.companyName = payload.company;
    if (tags.length > 0) ghlContact.tags = tags;

    const customFields: { key: string; field_value: string }[] = [];
    if (payload.status)
      customFields.push({ key: "crm_status", field_value: payload.status });
    if (payload.sector)
      customFields.push({ key: "secteur", field_value: payload.sector });
    if (payload.product_type)
      customFields.push({
        key: "type_produit",
        field_value: payload.product_type,
      });
    if (payload.notes)
      customFields.push({ key: "notes_crm", field_value: payload.notes });
    if (customFields.length > 0) ghlContact.customFields = customFields;

    const { data: existingSync } = await adminClient
      .from("ghl_sync_logs")
      .select("ghl_contact_id")
      .eq("source_table", payload.source_table)
      .eq("source_id", payload.source_id)
      .eq("sync_status", "success")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let ghlUrl: string;
    let ghlMethod: string;

    if (existingSync?.ghl_contact_id) {
      ghlUrl = `${GHL_API_BASE}/contacts/${existingSync.ghl_contact_id}`;
      ghlMethod = "PUT";
    } else {
      ghlUrl = `${GHL_API_BASE}/contacts/`;
      ghlMethod = "POST";
    }

    const ghlResponse = await fetch(ghlUrl, {
      method: ghlMethod,
      headers: ghlHeaders,
      body: JSON.stringify(ghlContact),
    });

    const ghlData = await ghlResponse.json();

    const syncLog = {
      source_table: payload.source_table,
      source_id: payload.source_id,
      ghl_location_id: GHL_LOCATION_ID,
      payload_sent: ghlContact,
      response_received: ghlData,
      synced_at: new Date().toISOString(),
      ghl_contact_id: "",
      sync_status: "error",
      error_message: "",
    };

    if (ghlResponse.ok) {
      syncLog.sync_status = "success";
      syncLog.ghl_contact_id =
        ghlData?.contact?.id ||
        ghlData?.id ||
        existingSync?.ghl_contact_id ||
        "";
    } else {
      syncLog.sync_status = "error";
      syncLog.error_message =
        ghlData?.message || ghlData?.msg || JSON.stringify(ghlData);
    }

    await adminClient.from("ghl_sync_logs").insert([syncLog]);

    if (!ghlResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Echec sync GoHighLevel",
          details: syncLog.error_message,
          ghl_status: ghlResponse.status,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let opportunityResult = null;
    if (!existingSync?.ghl_contact_id && syncLog.ghl_contact_id) {
      const pipeline = await findFormationPipeline();
      if (pipeline) {
        const contactName = `${payload.first_name} ${payload.last_name}`;
        opportunityResult = await createOpportunity(
          syncLog.ghl_contact_id,
          contactName,
          pipeline.pipelineId,
          pipeline.stageId
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ghl_contact_id: syncLog.ghl_contact_id,
        action: existingSync ? "updated" : "created",
        opportunity: opportunityResult ? "created" : "skipped",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Erreur interne", details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
