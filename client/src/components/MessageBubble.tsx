import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react';
import Avatar from './Avatar';
import { formatClockTime } from '../lib/date';
import type { ChatMessage, Persona } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  persona: Persona;
}

export default function MessageBubble({ message, persona }: MessageBubbleProps) {
  const { role, content, createdAt } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard may be unavailable; silently ignore */
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end px-6 py-3">
        <div className="max-w-[70%] flex flex-col items-end">
          {/* Light slate-tinted bubble background with integrated timestamp at the bottom right */}
          <div className="bg-[#f0f2f7] rounded-2xl rounded-tr-sm px-5 pt-3 pb-2 text-[14px] text-ink whitespace-pre-wrap shadow-sm">
            <div>{content}</div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-ink-quiet mt-1 select-none">
              <span>{formatClockTime(createdAt)}</span>
              <Check className="w-3 h-3 text-ink-soft" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-6 py-4 gap-4 items-start max-w-4xl">
      <Avatar persona={persona} />
      <div className="flex-1 flex flex-col gap-3">
        {/* Borderless, background-free flat text container to match reference */}
        <div className="text-[14px] text-ink prose-persona leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

        {/* Separated feedback buttons wrapped inside light discrete borders */}
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
            aria-label="Copy message"
            className="flex items-center justify-center p-1.5 rounded-lg border border-gray-200 text-ink-quiet hover:text-ink hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
          </button>
          
          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
            title="Good response"
            aria-pressed={feedback === 'up'}
            className={`flex items-center justify-center p-1.5 rounded-lg border border-gray-200 transition-colors ${
              feedback === 'up' ? 'text-ink bg-gray-50 border-gray-400' : 'text-ink-quiet hover:text-ink hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={2} fill={feedback === 'up' ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
            title="Not helpful"
            aria-pressed={feedback === 'down'}
            className={`flex items-center justify-center p-1.5 rounded-lg border border-gray-200 transition-colors ${
              feedback === 'down' ? 'text-ink bg-gray-50 border-gray-400' : 'text-ink-quiet hover:text-ink hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={2} fill={feedback === 'down' ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}