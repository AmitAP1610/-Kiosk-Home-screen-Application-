/**
 * Sri Sri University Knowledge & Query Retrieval Service
 * Matches user voice or text queries against verified university data.
 * Adheres strictly to verified SSU facts with no hallucinations.
 */

import { UNIVERSITY_INFO } from '../data/universityInfo';
import { UNIVERSITY_FAQS, UniversityFAQ } from '../data/universityFAQs';
import { FaceExpression } from '../types/robot';

export interface KnowledgeMatchResult {
  text: string;
  source: 'faq' | 'faculty' | 'facility' | 'contact' | 'identity' | 'fallback';
  confidence: number;
  suggestedExpression: FaceExpression;
  matchedEntityId?: string;
  actionUrl?: string;
}

class UniversityKnowledgeService {
  /**
   * Generates opening welcome speech text based on user preference.
   */
  public getWelcomeSpeech(lang: string = 'en-IN'): string {
    const isHindi = lang.toLowerCase().startsWith('hi');
    if (isHindi) {
      return "नमस्ते! श्री श्री यूनिवर्सिटी में आपका स्वागत है। मैं आपका एआई कैंपस सहायक हूँ। श्री श्री यूनिवर्सिटी समग्र शिक्षा और मानवीय मूल्यों का सुंदर संगम है। आज मैं आपकी क्या सहायता कर सकता हूँ?";
    }
    return "Hello! Welcome to Sri Sri University. I am your AI campus assistant. Sri Sri University brings together modern innovation and traditional values to create a holistic learning experience. How can I help you today?";
  }

  /**
   * Finds the most relevant verified campus answer for a user query.
   */
  public query(userQuery: string, lang: string = 'en-IN'): KnowledgeMatchResult {
    const cleanQuery = userQuery.trim().toLowerCase();
    const isHindi = lang.toLowerCase().startsWith('hi') || /[\u0900-\u097F]/.test(userQuery);

    if (!cleanQuery) {
      return {
        text: isHindi
          ? "कृपया अपना प्रश्न पूछें। मैं श्री श्री यूनिवर्सिटी के बारे में किसी भी जानकारी में आपकी सहायता कर सकता हूँ।"
          : "Please ask your question. I can assist you with any verified information regarding Sri Sri University.",
        source: 'identity',
        confidence: 1.0,
        suggestedExpression: 'attentive'
      };
    }

    // 1. Identity & Greeting Routing
    if (
      cleanQuery.includes('who are you') ||
      cleanQuery.includes('your name') ||
      cleanQuery.includes('तुम कौन हो') ||
      cleanQuery.includes('तुम्हारा नाम') ||
      cleanQuery.includes('आपका नाम')
    ) {
      return {
        text: isHindi
          ? "मैं कियोस्क (Kiosk) हूँ, श्री श्री यूनिवर्सिटी का आधिकारिक एआई कैंपस सहायक। मैं आगंतुकों और छात्रों को विश्वविद्यालय, पाठ्यक्रमों, सुविधाओं और परिसर मार्गदर्शन में सहायता प्रदान करता हूँ।"
          : "I am Kiosk, the official AI Campus Assistant for Sri Sri University. I help visitors and students navigate our 188-acre campus, explore academic courses, discover facilities, and check today's agenda.",
        source: 'identity',
        confidence: 0.98,
        suggestedExpression: 'happy'
      };
    }

    if (
      cleanQuery.includes('hello') ||
      cleanQuery.includes('hi') ||
      cleanQuery.includes('hey') ||
      cleanQuery.includes('नमस्ते') ||
      cleanQuery.includes('नमस्कार') ||
      cleanQuery.includes('प्रणाम')
    ) {
      return {
        text: this.getWelcomeSpeech(lang),
        source: 'identity',
        confidence: 0.95,
        suggestedExpression: 'happy'
      };
    }

    // 2. Direct Match in Structured FAQs
    let bestFaq: UniversityFAQ | null = null;
    let maxFaqScore = 0;

    for (const faq of UNIVERSITY_FAQS) {
      let score = 0;
      const qTokens = cleanQuery.split(/\s+/);

      // Check keywords
      for (const kw of faq.keywords) {
        if (cleanQuery.includes(kw.toLowerCase())) {
          score += 3;
        }
      }

      // Check question text overlap
      const faqTextEn = faq.questionEn.toLowerCase();
      const faqTextHi = faq.questionHi.toLowerCase();

      for (const token of qTokens) {
        if (token.length > 2) {
          if (faqTextEn.includes(token)) score += 2;
          if (faqTextHi.includes(token)) score += 2;
        }
      }

      if (score > maxFaqScore) {
        maxFaqScore = score;
        bestFaq = faq;
      }
    }

    if (bestFaq && maxFaqScore >= 4) {
      return {
        text: isHindi ? bestFaq.answerHi : bestFaq.answerEn,
        source: 'faq',
        confidence: Math.min(1.0, maxFaqScore / 10),
        suggestedExpression: 'happy',
        matchedEntityId: bestFaq.id
      };
    }

    // 3. Match against Specific Academic Faculties
    for (const fac of UNIVERSITY_INFO.faculties) {
      const facName = fac.name.toLowerCase();
      const facId = fac.id.toLowerCase();
      if (
        cleanQuery.includes(facId) ||
        cleanQuery.includes(facName) ||
        fac.degrees.some(d => cleanQuery.includes(d.toLowerCase())) ||
        fac.featuredPrograms.some(p => cleanQuery.includes(p.toLowerCase()))
      ) {
        const text = isHindi
          ? `श्री श्री यूनिवर्सिटी का ${fac.name} उच्च गुणवत्ता वाले कार्यक्रम प्रदान करता है जैसे: ${fac.featuredPrograms.slice(0, 3).join(', ')}। इसमें ${fac.degrees.join(', ')} की डिग्रियां उपलब्ध हैं।`
          : `The ${fac.name} at Sri Sri University offers prestigious degrees including ${fac.degrees.join(', ')}. Key programs include: ${fac.featuredPrograms.slice(0, 3).join(', ')}.`;

        return {
          text,
          source: 'faculty',
          confidence: 0.88,
          suggestedExpression: 'happy',
          matchedEntityId: fac.id,
          actionUrl: UNIVERSITY_INFO.officialLinks.admissions
        };
      }
    }

    // 4. Match against Campus Facilities
    for (const fac of UNIVERSITY_INFO.facilities) {
      const facName = fac.name.toLowerCase();
      const facId = fac.id.toLowerCase();
      if (cleanQuery.includes(facId) || cleanQuery.includes(facName)) {
        const text = isHindi
          ? `${fac.name} (${fac.location}) में स्थित है। ${fac.description}`
          : `${fac.name} is located at ${fac.location}. ${fac.description}`;

        return {
          text,
          source: 'facility',
          confidence: 0.85,
          suggestedExpression: 'happy',
          matchedEntityId: fac.id,
          actionUrl: UNIVERSITY_INFO.officialLinks.facilities
        };
      }
    }

    // 5. Contact / Phone / Email Query
    if (
      cleanQuery.includes('contact') ||
      cleanQuery.includes('phone') ||
      cleanQuery.includes('email') ||
      cleanQuery.includes('call') ||
      cleanQuery.includes('नंबर') ||
      cleanQuery.includes('फोन') ||
      cleanQuery.includes('संपर्क')
    ) {
      const adm = UNIVERSITY_INFO.contacts.find(c => c.department.includes('Admissions')) || UNIVERSITY_INFO.contacts[0];
      const text = isHindi
        ? `आप श्री श्री यूनिवर्सिटी एडमिशन कार्यालय से फ़ोन नंबर ${adm.phone} या ईमेल ${adm.email} पर संपर्क कर सकते हैं। अधिक जानकारी वेबसाइट https://srisriuniversity.edu.in पर उपलब्ध है।`
        : `You can reach the Sri Sri University Admissions Desk via phone at ${adm.phone} or email at ${adm.email}. The official portal is https://srisriuniversity.edu.in.`;

      return {
        text,
        source: 'contact',
        confidence: 0.9,
        suggestedExpression: 'attentive',
        actionUrl: UNIVERSITY_INFO.officialLinks.contactUs
      };
    }

    // 6. Safe Fallback - Never Invent Facts
    const fallbackText = isHindi
      ? "मुझे इस विशिष्ट विषय पर सत्यापित जानकारी उपलब्ध नहीं है। कृपया सटीक एवं आधिकारिक जानकारी के लिए श्री श्री यूनिवर्सिटी की आधिकारिक वेबसाइट srisriuniversity.edu.in पर जाएं या हमारे प्रवेश कार्यालय से +91-7894424562 पर संपर्क करें।"
      : "I do not have verified information on that specific topic. Please visit the official Sri Sri University website at srisriuniversity.edu.in or contact the help desk at +91-7894424562 for authentic guidance.";

    return {
      text: fallbackText,
      source: 'fallback',
      confidence: 0.2,
      suggestedExpression: 'thinking',
      actionUrl: UNIVERSITY_INFO.officialLinks.website
    };
  }
}

export const universityKnowledge = new UniversityKnowledgeService();
