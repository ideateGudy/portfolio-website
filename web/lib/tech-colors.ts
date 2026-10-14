/**
 * Deterministic color hashing & palette generator for tech stack chips.
 * Gives each technology / stack a distinct, appealing glass-chip color
 * that remains consistent across the portfolio, blog, and dashboard.
 */

export type TechColorTheme = {
  bg: string;
  text: string;
  border: string;
};

// Curated vibrant accessible palettes tailored for both light & dark themes
const KNOWN_STACKS: Record<string, TechColorTheme> = {
  // JavaScript / TypeScript / Frontend
  react: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-400/15',
    text: 'text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-500/30 dark:border-cyan-400/30',
  },
  'next.js': {
    bg: 'bg-zinc-500/10 dark:bg-zinc-200/15',
    text: 'text-zinc-800 dark:text-zinc-200',
    border: 'border-zinc-500/30 dark:border-zinc-400/30',
  },
  nextjs: {
    bg: 'bg-zinc-500/10 dark:bg-zinc-200/15',
    text: 'text-zinc-800 dark:text-zinc-200',
    border: 'border-zinc-500/30 dark:border-zinc-400/30',
  },
  typescript: {
    bg: 'bg-blue-500/10 dark:bg-blue-400/15',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500/30 dark:border-blue-400/30',
  },
  javascript: {
    bg: 'bg-amber-500/10 dark:bg-amber-400/15',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30 dark:border-amber-400/30',
  },
  tailwind: {
    bg: 'bg-teal-500/10 dark:bg-teal-400/15',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30 dark:border-teal-400/30',
  },
  'tailwind css': {
    bg: 'bg-teal-500/10 dark:bg-teal-400/15',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30 dark:border-teal-400/30',
  },

  // Backend / Runtimes / Frameworks
  'node.js': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30 dark:border-emerald-400/30',
  },
  nodejs: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30 dark:border-emerald-400/30',
  },
  nestjs: {
    bg: 'bg-rose-500/10 dark:bg-rose-400/15',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30 dark:border-rose-400/30',
  },
  express: {
    bg: 'bg-stone-500/10 dark:bg-stone-400/15',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-500/30 dark:border-stone-400/30',
  },
  python: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-400/15',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-500/30 dark:border-yellow-400/30',
  },

  // Databases & ORMs
  postgresql: {
    bg: 'bg-sky-500/10 dark:bg-sky-400/15',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30 dark:border-sky-400/30',
  },
  postgres: {
    bg: 'bg-sky-500/10 dark:bg-sky-400/15',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30 dark:border-sky-400/30',
  },
  prisma: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-400/15',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500/30 dark:border-indigo-400/30',
  },
  redis: {
    bg: 'bg-red-500/10 dark:bg-red-400/15',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500/30 dark:border-red-400/30',
  },
  mongodb: {
    bg: 'bg-green-500/10 dark:bg-green-400/15',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-500/30 dark:border-green-400/30',
  },

  // DevOps & Cloud
  docker: {
    bg: 'bg-blue-600/10 dark:bg-blue-500/15',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-600/30 dark:border-blue-500/30',
  },
  aws: {
    bg: 'bg-amber-600/10 dark:bg-amber-500/15',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-600/30 dark:border-amber-500/30',
  },
  terraform: {
    bg: 'bg-purple-500/10 dark:bg-purple-400/15',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30 dark:border-purple-400/30',
  },
  'ci/cd': {
    bg: 'bg-fuchsia-500/10 dark:bg-fuchsia-400/15',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    border: 'border-fuchsia-500/30 dark:border-fuchsia-400/30',
  },
  kubernetes: {
    bg: 'bg-blue-500/10 dark:bg-blue-400/15',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500/30 dark:border-blue-400/30',
  },
  linux: {
    bg: 'bg-yellow-600/10 dark:bg-yellow-500/15',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-600/30 dark:border-yellow-500/30',
  },
  git: {
    bg: 'bg-orange-500/10 dark:bg-orange-400/15',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-500/30 dark:border-orange-400/30',
  },
  rest: {
    bg: 'bg-emerald-600/10 dark:bg-emerald-400/15',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-600/30 dark:border-emerald-400/30',
  },
  graphql: {
    bg: 'bg-pink-500/10 dark:bg-pink-400/15',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-500/30 dark:border-pink-400/30',
  },
};

const PALETTES: TechColorTheme[] = [
  { bg: 'bg-emerald-500/10 dark:bg-emerald-400/15', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30 dark:border-emerald-400/30' },
  { bg: 'bg-blue-500/10 dark:bg-blue-400/15', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/30 dark:border-blue-400/30' },
  { bg: 'bg-purple-500/10 dark:bg-purple-400/15', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/30 dark:border-purple-400/30' },
  { bg: 'bg-cyan-500/10 dark:bg-cyan-400/15', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-500/30 dark:border-cyan-400/30' },
  { bg: 'bg-amber-500/10 dark:bg-amber-400/15', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/30 dark:border-amber-400/30' },
  { bg: 'bg-rose-500/10 dark:bg-rose-400/15', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30 dark:border-rose-400/30' },
  { bg: 'bg-teal-500/10 dark:bg-teal-400/15', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-500/30 dark:border-teal-400/30' },
  { bg: 'bg-indigo-500/10 dark:bg-indigo-400/15', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-500/30 dark:border-indigo-400/30' },
  { bg: 'bg-violet-500/10 dark:bg-violet-400/15', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-500/30 dark:border-violet-400/30' },
  { bg: 'bg-lime-500/10 dark:bg-lime-400/15', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-500/30 dark:border-lime-400/30' },
];

export function getTechColor(name: string): TechColorTheme {
  const normalized = name.trim().toLowerCase();
  if (KNOWN_STACKS[normalized]) {
    return KNOWN_STACKS[normalized];
  }
  // Deterministic DJB2 hash
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 33) ^ normalized.charCodeAt(i);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

