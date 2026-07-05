import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import PersonaSwitchList from './PersonaSwitchList';
import type { Persona, PersonaId } from '../types';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  persona: Persona;
  personas: Persona[];
  onSwitchPersona: (id: PersonaId) => void;
}

export default function ChatInput({
  onSend,
  disabled,
  persona,
  personas,
  onSwitchPersona,
}: ChatInputProps) {
  const [value, setValue] = useState<string>('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function submit(e: FormEvent): void {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      submit(e);
    }
  }

  return (
    <form onSubmit={submit} className="p-3 border-t border-white/5">
      <div className="rounded-2xl bg-panelLight overflow-hidden">
        <div className="flex items-start gap-2 px-4 pt-3">
          <span className="text-parchment/40 text-sm mt-0.5" aria-hidden>
            ✨
          </span>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent resize-none outline-none text-sm text-parchment placeholder:text-parchment/30 py-1 max-h-32"
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-parchment/70 hover:text-parchment transition-colors"
            >
              <span
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: persona.color }}
                aria-hidden
              />
              {persona.displayName.split(' ')[0]}&rsquo;s Perspective
              <span className="text-parchment/40">⌄</span>
            </button>

            {pickerOpen && (
              <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-white/10 bg-panel shadow-2xl p-2 z-20">
                <PersonaSwitchList
                  personas={personas}
                  activeId={persona.id}
                  onSwitch={(id) => {
                    onSwitchPersona(id);
                    setPickerOpen(false);
                  }}
                  compact
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-display font-semibold disabled:opacity-30 transition-opacity bg-parchment text-ink"
          >
            Send <span aria-hidden>➤</span>
          </button>
        </div>
      </div>
      <p className="text-[10px] text-parchment/25 mt-1.5 px-1 font-mono">
        Enter to send · Shift+Enter for new line
      </p>
    </form>
  );
}
