import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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
      /* ignore */
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end px-4">
        <div className="max-w-[80%] flex flex-col items-end gap-1">
          <div className="bg-panelLight rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-parchment/90 whitespace-pre-wrap">
            {content}
          </div>
          <span className="flex items-center gap-1 text-[10px] text-parchment/30 font-mono px-1">
            {formatClockTime(createdAt)}
            <span aria-hidden>✓</span>
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
          className="bg-panel rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-parchment/90 prose-persona border-l-2"
          style={{ borderColor: persona.color }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-parchment/30 font-mono">{formatClockTime(createdAt)}</span>
          <span className="w-px h-3 bg-white/10" />
          <button
            type="button"
            onClick={handleCopy}
            title="Copy"
            className="text-parchment/35 hover:text-parchment/70 transition-colors text-xs"
          >
            {copied ? '✓' : '⧉'}
          </button>
          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
            title="Good response"
            className={`text-xs transition-colors ${feedback === 'up' ? 'text-parchment' : 'text-parchment/35 hover:text-parchment/70'}`}
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
            title="Not helpful"
            className={`text-xs transition-colors ${feedback === 'down' ? 'text-parchment' : 'text-parchment/35 hover:text-parchment/70'}`}
          >
            👎
          </button>
        </div>
      </div>
    </div>
  );
}
