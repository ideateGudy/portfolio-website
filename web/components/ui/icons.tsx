/** Inline SVG icons (design §12: no icon library, ≤15 icons). */

type Props = { className?: string; size?: number };

function base(className?: string, size = 20) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export function GithubIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)} fill="currentColor" stroke="none">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export function XIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)} fill="currentColor" stroke="none">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function LinkedinIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)} fill="currentColor" stroke="none">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9h3.566v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export function DevToIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)} fill="currentColor" stroke="none">
      <path d="M7.421 10.027V14.59c0 .464.084.676.666.676h1.693c.54 0 .726-.177.726-.64V10.28c0-.448-.186-.625-.687-.625H8.105c-.525 0-.684.163-.684.372Zm11.26-5.077c-1.55 0-2.597.4-3.818 1.277a6.46 6.46 0 0 0-.466-.03l-3.916-.04a.355.355 0 0 0-.338.234L8.93 9.02c-.05.144-.063.24-.063.36v7.257c0 .168.038.3.114.39.087.102.21.162.364.18l4.042.04c.168.005.295-.07.344-.21l1.11-3.62c.02-.07.03-.13.03-.2V10.6c0-.15-.03-.27-.09-.36l-.02-.02c.94-.877 1.75-1.29 3.13-1.29.16 0 .3.01.58.05v-.7c0-.55-.12-.79-.63-.79Zm-4.71 8.66c-.47 0-.77-.29-.77-.8V7.93c0-.55.3-.86.77-.86.44 0 .72.31.72.86v4.92c0 .51-.28.8-.72.8Zm4.2 1.52c-.26 0-.42-.15-.48-.44l-.96-3.14-.96 3.13c-.06.3-.22.45-.48.45-.25 0-.4-.16-.46-.47l-.98-3.3-1.02 3.34c-.06.28-.2.42-.44.42h-.2v.63c.16.08.37.12.64.12h.44c.34 0 .6-.09.76-.34l1.06-3.4 1.05 3.4c.16.25.42.34.76.34h.44c.27 0 .48-.04.64-.12v-.63h-.2Zm3.45-7.72c-.74 0-1.22.5-1.22 1.29v4.78c-.27.1-.58.16-.94.16v.63c.56 0 1.05-.11 1.44-.36v-5.21c0-.3.15-.45.44-.45.28 0 .42.15.42.45v5.16c.38-.11.72-.17 1.02-.17v-.63c-.25 0-.55.04-.9.13v-4.53c0-.79-.45-1.29-1.19-1.29h-.07Z" />
    </svg>
  );
}

export function MailIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function SunIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

export function ArrowUpIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function CheckIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CopyIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function MenuIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ExternalIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function LogoutIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function SettingsIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function CompassIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export function BookOpenIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function PostsIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function ProjectsIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function ContentIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

export function ChevronLeftIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ServerIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

export function CloudIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

export function CodeIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function GraduationIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

export function EyeIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function HeartIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function MessageSquareIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function BarChartIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

export function ActivityIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function SparkIcon({ className, size }: Props) {
  return (
    <svg {...base(className, size)}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}



