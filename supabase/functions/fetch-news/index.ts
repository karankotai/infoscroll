import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TOPIC_PROMPTS: Record<string, string> = {
  ai_ml: "latest AI and machine learning news, breakthroughs, and industry developments",
  system_design: "notable system architecture decisions, outages, and engineering blog highlights from major tech companies",
  politics: "major world politics events, geopolitical shifts, and policy changes",
  economics: "global economic news, market trends, and notable economic policy changes",
  tech: "tech industry news, startup funding, product launches, and executive moves",
  psychology: "recent psychology research findings, studies, and behavioral science insights",
  novels: "literary news, book awards, notable author interviews, and publishing industry updates",
  space: "space exploration news, NASA/ESA/SpaceX updates, astronomical discoveries",
};

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get("topic");

    if (!topic || !TOPIC_PROMPTS[topic]) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing topic parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check cache first
    const { data: cached } = await supabase
      .from("news_cache")
      .select("content")
      .eq("topic", topic)
      .gt("expires_at", new Date().toISOString())
      .order("fetched_at", { ascending: false })
      .limit(5);

    if (cached && cached.length > 0) {
      return new Response(JSON.stringify({ cards: cached.map((c) => c.content), source: "cache" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cache miss — call Gemini
    const prompt = `Generate 5 news cards about ${TOPIC_PROMPTS[topic]} from the past 24 hours.

Each card must be a JSON object with this exact structure:
{
  "title": "Short headline (under 80 chars)",
  "content": {
    "fact": "The key news in 1-2 sentences",
    "context": "Why this matters and broader context in 2-3 sentences"
  },
  "difficulty": "casual"
}

Return ONLY a JSON array of 5 cards. No markdown, no explanation.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    // Parse JSON from Gemini response (strip markdown fences if present)
    const jsonStr = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const newsCards = JSON.parse(jsonStr);

    // Cache each card
    const cacheInserts = newsCards.map((card: Record<string, unknown>) => ({
      topic,
      content: {
        topic,
        card_type: "quick_fact",
        title: card.title,
        content: card.content,
        source: "gemini_news",
        difficulty: card.difficulty || "casual",
      },
    }));

    await supabase.from("news_cache").insert(cacheInserts);

    return new Response(
      JSON.stringify({ cards: cacheInserts.map((c) => c.content), source: "gemini" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch news", detail: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
