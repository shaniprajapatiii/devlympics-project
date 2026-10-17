'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Bot,
  Check,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const starterPrompts = [
  'Explain what Dialectica does',
  'How does this bridge accessibility gaps?',
  'Help me simplify a complex idea',
];

const welcomeMessage: ChatMessage = {
  id: 0,
  role: 'assistant',
  content:
    'Hi, I’m the Bridge Guide. I can translate complex ideas into clear next steps, explain how Dialectica connects people and technology, or help you find the right starting point.',
};

export default function BridgeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const nextId = useRef(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (event?: FormEvent, prompt?: string) => {
    event?.preventDefault();
    const content = (prompt ?? input).trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: 'user',
      content,
    };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/bridge-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: conversation.slice(-8).map(({ role, content: text }) => ({
            role,
            content: text,
          })),
        }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Unable to get a response');
      }

      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: 'assistant', content: data.reply! },
      ]);
    } catch (error) {
      console.error('Bridge chatbot error:', error);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: 'assistant',
          content:
            'I could not reach the bridge right now. Please try again, or explore the dashboard to experience the interaction layer.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section
          aria-label="Bridge Guide chatbot"
          className={`w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-950/95 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl transition-all sm:w-[390px] ${
            isMinimized ? 'h-auto' : 'h-[min(620px,calc(100vh-7rem))]'
          }`}
        >
          <header className="flex items-center justify-between border-b border-neutral-800 bg-gradient-to-r from-cyan-950/50 to-neutral-950 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400 text-neutral-950">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Bridge Guide</h2>
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">Making complex things easier to cross</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={isMinimized ? 'Expand chatbot' : 'Minimize chatbot'}
                onClick={() => setIsMinimized((current) => !current)}
                className="rounded-lg p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Close chatbot"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {!isMinimized && (
            <>
              <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'items-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <p
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-white text-neutral-950'
                          : 'rounded-tl-md bg-neutral-900 text-neutral-200'
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-center gap-2.5 text-sm text-neutral-400">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    </div>
                    <span>Finding the clearest path...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(undefined, prompt)}
                      className="rounded-full border border-neutral-700 px-3 py-1.5 text-left text-[11px] text-neutral-300 transition hover:border-cyan-400/60 hover:text-cyan-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={sendMessage} className="border-t border-neutral-800 p-3">
                <div className="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/80 p-1.5 focus-within:border-cyan-400/60">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask the Bridge Guide..."
                    maxLength={1200}
                    aria-label="Message the Bridge Guide"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    aria-label="Send message"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-neutral-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] text-neutral-600">
                  <Check className="h-3 w-3" />
                  Your message stays within this conversation
                </p>
              </form>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        aria-label={isOpen ? 'Close Bridge Guide' : 'Open Bridge Guide'}
        onClick={() => {
          setIsOpen((current) => !current);
          setIsMinimized(false);
        }}
        className="group flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400 px-4 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-300"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline">{isOpen ? 'Close guide' : 'Ask the Bridge Guide'}</span>
      </button>
    </div>
  );
}
