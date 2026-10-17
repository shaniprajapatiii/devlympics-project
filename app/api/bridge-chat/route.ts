import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '@/lib/ai/geminiService';

interface ChatRequest {
  message?: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 1200) {
      return NextResponse.json(
        { error: 'Message must be 1200 characters or fewer' },
        { status: 400 }
      );
    }

    const history = Array.isArray(body.history)
      ? body.history
          .filter(
            (entry) =>
              (entry.role === 'user' || entry.role === 'assistant') &&
              typeof entry.content === 'string'
          )
          .slice(-8)
      : [];

    const reply = await GeminiService.chatWithBridge(message, history);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error('API Error /api/bridge-chat:', error);
    return NextResponse.json(
      { error: 'The bridge is temporarily unavailable' },
      { status: 500 }
    );
  }
}
