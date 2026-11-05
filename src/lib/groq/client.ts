import Groq from 'groq-sdk'

let groqClient: Groq | null = null

export function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groqClient
}

export async function generateAIResponse(
  systemPrompt: string,
  userMessage: string,
  model: string = 'llama-3.1-70b-versatile'
): Promise<string> {
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

  return completion.choices[0]?.message?.content || ''
}
