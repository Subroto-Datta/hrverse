import Groq from 'groq-sdk'

let groqClient: Groq | null = null

export function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key',
    })
  }
  return groqClient
}

export async function generateAIResponse(
  systemPrompt: string,
  userMessage: string,
  model: string = 'llama-3.3-70b-versatile'
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const groq = getGroqClient()
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        model,
        temperature: 0.7,
        max_tokens: 2048,
      })

      const reply = completion.choices[0]?.message?.content
      if (reply) return reply
    } catch (err: any) {
      console.warn('Groq API call encountered an issue, trying fallback model or offline knowledge:', err.message)
      
      // Try fallback model if 3.3 wasn't available
      if (model !== 'llama-3.1-8b-instant') {
        try {
          const groq = getGroqClient()
          const completion = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 2048,
          })
          const reply = completion.choices[0]?.message?.content
          if (reply) return reply
        } catch {
          // Continue to fallback
        }
      }
    }
  }

  // Fallback domain-aware pedagogical response if Groq API key is unconfigured or offline
  const query = userMessage.toLowerCase()

  if (query.includes('compa') || query.includes('compensation') || query.includes('salary')) {
    return `### Compa-Ratio & Compensation Engineering Overview
A **Compa-Ratio** measures the relationship between an employee's actual salary and the midpoint of their defined salary grade:
$$\\text{Compa-Ratio} = \\frac{\\text{Employee Actual Salary}}{\\text{Grade Midpoint}} \\times 100\\%$$

- **80% - 90% (Green-Circled):** Typically associates who are newly hired or developing proficiency.
- **95% - 105%:** Seasoned performers consistently meeting high expectations at market rate.
- **110% - 120% (Red-Circled):** Sustained top performers, key talent with specialized retention hurdles, or candidates ready for promotion.

*Tip: In your assignments, always balance internal equity (Point-Factor evaluations) with external market competitiveness (salary surveys).*`
  }

  if (query.includes('job description') || query.includes('job analysis') || query.includes('specification') || query.includes('tdr') || query.includes('ksao')) {
    return `### Job Analysis Framework: TDRs vs. KSAOs
In strategic human resource architecture:
1. **Job Description (TDRs):** Focuses on the *job itself* — Tasks, Duties, and Responsibilities.
2. **Job Specification (KSAOs):** Focuses on the *person performing the job* — Knowledge, Skills, Abilities, and Other characteristics.

When designing roles at scale, leverage the **O*NET database** or the **Position Analysis Questionnaire (PAQ)** to maintain objective legal defensibility under EEOC guidelines.`
  }

  if (query.includes('star') || query.includes('interview') || query.includes('selection')) {
    return `### The STAR Behavioral Interview Framework
Behavioral interviewing relies on the premise that *past behavior is the best predictor of future performance*:
- **Situation:** Set the context, organizational challenge, or problem.
- **Task:** Define the candidate's exact responsibility in addressing that challenge.
- **Action:** Specify the direct steps and decisions the candidate executed.
- **Result:** Quantify the business outcome (e.g., turnover reduced by 14%, cost per hire reduced by \$1,200).

*Remember to evaluate answers using standard Behaviorally Anchored Rating Scales (BARS) to minimize interviewer bias.*`
  }

  return `### HR Verse Mentor Guidance
Thank you for your question on Human Resource Management!

When analyzing HR challenges, always structure your thinking around core strategic pillars:
1. **Strategic Alignment (Ulrich Model):** Are people operations acting as an Administrative Expert, Employee Champion, Change Agent, or Strategic Partner?
2. **Metric Defensibility:** Have you calculated the business ROI (e.g., Kirkpatrick Level 4/5, Turnover Rate, Cost per Hire)?
3. **Regulatory Compliance:** Does your plan conform to statutory guidelines (FLSA, Title VII, ADA, 4/5ths Rule)?

*To unlock live real-time LLM streaming with Groq's high-speed inference, configure a valid \`GROQ_API_KEY\` from [console.groq.com](https://console.groq.com) in your \`.env.local\` file.*`
}
