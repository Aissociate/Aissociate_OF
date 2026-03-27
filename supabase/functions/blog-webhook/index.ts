import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const webhookSecret = Deno.env.get("BLOG_WEBHOOK_SECRET");
    if (webhookSecret) {
      const authHeader = req.headers.get("x-webhook-secret");
      if (authHeader !== webhookSecret) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (req.method === "POST") {
      const body = await req.json();
      const {
        title,
        content,
        excerpt,
        category,
        image_url,
        author,
        slug: customSlug,
        published,
        seo_title,
        seo_description,
        seo_keywords,
      } = body;

      if (!title || !content) {
        return new Response(
          JSON.stringify({ error: "title and content are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      let categoryId: string | null = null;
      if (category) {
        const { data: existingCat } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", category.toLowerCase().replace(/\s+/g, "-"))
          .maybeSingle();

        if (existingCat) {
          categoryId = existingCat.id;
        } else {
          const catSlug = generateSlug(category);
          const { data: newCat } = await supabase
            .from("blog_categories")
            .insert({
              name: category,
              slug: catSlug,
              description: "",
            })
            .select("id")
            .single();
          if (newCat) categoryId = newCat.id;
        }
      }

      const articleSlug = customSlug || generateSlug(title);
      const readTime = estimateReadTime(content);

      const { data: article, error } = await supabase
        .from("blog_articles")
        .insert({
          title,
          slug: articleSlug,
          content,
          excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
          category_id: categoryId,
          image_url: image_url || null,
          author: author || "Equipe Aissociate",
          read_time: readTime,
          published: published !== false,
          seo_title: seo_title || title,
          seo_description: seo_description || excerpt || null,
          seo_keywords: seo_keywords || null,
          published_at: new Date().toISOString(),
        })
        .select("id, slug, title, published")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, article }),
        {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "PUT") {
      const body = await req.json();
      const { slug, ...updates } = body;

      if (!slug) {
        return new Response(
          JSON.stringify({ error: "slug is required to update an article" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (updates.content) {
        updates.read_time = estimateReadTime(updates.content);
      }

      if (updates.category) {
        const catName = updates.category;
        delete updates.category;
        const { data: cat } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", generateSlug(catName))
          .maybeSingle();
        if (cat) updates.category_id = cat.id;
      }

      const { data: article, error } = await supabase
        .from("blog_articles")
        .update(updates)
        .eq("slug", slug)
        .select("id, slug, title, published")
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, article }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      const { slug } = body;

      if (!slug) {
        return new Response(
          JSON.stringify({ error: "slug is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { error } = await supabase
        .from("blog_articles")
        .update({ published: false })
        .eq("slug", slug);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Article unpublished" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
