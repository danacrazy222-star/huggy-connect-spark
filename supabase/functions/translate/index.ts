import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_MAP: Record<string, string> = {
  en: "English", ar: "Arabic", fr: "French", es: "Spanish",
  tr: "Turkish", de: "German", it: "Italian", pt: "Portuguese",
  ru: "Russian", hi: "Hindi",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, targetLang } = await req.json();
    const langName = LANG_MAP[targetLang] || "English";

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        stream: false,
        messages: [
          { role: "system", content: `You are a translator. Translate the following text to ${langName}. Return ONLY the translated text, nothing else.` },
          { role: "user", content: text },
        ],
        max_tokens: 500,
      }),
    });

    const rawText = await res.text();
    
    // Handle SSE streaming response
    let translated = text;
    if (rawText.startsWith("data:")) {
      const lines = rawText.split("\n").filter(l => l.startsWith("data:") && !l.includes("[DONE]"));
      const parts: string[] = [];
      for (const line of lines) {
        try {
          const json = JSON.parse(line.slice(5).trim());
          const content = json.choices?.[0]?.delta?.content || json.choices?.[0]?.message?.content || "";
          if (content) parts.push(content);
        } catch { /* skip unparseable lines */ }
      }
      translated = parts.join("") || text;
    } else {
      try {
        const data = JSON.parse(rawText);
        translated = data.choices?.[0]?.message?.content?.trim() || text;
      } catch {
        translated = text;
      }
    }

    return new Response(JSON.stringify({ translated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
