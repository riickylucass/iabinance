import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { imageUrl, currentPrice } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'URL da imagem é obrigatória' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const prompt = `Você é um trader especialista em análise técnica de criptomoedas. Analise este gráfico de trading e forneça:

1. Ativo identificado (ex: BTC/USDT, ETH/USDT)
2. Timeframe do gráfico (ex: 15m, 1h, 4h, 1d)
3. Preço atual aproximado no gráfico (se visível)
4. Tipo de sinal: LONG ou SHORT
5. Padrões técnicos identificados (ex: Triângulo Ascendente, Engolfo de Alta, etc)
6. Níveis de suporte identificados
7. Níveis de resistência identificados
8. Ponto de entrada sugerido (preço específico)
9. Stop-loss sugerido (preço específico)
10. 4 alvos de take-profit progressivos (preços específicos)
11. Alavancagem recomendada (1x-20x)
12. Score de confiança (0-100)
13. Análise detalhada em português (2-3 parágrafos explicando o raciocínio)

IMPORTANTE:
- Use APENAS os preços visíveis no gráfico enviado
- Seja preciso com os níveis de preço baseado no que você vê
- Se o preço atual for informado (${currentPrice}), use-o como referência
- Os alvos devem fazer sentido com a análise técnica
- Forneça uma análise profissional e realista

Responda APENAS em formato JSON válido:
{
  "asset": "BTC/USDT",
  "timeframe": "4h",
  "currentPrice": 67500.00,
  "signalType": "long",
  "patterns": ["Triângulo Ascendente", "Cruzamento Dourado"],
  "supportLevels": [65000, 64000],
  "resistanceLevels": [68000, 70000],
  "entryPrice": 67450.00,
  "stopLoss": 66800.00,
  "takeProfit1": 68200.00,
  "takeProfit2": 69500.00,
  "takeProfit3": 71000.00,
  "takeProfit4": 73500.00,
  "leverage": 5,
  "confidenceScore": 78,
  "analysis": "Análise detalhada aqui..."
}`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('Erro OpenAI:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao analisar imagem com IA' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const aiResult = await openAIResponse.json();
    const content = aiResult.choices[0].message.content;
    
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(content);
      }
    } catch (e) {
      console.error('Erro ao parsear JSON:', e, content);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar resposta da IA', details: content }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});