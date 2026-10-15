import React, { type ReactNode } from 'react';

/**
 * Parses inline formatting tags:
 * - Markdown links: [Text](https://example.com)
 * - HTML links: <a href="https://example.com">Text</a>
 * - Bold: **text**, <strong>text</strong>, <b>text</b>
 * - Italic: *text*, _text_
 *
 * All external links automatically open in a new tab securely with `target="_blank" rel="noopener noreferrer"`.
 */
export function renderFormattedInline(text: string): ReactNode[] {
  if (!text) return [];

  const parts: ReactNode[] = [];
  // Matches markdown link [text](url), <a> tags, bold tags (** or <b> or <strong>), and italic (* or _)
  const regex = /(\[[^\]]+\]\([^)]+\)|<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>|\*\*[^*]+\*\*|<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|\*[^*]+\*|_[^_]+_)/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    // Markdown link: [label](url)
    if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const closingBracket = token.indexOf('](');
      const label = token.slice(1, closingBracket);
      const href = token.slice(closingBracket + 2, -1).trim();
      const isExternal = /^https?:\/\//i.test(href);
      parts.push(
        <a
          key={key++}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-accent underline underline-offset-2 transition-colors hover:brightness-110"
        >
          {label}
        </a>
      );
    }
    // HTML link: <a href="...">label</a>
    else if (token.toLowerCase().startsWith('<a')) {
      const hrefMatch = /href=["']([^"']*)["']/i.exec(token);
      const labelMatch = />([\s\S]*?)<\/a>/i.exec(token);
      const href = hrefMatch ? hrefMatch[1].trim() : '#';
      const label = labelMatch ? labelMatch[1] : href;
      const isExternal = /^https?:\/\//i.test(href);
      parts.push(
        <a
          key={key++}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-accent underline underline-offset-2 transition-colors hover:brightness-110"
        >
          {label}
        </a>
      );
    }
    // Bold: **text**
    else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Bold: <strong>text</strong>
    else if (token.toLowerCase().startsWith('<strong>') && token.toLowerCase().endsWith('</strong>')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(8, -9)}
        </strong>
      );
    }
    // Bold: <b>text</b>
    else if (token.toLowerCase().startsWith('<b>') && token.toLowerCase().endsWith('</b>')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(3, -4)}
        </strong>
      );
    }
    // Italic: *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key++} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    }
    // Italic: _text_
    else if (token.startsWith('_') && token.endsWith('_')) {
      parts.push(
        <em key={key++} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Formats a multi-line paragraph block:
 * - Preserves spacing between paragraphs (double newline)
 * - Preserves single newlines (line breaks) within paragraphs
 * - Formats bold, italics, and markdown/HTML links
 */
export function FormattedParagraph({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <div className={`whitespace-pre-line ${className}`}>
        {renderFormattedInline(text)}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {renderFormattedInline(para)}
        </p>
      ))}
    </div>
  );
}

