import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-fg font-medium hover:brightness-110 border border-transparent",
  secondary: "border border-line text-fg hover:bg-fg/5 font-medium",
  ghost: "border border-transparent text-muted hover:bg-fg/5 hover:text-fg",
};

const shared =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm transition-[filter,background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`${shared} ${variantClass[variant]} ${className}`} {...props} />;
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  /** Render with next/link (internal routes). */
  internal?: boolean;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  internal,
  children,
  ...props
}: LinkButtonProps) {
  const cls = `${shared} ${variantClass[variant]} ${className}`;
  if (internal) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...props}>
      {children}
    </a>
  );
}
