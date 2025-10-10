import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development - in production, API calls should go through backend
})

// EezLegal system prompt based on the pasted_content.txt requirements
const EEZLEGAL_SYSTEM_PROMPT = `You are EezLegal, a plain-English legal assistant that explains documents, flags risks, drafts simple templates, and suggests next steps for freelancers, tenants, and small business owners.

## Core Principles:
- Communicate in clear, concise, non-jargony language
- Mirror ChatGPT's interaction style: friendly, curious, helpful
- Stay in your lane: not a law firm, not legal advice; provide general information + drafting aid
- Always include appropriate disclaimers

## Response Structure Template:
Use this structure for most responses:

**TL;DR:** (1 line - Plain-English answer to the user's goal)

**What this means:** (2–5 bullets - Key points only. Define any unavoidable terms)

**Risks & gotchas:** (0–4 bullets - Prioritize likelihood × impact. Keep concise)

**Next steps:**
1) Immediate action(s) the user can take
2) Optional: alternative path or DIY tip

**Want me to help you get started?**
Create a free account to save this conversation and upload documents for analysis.

## Voice & Tone:
- Friendly, practical, straight to the point
- Avoid legal jargon; when unavoidable, define it in one short sentence
- Default length: short to medium
- Use bullets and mini-headings for readability
- Never scold or over-qualify; assume user is smart, just busy

## Always Include Disclaimer:
End responses with: "*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*"

## Domain-Specific Guidelines:
- For jurisdiction uncertainty → ask the user's location or document's governing law
- For complex or high-stakes matters → recommend speaking to a licensed lawyer
- For conflicting facts → ask a focused follow-up; don't invent

## CTA Integration:
Naturally include calls-to-action like:
- "Upload your document for detailed review"
- "Create a free account to save this analysis"
- "Want me to draft a template for this?"

Remember: You provide general information and drafting assistance, not legal advice.`

export class OpenAIService {
  constructor() {
    this.model = 'gpt-4.1-mini' // Using the available model from environment
  }

  async generateResponse(message, conversationHistory = [], userContext = {}) {
    try {
      // Prepare conversation history
      const messages = [
        {
          role: 'system',
          content: EEZLEGAL_SYSTEM_PROMPT
        }
      ]

      // Add conversation history
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      })

      // Add current user message
      messages.push({
        role: 'user',
        content: message
      })

      // Add user context if available
      if (userContext.isLoggedIn) {
        messages[0].content += `\n\nUser Context: The user is logged in${userContext.isPro ? ' with Pro features' : ' with free account'}.`
      }

      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })

      const response = completion.choices[0]?.message?.content

      if (!response) {
        throw new Error('No response generated')
      }

      return {
        success: true,
        message: response,
        usage: completion.usage
      }

    } catch (error) {
      console.error('OpenAI API Error:', error)
      
      // Return fallback response
      return {
        success: false,
        error: error.message,
        fallbackMessage: this.generateFallbackResponse(message)
      }
    }
  }

  generateFallbackResponse(userMessage) {
    // Fallback response following EezLegal format
    const responses = [
      {
        condition: userMessage.toLowerCase().includes('nda') || userMessage.toLowerCase().includes('non-disclosure'),
        response: `**TL;DR:** NDAs protect confidential information between parties.

**What this means:**
• Both parties agree not to share each other's confidential information
• Usually covers business plans, customer lists, trade secrets
• Typically lasts 2-5 years after the relationship ends

**Risks & gotchas:**
• Overly broad NDAs can limit your future work opportunities
• Make sure "confidential information" is clearly defined
• Check if there are reasonable exceptions (public info, prior knowledge)

**Next steps:**
1. Upload your NDA document for detailed clause-by-clause review
2. Ask about specific terms you don't understand

**Want me to help you get started?**
Create a free account to save this analysis and get personalized recommendations.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
      },
      {
        condition: userMessage.toLowerCase().includes('contract') || userMessage.toLowerCase().includes('agreement'),
        response: `**TL;DR:** I can help you understand contract terms and identify potential issues.

**What this means:**
• Contracts are legally binding agreements between parties
• Key elements include terms, payment, deliverables, and termination
• Understanding your obligations and rights is crucial

**Risks & gotchas:**
• Unclear terms can lead to disputes later
• Missing termination clauses can trap you in bad deals
• Payment terms should be specific and fair

**Next steps:**
1. Upload your contract for a detailed risk assessment
2. Ask about specific clauses that concern you

**Want me to help you get started?**
Create a free account to upload documents and get personalized contract analysis.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
      }
    ]

    // Find matching response or use default
    const matchedResponse = responses.find(r => r.condition)
    
    if (matchedResponse) {
      return matchedResponse.response
    }

    // Default fallback response
    return `**TL;DR:** I'm here to help with your legal question in plain English.

**What I can help with:**
• Explain legal documents and contracts
• Identify potential risks and red flags
• Draft simple templates and clauses
• Suggest next steps for your situation

**How to get the most help:**
• Be specific about your situation
• Upload documents for detailed review
• Ask about particular clauses or terms

**Next steps:**
1. Tell me more details about your specific legal question
2. Upload any relevant documents using the attach button

**Want me to help you get started?**
Create a free account to save our conversation and access advanced features.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
  }

  // Method to check if OpenAI API is properly configured
  async testConnection() {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10
      })
      
      return {
        success: true,
        model: this.model,
        response: completion.choices[0]?.message?.content
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default new OpenAIService()
