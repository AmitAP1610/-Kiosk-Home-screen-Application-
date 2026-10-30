/**
 * AI Assistant Conversation Service for Sri Sri University
 * Manages conversation context and queries online AI APIs (OpenAI / Gemini / Anthropic / Local LLM)
 * or provides on-device verified Sri Sri University campus intelligence when offline or without an API key.
 * 
 * Invariant: Private API keys are retrieved strictly from the tablet's browser localStorage
 * and are never hardcoded or exposed in frontend source code.
 */

import { FaceExpression } from '../types/robot';
import { universityKnowledge } from './universityKnowledgeService';
import { UNIVERSITY_INFO } from '../data/universityInfo';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

export interface AIResponse {
  text: string;
  suggestedExpression?: FaceExpression;
  movementCommand?: { linear: number; angular: number };
  error?: string;
  source?: string;
}

class AIService {
  private systemPrompt = `You are the official AI Campus Assistant for Sri Sri University (SSU), Cuttack, Odisha.
Sri Sri University was founded in 2009 by Poojya Gurudev Sri Sri Ravi Shankar on a 188-acre green campus.
The university motto is "Learn, Lead, Serve".
Key facilities include the Central Library (Shruti Academic Complex), Sri Sri Ayurveda Hospital (100+ beds), Kaushalya Incubation Centre, and Annapurna Dining Hall (100% pure vegetarian Sattvic food).
Answer concisely in 1 to 3 clear, warm, spoken sentences suitable for text-to-speech audio.
Always prioritize verified university facts. Never hallucinate buildings, phone numbers, or unverified claims.
Support English and Hindi seamlessly. Be courteous, respectful, and articulate.`;

  /**
   * Generates response for user query with conversation context.
   */
  public async getResponse(
    userText: string,
    history: ChatMessage[] = [],
    language: string = 'en-IN'
  ): Promise<AIResponse> {
    const provider = localStorage.getItem('kairo_ai_provider') || 'mock';
    const apiKey = localStorage.getItem('kairo_ai_api_key')?.trim() || '';

    // If an online API key is supplied, query the respective cloud provider
    if (apiKey && provider !== 'mock') {
      try {
        if (provider === 'gemini') {
          return await this.callGeminiAPI(userText, apiKey, history);
        } else if (provider === 'openai') {
          return await this.callOpenAIAPI(userText, apiKey, history);
        } else if (provider === 'anthropic') {
          return await this.callAnthropicAPI(userText, apiKey, history);
        } else if (provider === 'local') {
          return await this.callLocalLLM(userText, history);
        }
      } catch (err: any) {
        console.warn(`Online AI Provider [${provider}] failed, falling back to on-device response:`, err);
        // Fall through to on-device dialogue handler
      }
    }

    // On-device intelligent dialogue fallback
    return this.generateOnDeviceResponse(userText, language);
  }

  /**
   * Google Gemini API Integration
   */
  private async callGeminiAPI(userText: string, apiKey: string, history: ChatMessage[]): Promise<AIResponse> {
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${this.systemPrompt}\n\nVerified Campus Info:\n${UNIVERSITY_INFO.name}, ${UNIVERSITY_INFO.address.fullFormatted}. Motto: ${UNIVERSITY_INFO.motto}.\n\nUser: ${userText}` }]
      }
    ];

    // Include recent history
    const recent = history.slice(-4);
    for (const msg of recent) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      } as any);
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return this.parseAndEnrichResponse(replyText);
  }

  /**
   * OpenAI GPT API Integration
   */
  private async callOpenAIAPI(userText: string, apiKey: string, history: ChatMessage[]): Promise<AIResponse> {
    const messages = [
      { role: 'system', content: `${this.systemPrompt}\n\nAddress: ${UNIVERSITY_INFO.address.fullFormatted}. Website: ${UNIVERSITY_INFO.officialLinks.website}` },
      ...history.slice(-4).map(m => ({ role: m.role, content: m.text })),
      { role: 'user', content: userText }
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 160,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data.choices?.[0]?.message?.content || '';
    return this.parseAndEnrichResponse(replyText);
  }

  /**
   * Anthropic Claude API Integration
   */
  private async callAnthropicAPI(userText: string, apiKey: string, history: ChatMessage[]): Promise<AIResponse> {
    const messages = [
      ...history.slice(-4).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      })),
      { role: 'user', content: userText }
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        system: this.systemPrompt,
        max_tokens: 160,
        messages
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Anthropic API error: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data.content?.[0]?.text || '';
    return this.parseAndEnrichResponse(replyText);
  }

  /**
   * Local LAN LLM (Ollama or compatible OpenAI-compatible endpoint)
   */
  private async callLocalLLM(userText: string, _history: ChatMessage[]): Promise<AIResponse> {
    const endpoint = localStorage.getItem('kairo_local_llm_url') || 'http://localhost:11434/api/generate';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: `${this.systemPrompt}\n\nUser: ${userText}\nAssistant:`,
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`Local LLM failed with status: ${res.status}`);
    }

    const data = await res.json();
    const replyText = data.response || data.choices?.[0]?.message?.content || '';
    return this.parseAndEnrichResponse(replyText);
  }

  /**
   * Evaluates text for robot movement intent or facial expression cues
   */
  private parseAndEnrichResponse(text: string): AIResponse {
    let suggestedExpression: FaceExpression = 'speaking';
    let movementCommand: { linear: number; angular: number } | undefined = undefined;

    const lower = text.toLowerCase();
    if (lower.includes('happy') || lower.includes('welcome') || lower.includes('glad') || lower.includes('स्वागत')) {
      suggestedExpression = 'happy';
    } else if (lower.includes('think') || lower.includes('check') || lower.includes('सोच')) {
      suggestedExpression = 'thinking';
    } else if (lower.includes('error') || lower.includes('fail') || lower.includes('sorry')) {
      suggestedExpression = 'confused';
    }

    if (lower.includes('[move:forward]') || lower.includes('moving forward')) {
      movementCommand = { linear: 0.25, angular: 0.0 };
    } else if (lower.includes('[move:stop]') || lower.includes('stopping')) {
      movementCommand = { linear: 0.0, angular: 0.0 };
    }

    return {
      text: text.replace(/\[move:[^\]]+\]/g, '').trim(),
      suggestedExpression,
      movementCommand,
      source: 'cloud-ai'
    };
  }

  /**
   * Intelligent On-Device Natural Dialogue Fallback (English & Hindi)
   * Powered by the Sri Sri University Verified Knowledge Base.
   */
  private generateOnDeviceResponse(input: string, lang = 'en-IN'): AIResponse {
    const lower = input.trim().toLowerCase();
    const isHindi = lang.startsWith('hi') || /[\u0900-\u097F]/.test(input);

    // Physical Movement Control commands (Forwarded safely to Jetson/Arduino Layer)
    if (lower.includes('move forward') || lower.includes('go forward') || lower.includes('आगे बढ़ो') || lower.includes('आगे चलो')) {
      return {
        text: isHindi
          ? 'आगे बढ़ने का निर्देश दर्ज किया गया। जेटसन सुरक्षा प्रणाली मार्ग की जाँच कर रही है।'
          : 'Acknowledged. Requesting safe forward trajectory from Jetson safety layer.',
        suggestedExpression: 'thinking',
        movementCommand: { linear: 0.3, angular: 0.0 },
        source: 'teleop-safety'
      };
    }

    if (lower.includes('stop') || lower.includes('halt') || lower.includes('रुको') || lower.includes('रुक जाओ')) {
      return {
        text: isHindi
          ? 'रोबोट रुक गया है। गति शून्य कर दी गई है।'
          : 'Robot motion stopped. Velocity reset to zero.',
        suggestedExpression: 'idle',
        movementCommand: { linear: 0.0, angular: 0.0 },
        source: 'teleop-safety'
      };
    }

    if (lower.includes('sleep') || lower.includes('standby') || lower.includes('सो जाओ') || lower.includes('आराम करो')) {
      return {
        text: isHindi
          ? 'श्री श्री यूनिवर्सिटी कैंपस असिस्टेंट स्टैंडबाय मोड में जा रहा है। शुभ रात्रि!'
          : 'Entering standby mode. Have a wonderful and peaceful day at Sri Sri University!',
        suggestedExpression: 'sleep',
        source: 'system'
      };
    }

    if (lower.includes('wake up') || lower.includes('wake') || lower.includes('उठो') || lower.includes('जागो')) {
      return {
        text: isHindi
          ? 'सुप्रभात! श्री श्री यूनिवर्सिटी एआई कैंपस सहायक पूरी तरह सक्रिय है। आज मैं आपकी क्या सहायता कर सकता हूँ?'
          : 'Good day! All campus assistant systems are active. Welcome to Sri Sri University. How can I help you today?',
        suggestedExpression: 'wakeup',
        source: 'system'
      };
    }

    // Query Verified University Knowledge Base
    const result = universityKnowledge.query(input, lang);
    return {
      text: result.text,
      suggestedExpression: result.suggestedExpression,
      source: `university-${result.source}`
    };
  }
}

export const aiService = new AIService();
