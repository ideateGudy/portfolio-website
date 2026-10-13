/** Small mono pill used for tech tags, dates, eyebrows. */
export function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted ${className}`}
    >
      {children}
    </span>
  );
}
