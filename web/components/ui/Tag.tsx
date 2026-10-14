import { getTechColor } from '@/lib/tech-colors';

/**
 * Small mono pill used for tech tags, dates, eyebrows.
 * Supports auto-coloring based on the stack name or manual styling.
 */
export function Tag({
  children,
  className = '',
  colored = true,
}: {
  children: React.ReactNode;
  className?: string;
  colored?: boolean;
}) {
  const isString = typeof children === 'string';
  const color = colored && isString ? getTechColor(children) : null;

  const styleClass = color
    ? `${color.bg} ${color.text} ${color.border}`
    : 'border-line text-muted';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium transition-colors ${styleClass} ${className}`}
    >
      {children}
    </span>
  );
}
