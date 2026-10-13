'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/** Edit a string[] as removable chips + an add box (tech stack, keywords, tags). */
export function ChipsInput({
  value,
  onChange,
  placeholder = 'Add and press Enter',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  function add() {
    const v = text.trim();
    if (!v) return;
    onChange([...value, v]);
    setText('');
  }
  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((chip, i) => (
            <li
              key={`${chip}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-fg"
            >
              {chip}
              <button
                type="button"
                aria-label={`Remove ${chip}`}
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-muted hover:text-red-600 dark:hover:text-red-400"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="secondary" onClick={add} disabled={!text.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
}

/** Edit a { label, value }[] list (About "quick facts"). */
export function KeyValueEditor({
  value,
  onChange,
  labelPlaceholder = 'Label',
  valuePlaceholder = 'Value',
}: {
  value: { label: string; value: string }[];
  onChange: (next: { label: string; value: string }[]) => void;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  function set(i: number, patch: Partial<{ label: string; value: string }>) {
    onChange(value.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  return (
    <div className="flex flex-col gap-2">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={row.label}
            onChange={(e) => set(i, { label: e.target.value })}
            placeholder={labelPlaceholder}
            className="flex-1"
          />
          <Input
            value={row.value}
            onChange={(e) => set(i, { value: e.target.value })}
            placeholder={valuePlaceholder}
            className="flex-1"
          />
          <button
            type="button"
            aria-label="Remove row"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:text-red-600 dark:hover:text-red-400"
          >
            ×
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        className="self-start"
        onClick={() => onChange([...value, { label: '', value: '' }])}
      >
        Add row
      </Button>
    </div>
  );
}

/** Up/down reorder + remove controls for an ordered list of items. */
export function ListControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        aria-label="Move up"
        disabled={index === 0}
        onClick={() => onMove(-1)}
        className="text-xs text-muted hover:text-fg disabled:opacity-30"
      >
        ▲
      </button>
      <button
        type="button"
        aria-label="Move down"
        disabled={index === count - 1}
        onClick={() => onMove(1)}
        className="text-xs text-muted hover:text-fg disabled:opacity-30"
      >
        ▼
      </button>
      <button
        type="button"
        aria-label="Remove item"
        onClick={onRemove}
        className="text-xs text-muted hover:text-red-600 dark:hover:text-red-400"
      >
        ✕
      </button>
    </div>
  );
}

/** Reorder an array immutably. */
export function moveItem<T>(arr: T[], from: number, dir: -1 | 1): T[] {
  const to = from + dir;
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
