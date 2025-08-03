import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MEDICAID_REQUIREMENTS = `
FEDERAL MEDICAID ELIGIBILITY REQUIREMENTS (HR1):
1. Age: All ages eligible
2. Income: Must be below 138% of Federal Poverty Level (FPL)
3. Residency: Must be US resident 
4. Immigration Status: US citizens, permanent residents, or qualified immigrants
5. Medical Conditions: No specific requirements for expansion Medicaid

HEALTHY SF (San Francisco Fallback):
1. Age: All ages
2. Income: Up to 500% FPL for some services
3. Residency: Must live in San Francisco
4. Immigration Status: No restrictions
5. Covers: Primary care, specialty care, medications, emergency services

COMMON NEXT STEPS WHEN NOT ELIGIBLE:
- Gather missing income documentation
- Apply for immigration status changes if applicable
- Explore Healthy SF as alternative
- Check employer health plans
- Look into healthcare.gov marketplace plans
- Consider temporary coverage options
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, eligibilityResults, screenerData, chatHistory } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create context from user data
    const userContext = `
USER SCREENING DATA:
- Age: ${screenerData?.age || 'Not provided'}
- ZIP Code: ${screenerData?.zipCode || 'Not provided'}
- Employment: ${screenerData?.employmentStatus || 'Not provided'}
- Monthly Hours: ${screenerData?.monthlyHours || 'Not provided'}
- Monthly Income: ${screenerData?.monthlyIncome || 'Not provided'}
- Immigration Status: ${screenerData?.immigrationStatus || 'Not provided'}
- Medical Conditions: ${screenerData?.medicalConditions?.join(', ') || 'None reported'}
- Dependents Under 14: ${screenerData?.dependentsUnder14 || 0}

ELIGIBILITY RESULTS:
- Status: ${eligibilityResults?.eligible ? 'Eligible' : 'Not Eligible'}
- Programs: ${eligibilityResults?.programs?.join(', ') || 'None'}
- Message: ${eligibilityResults?.message || 'No specific message'}

CHAT HISTORY:
${chatHistory?.map((msg: any) => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n') || 'No previous messages'}
`;

    const systemPrompt = `You are a helpful eligibility assistant for Medicaid and health coverage programs. 

${MEDICAID_REQUIREMENTS}

Based on the user's screening data and eligibility results, provide personalized guidance on:
1. Why they may not be eligible for certain programs
2. What specific documents or steps they need
3. Alternative programs they should consider (especially Healthy SF)
4. Concrete next steps with contact information when possible

Be empathetic, clear, and actionable. Focus on solutions and alternatives. If they're not eligible for federal Medicaid, emphasize Healthy SF as a great option for San Francisco residents.

USER CONTEXT:
${userContext}

Keep responses concise but helpful. Provide specific guidance based on their situation.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Eligibility chat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process chat message',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});