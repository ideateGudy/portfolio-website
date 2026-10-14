import { Children, isValidElement, type ComponentType } from 'react';
import type { Components } from 'react-markdown';
import { CopyCodeButton } from '@/components/blog/CopyCodeButton';
import { ZoomableImage } from '@/components/blog/ZoomableImage';
import { cld } from '@/lib/format';

/**
 * Renderer config shared by the public article page (lib/markdown.tsx, which
 * adds shiki highlighting) and the dashboard live preview (MarkdownPreview).
 * Client-safe: no server-only / highlighter imports, so importing this into a
 * client component does not bundle shiki (PRD §10).
 */

/** Sanitize schema: permissive on class/style/data-* so highlighting survives. */
export const sanitizeSchema = {
  tagNames: [
    'a', 'blockquote', 'br', 'code', 'del', 'div', 'em', 'figcaption', 'figure',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'input', 'li', 'ol',
    'p', 'pre', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td',
    'tfoot', 'th', 'thead', 'tr', 'ul',
  ],
  attributes: {
    '*': ['id', 'className', 'style', 'title'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'loading', 'decoding'],
    input: ['type', 'checked', 'disabled'],
    code: ['className', 'style', 'dataLanguage', 'data-language', 'dataTheme', 'data-theme'],
    pre: ['className', 'style', 'tabIndex', 'tabindex', 'dataLanguage', 'data-language', 'dataTheme', 'data-theme'],
    span: ['className', 'style', 'dataLine', 'data-line', 'dataHighlightedLine', 'data-highlighted-line'],
    div: ['className', 'style', 'dataRehypePrettyCodeFigure', 'data-rehype-pretty-code-figure'],
    figure: ['className', 'style', 'dataRehypePrettyCodeFigure', 'data-rehype-pretty-code-figure'],
    figcaption: ['className', 'style', 'dataRehypePrettyCodeTitle', 'data-rehype-pretty-code-title'],
    th: ['align', 'colSpan', 'rowSpan', 'style'],
    td: ['align', 'colSpan', 'rowSpan', 'style'],
  },
  protocols: { href: ['http', 'https', 'mailto'] },
};

type CodeProps = {
  className?: string | string[];
  dataLanguage?: string;
  'data-language'?: string;
};

function langOf(props: CodeProps): string | undefined {
  const dl = props.dataLanguage ?? props['data-language'];
  if (typeof dl === 'string' && dl) return dl;
  const cls = Array.isArray(props.className) ? props.className.join(' ') : (props.className ?? '');
  const m = /(?:^|\s)language-([\w+-]+)/.exec(cls);
  return m?.[1];
}

function findCodeLang(children: React.ReactNode, depth = 0): string | undefined {
  let found: string | undefined;
  Children.forEach(children, (child) => {
    if (found || depth > 2 || !isValidElement(child)) return;
    const p = child.props as CodeProps & { children?: React.ReactNode };
    if (child.type === 'code') found = langOf(p);
    else found = findCodeLang(p.children, depth + 1);
  });
  return found;
}

function isPreElement(child: React.ReactNode): boolean {
  return isValidElement(child) && child.type === 'pre';
}

/** Shared component overrides: code chrome, external links, images, tables. */
export const markdownComponents: Components = {
  pre({ children, ...rest }) {
    return (
      <div className="codeblock">
        {(() => {
          const lang = findCodeLang(children);
          return lang ? <span className="codeblock-lang" aria-hidden>{lang}</span> : null;
        })()}
        <CopyCodeButton />
        <pre {...rest}>{children}</pre>
      </div>
    );
  },
  figure({ children, ...rest }) {
    let isCode = false;
    Children.forEach(children, (c) => {
      if (isPreElement(c)) isCode = true;
    });
    if (isCode) return <>{children}</>;
    return <figure {...rest}>{children}</figure>;
  },
  a({ href, children, ...rest }) {
    const external = !!href && /^(https?:|mailto:)/.test(href);
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  },
  img({ src, alt }) {
    const url = cld(typeof src === 'string' ? src : undefined, 1200);
    if (!url) return null;
    return <ZoomableImage src={url} alt={alt ?? ''} className="rounded-xl" />;
  },
  table({ children }) {
    return (
      <div className="scroll-x">
        <table>{children}</table>
      </div>
    );
  },
} as Components & Record<string, ComponentType<Record<string, unknown>>>;
