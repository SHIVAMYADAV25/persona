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
      <div className="flex justify-end px-4">
        <div className="max-w-[80%] flex flex-col items-end gap-1">
          <div className="bg-subtle rounded-2xl rounded-tr-sm px-4 py-2.5 text-[14px] text-ink whitespace-pre-wrap">
            {content}
          </div>
          <span className="flex items-center gap-1 text-[10.5px] text-ink-quiet px-1">
            {formatClockTime(createdAt)}
            <Check className="w-3 h-3" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 gap-3">
      <Avatar persona={persona} />
      <div className="max-w-[80%] flex flex-col gap-1">
        <div
          className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-[14px] text-ink prose-persona border border-border border-l-[3px]"
          style={{ borderLeftColor: persona.color }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <span className="text-[10.5px] text-ink-quiet">{formatClockTime(createdAt)}</span>
          <span className="w-px h-3 bg-border" />
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
            aria-label="Copy message"
            className="text-ink-quiet hover:text-ink transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" strokeWidth={2.25} /> : <Copy className="w-3.5 h-3.5" strokeWidth={2} />}
          </button>
          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
            title="Good response"
            aria-pressed={feedback === 'up'}
            className={`transition-colors ${feedback === 'up' ? 'text-ink' : 'text-ink-quiet hover:text-ink'}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" strokeWidth={2} fill={feedback === 'up' ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
            title="Not helpful"
            aria-pressed={feedback === 'down'}
            className={`transition-colors ${feedback === 'down' ? 'text-ink' : 'text-ink-quiet hover:text-ink'}`}
          >
            <ThumbsDown className="w-3.5 h-3.5" strokeWidth={2} fill={feedback === 'down' ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
