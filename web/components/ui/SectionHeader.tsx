/** Section eyebrow → H2 → muted subtitle (design §7.3). */
export function SectionHeader({
  index,
  label,
  title,
  subtitle,
  id,
}: {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="font-mono text-xs font-medium tracking-[0.12em] text-accent uppercase">
        {index} · {label}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-fg md:text-4xl"
        style={{ lineHeight: 1.15 }}
      >
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base text-muted md:text-[17px]">{subtitle}</p>}
    </header>
  );
}
