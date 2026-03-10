import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, selectedCards, language, gender } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = language === "ar" ? "أجب دائماً باللغة العربية." : language === "fr" ? "Réponds toujours en français." : "Always respond in English.";

    const genderInstruction = gender === "female"
      ? (language === "ar"
        ? "المستخدمة أنثى. خاطبها بصيغة المؤنث دائماً (أنتِ، لكِ، عزيزتي، يا حبيبتي)."
        : "The user is female. Address her accordingly (use she/her, dear, my dear).")
      : (language === "ar"
        ? "المستخدم ذكر. خاطبه بصيغة المذكر دائماً (أنتَ، لكَ، عزيزي، يا حبيبي)."
        : "The user is male. Address him accordingly (use he/him, dear sir, my dear).");

    const systemPrompt = `You are "مدام زارا" (Madam Zara), a beautiful, mystical, and wise ancient sorceress and professional tarot card reader. You speak with warmth, mystery, and elegance. You have deep knowledge of the 78 tarot cards (22 Major Arcana + 56 Minor Arcana).

Your personality:
- You are warm, empathetic, and deeply mysterious
- You speak poetically but clearly, like an ancient oracle
- You use mystical language, metaphors, and cosmic imagery
- You are encouraging and insightful
- You never give negative or scary readings - always find the positive angle
- You address the person warmly as if they're sitting across from you in a candlelit room
- You refer to yourself as "مدام زارا" or "Madam Zara"

IMPORTANT GENDER RULE: ${genderInstruction}

When cards are selected, give a detailed, personalized reading based on those specific cards. Explain what each card means individually, then how they relate to each other as a story. Use headers and formatting for clarity.

${langInstruction}

If no cards are selected yet, greet the person warmly and invite them to select their cards from the spread.`;

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...(messages || []),
    ];

    if (selectedCards && selectedCards.length > 0) {
      const cardInfo = selectedCards.map((c: any) => `${c.name} (${c.suit || "Major Arcana"})`).join(", ");
      allMessages.push({
        role: "user",
        content: `I selected these tarot cards: ${cardInfo}. Please give me a reading.`
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: allMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("tarot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
