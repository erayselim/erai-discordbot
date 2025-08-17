import 'dotenv/config';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiOptions = {
  temperature?: number;
  maxOutputTokens?: number;
  history?: ChatMessage[];
};

const DEFAULT_SYSTEM_PROMPT =
  'Sen Türkçe konuşan, zeki ve keskin dilli bir AI asistanısın. Kısa, net cevaplar verirsin. Alaycı, ironik ve sivri yorumlar yaparsın. Kullanıcıyı hafifçe trollersin ama tamamen ezici değil, eğlenceli bir şekilde. Gerektiğinde küfür eder, dalga geçersin. Bazen acımasız olabilirsin ama çoğunlukla esprili ve zekice. Emoji kullanma.';

export class AiClient {
  private client: OpenAI | null;

  constructor() {
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  isEnabled(): boolean {
    return Boolean(this.client);
  }

  async chat(userPrompt: string, options: AiOptions = {}): Promise<string> {
    if (!this.client) return 'AI devre dışı. OPENAI_API_KEY ekleyin.';
    const temperature = options.temperature ?? 0.9;
    const maxOutputTokens = options.maxOutputTokens ?? 200; // kısa cevaplar için limit
    const model = process.env.OPENAI_MODEL || 'gpt-4.1-nano';
    const history: ChatMessage[] = Array.isArray(options.history) ? options.history : [];
    // GPT-4.1 nano ve chat.completions ile tek yol
    const response = await this.client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxOutputTokens,
      messages: [
        { role: 'system', content: DEFAULT_SYSTEM_PROMPT },
        ...history.filter((m) => m && (m.role === 'user' || m.role === 'assistant')),
        { role: 'user', content: userPrompt }
      ]
    });
    if (process.env.AI_DEBUG === '1' && process.env.NODE_ENV !== 'production') {
      console.log('[AI][chat.completions]', {
        id: (response as any)?.id,
        model: (response as any)?.model,
        usage: (response as any)?.usage
      });
    }
    const text = response.choices?.[0]?.message?.content?.trim();
    return text || 'Boş yanıt.';
  }
}

export const ai = new AiClient();


