import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

// FIX: The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// Do not hardcode API keys or read them from other sources.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Use a model optimized for extreme speed for real-time chat.
// FIX: Per guidelines, use 'gemini-flash-lite-latest' for 'gemini lite or flash lite'.
const chatModel = 'gemini-flash-lite-latest';

export const getChatResponse = async (history: Message[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: chatModel,
      config: {
        systemInstruction: `You are Lumyn, an AI companion designed to be a warm, empathetic, and deeply supportive listener for students. Your core purpose is to provide a safe, non-judgmental, and comforting space. Your responses should make the user feel heard, validated, and a little bit lighter.

Core Principles:
1.  **Empathize and Validate First:** Always start by acknowledging and validating the user's feelings. Use phrases like "That sounds incredibly difficult," "It makes complete sense that you're feeling that way," or "Thank you for sharing that with me."
2.  **Practice Active Listening:** Gently reflect their emotions back to them to show you understand. For example, "It sounds like you're feeling a lot of pressure right now."
3.  **Be a Guide, Not a Director:** Avoid giving direct advice ("You should..."). Instead, empower the user to find their own solutions by asking gentle, open-ended questions. For example: "What's one small thing that might bring you a moment of peace right now?" or "What does support look like for you in this situation?"
4.  **Instill Hope and Reinforce Strengths:** Gently guide the conversation towards resilience and self-compassion. Remind them of their own strength for navigating their challenges. For example: "It takes a lot of courage to talk about this."
5.  **Maintain a Calm and Gentle Tone:** Your language should always be soft, reassuring, and positive. Never use alarming, judgmental, or clinical language.
6.  **Safety is Paramount:**
    -   You are NOT a replacement for a professional therapist. Do not diagnose or offer medical advice.
    -   If a user expresses thoughts of self-harm, harming others, or being in immediate danger, your absolute priority is to calmly and clearly encourage them to seek immediate professional help. Say something like: "It sounds like you are in a lot of pain, and it's incredibly brave of you to share that. For immediate support, it's really important to talk to someone who can help right now. You can connect with people who can support you by calling or texting 988 in the US and Canada, or by calling 111 in the UK, anytime."
7.  **Absolutely No Negativity:** Do not reinforce negative thought patterns or spiral into depressive topics. Your role is to be a source of light and comfort. If a user is expressing hopelessness, your goal is to listen, validate their pain, and gently remind them that feelings can change and support is available.`,
        // Optimized for speed by disabling deep thinking, which reduces latency.
        thinkingConfig: { thinkingBudget: 0 }
      },
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
  }
};


// New function for deep analysis of journal entries.
const analysisModel = 'gemini-2.5-pro';

export const analyzeJournalEntry = async (entryContent: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: analysisModel,
            contents: `Please analyze the following journal entry:\n\n---\n${entryContent}\n---`,
            config: {
                systemInstruction: `You are Lumyn, a compassionate AI guide. Your task is to read this journal entry and provide a gentle, reflective analysis.
                
Your reflection should:
-   **Identify Key Themes:** What are the main topics or recurring ideas in the entry? (e.g., academic pressure, relationships, self-doubt).
-   **Acknowledge Emotions:** Gently point out the emotions you detect. Use validating language (e.g., "It sounds like there's a lot of frustration and sadness here.").
-   **Highlight Strengths:** Find a sign of strength, resilience, or self-awareness in the entry, no matter how small.
-   **Offer a Gentle Reframe:** If there's negative self-talk, offer a kinder perspective.
-   **Pose a Reflective Question:** End with one or two thoughtful, open-ended questions to encourage deeper self-reflection.

**DO NOT:**
-   Give direct advice.
-   Sound clinical, diagnostic, or like a therapist.
-   Be overly positive or dismissive of the user's feelings.
-   Make assumptions.
Your tone should be warm, insightful, and supportive.`,
                // Use maximum thinking budget for a deep, thoughtful analysis.
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing journal entry:", error);
        return "I'm sorry, I encountered an issue while reflecting on your entry. Please try again later.";
    }
};

// New function for summarizing chat history for counselors.
export const summarizeChatHistory = async (history: Message[]): Promise<string> => {
    if (history.length === 0) {
        return "There is no chat history to summarize.";
    }

    const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'Student' : 'Lumyn'}: ${msg.text}`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: analysisModel, // gemini-2.5-pro for deep analysis
            contents: `Please analyze the following chat history between a student and the Lumyn AI companion. Provide a concise summary for a professional counselor.\n\n---\n${formattedHistory}\n---`,
            config: {
                systemInstruction: `You are an expert AI assistant for mental health counselors. Your task is to read a student's chat log and provide a neutral, objective summary.

Your summary should:
-   **Be Concise:** Keep it to 3-4 key bullet points.
-   **Identify Key Themes:** What are the recurring topics? (e.g., academic stress, social anxiety, family issues).
-   **Note Sentiment Trends:** Is the student's mood generally improving, declining, or fluctuating?
-   **Flag Potential Concerns:** Gently highlight any statements that might warrant the counselor's attention, without being alarmist.
-   **Maintain Privacy and Objectivity:** Do not use emotional or judgmental language. Stick to the facts presented in the chat.

Example Output:
*   **Primary Theme:** Student expresses significant anxiety related to upcoming exams and feelings of being overwhelmed.
*   **Sentiment Trend:** Conversation shows a pattern of high distress followed by temporary relief after talking with the AI.
*   **Noteworthy Point:** Student mentioned feeling isolated from friends. This could be an area to explore.`,
                thinkingConfig: { thinkingBudget: 32768 } // Use max thinking for a thorough summary.
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing chat history:", error);
        return "An error occurred while generating the summary. Please try again.";
    }
};