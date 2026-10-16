'use client';

import { useEffect, useState, useRef, useSyncExternalStore } from 'react';

type SectionKind = 'hero' | 'about' | 'projects' | 'services' | 'experience' | 'education' | 'writing' | 'contact' | 'default';

function subscribePointerMedia(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const fineMedia = window.matchMedia('(pointer: fine)');
  const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

  fineMedia.addEventListener('change', callback);
  motionMedia.addEventListener('change', callback);

  return () => {
    fineMedia.removeEventListener('change', callback);
    motionMedia.removeEventListener('change', callback);
  };
}

function getPointerSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return hasFinePointer && !prefersReducedMotion;
}

function getPointerServerSnapshot(): boolean {
  return false;
}

interface SectionConfig {
  badge: string;
  icon: string;
  label: string;
  accentClass: string;
  haloColor: string;
}

const SECTION_CONFIGS: Record<SectionKind, SectionConfig> = {
  hero: {
    badge: 'DEV',
    icon: '⚡',
    label: 'Explore',
    accentClass: 'border-emerald-500/80 text-emerald-400 bg-emerald-950/70',
    haloColor: 'rgba(16, 185, 129, 0.25)',
  },
  about: {
    badge: 'BIO',
    icon: '👤',
    label: 'Story',
    accentClass: 'border-teal-500/80 text-teal-400 bg-teal-950/70',
    haloColor: 'rgba(20, 184, 166, 0.25)',
  },
  projects: {
    badge: 'WORK',
    icon: '🚀',
    label: 'Inspect',
    accentClass: 'border-amber-500/80 text-amber-400 bg-amber-950/70',
    haloColor: 'rgba(245, 158, 11, 0.28)',
  },
  services: {
    badge: 'STACK',
    icon: '⚙️',
    label: 'Services',
    accentClass: 'border-cyan-500/80 text-cyan-400 bg-cyan-950/70',
    haloColor: 'rgba(6, 182, 212, 0.25)',
  },
  experience: {
    badge: 'EXP',
    icon: '💼',
    label: 'Career',
    accentClass: 'border-indigo-500/80 text-indigo-400 bg-indigo-950/70',
    haloColor: 'rgba(99, 102, 241, 0.25)',
  },
  education: {
    badge: 'ACAD',
    icon: '🎓',
    label: 'Studies',
    accentClass: 'border-purple-500/80 text-purple-400 bg-purple-950/70',
    haloColor: 'rgba(168, 85, 247, 0.25)',
  },
  writing: {
    badge: 'READ',
    icon: '✍️',
    label: 'Article',
    accentClass: 'border-rose-500/80 text-rose-400 bg-rose-950/70',
    haloColor: 'rgba(244, 63, 94, 0.25)',
  },
  contact: {
    badge: 'TALK',
    icon: '💬',
    label: 'Connect',
    accentClass: 'border-emerald-400/90 text-emerald-300 bg-emerald-950/80',
    haloColor: 'rgba(52, 211, 153, 0.35)',
  },
  default: {
    badge: '',
    icon: '',
    label: '',
    accentClass: 'border-accent/70 text-accent bg-surface/90',
    haloColor: 'rgba(4, 120, 87, 0.2)',
  },
};

/**
 * Interactive Precision Cursor:
 * - Ultra-responsive smooth mouse tracker with dual-ring magnetic feel
 * - Dynamically shifts aesthetics, colors, glow, and contextual pills based on the active section (Hero, Projects, Services, etc.)
 * - Expands & morphs smoothly over clickable / interactive elements (links, buttons, inputs)
 * - Automatically respects touch devices and prefers-reduced-motion
 */
export function InteractiveCursor() {
  const enabled = useSyncExternalStore(
    subscribePointerMedia,
    getPointerSnapshot,
    getPointerServerSnapshot,
  );

  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [interactiveType, setInteractiveType] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionKind>('default');

  // Mouse coords
  const mousePos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Smooth ring interpolation position
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setVisible((v) => (v ? v : true));

      // Move inner point immediately without lag for pinpoint precision
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Determine active section from pointed element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Check for interactive targets
        const interactiveEl = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor-interactive]');
        if (interactiveEl) {
          setIsHoveringInteractive(true);
          const tagName = interactiveEl.tagName.toLowerCase();
          if (tagName === 'input' || tagName === 'textarea') {
            setInteractiveType('text');
          } else if (interactiveEl.getAttribute('target') === '_blank') {
            setInteractiveType('external');
          } else {
            setInteractiveType('click');
          }
        } else {
          setIsHoveringInteractive(false);
          setInteractiveType(null);
        }

        // Check for section
        const sectionEl = target.closest('[data-cursor]');
        if (sectionEl) {
          const sec = sectionEl.getAttribute('data-cursor') as SectionKind;
          if (sec && SECTION_CONFIGS[sec]) {
            setCurrentSection(sec);
          }
        } else {
          setCurrentSection('default');
        }
      }
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop for the outer ring & badge
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.18);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };
    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const config = SECTION_CONFIGS[currentSection] || SECTION_CONFIGS.default;
  const isSectionActive = currentSection !== 'default';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-9999 overflow-hidden transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Ultra-sharp inner crosshair / dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out will-change-transform"
      >
        <div
          className={`h-2 w-2 rounded-full transition-all duration-200 ${
            clicked
              ? 'scale-150 bg-spark shadow-[0_0_12px_var(--color-spark)]'
              : isHoveringInteractive
              ? 'scale-125 bg-accent shadow-[0_0_10px_var(--color-accent)]'
              : 'bg-fg shadow-[0_0_6px_var(--color-accent)]'
          }`}
        />
      </div>

      {/* 2. Fluid Magnetic Outer Halo & Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          style={{
            boxShadow: `0 0 28px ${config.haloColor}, inset 0 0 14px ${config.haloColor}`,
          }}
          className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
            clicked
              ? 'h-9 w-9 scale-90 border border-spark/80 bg-spark/10 backdrop-blur-[2px]'
              : isHoveringInteractive
              ? 'h-12 w-12 scale-110 border border-accent bg-accent/15 backdrop-blur-[3px]'
              : isSectionActive
              ? 'h-10 w-10 border border-accent/60 bg-accent/5 backdrop-blur-[2px]'
              : 'h-8 w-8 border border-fg/30 bg-fg/5'
          }`}
        >
          {/* Subtle crosshair tick marks on active interactive states */}
          {isHoveringInteractive && (
            <>
              <span className="absolute -top-1.5 left-1/2 h-1 w-0.5 -translate-x-1/2 bg-accent" />
              <span className="absolute -bottom-1.5 left-1/2 h-1 w-0.5 -translate-x-1/2 bg-accent" />
              <span className="absolute -left-1.5 top-1/2 h-0.5 w-1 -translate-y-1/2 bg-accent" />
              <span className="absolute -right-1.5 top-1/2 h-0.5 w-1 -translate-y-1/2 bg-accent" />
            </>
          )}
        </div>
      </div>

      {/* 3. Floating Contextual Badge / Label attached to the cursor */}
      <div
        ref={badgeRef}
        className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div className="relative pl-12 pt-3 select-none">
          {/* Action indicator when hovering links or inputs */}
          {isHoveringInteractive ? (
            <div className="flex items-center gap-1.5 rounded-full border border-accent/70 bg-surface/95 px-2.5 py-0.5 shadow-lg backdrop-blur-md transition-all duration-200">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] font-bold tracking-wider text-fg uppercase">
                {interactiveType === 'external' ? 'Open ↗' : interactiveType === 'text' ? 'Type' : 'View'}
              </span>
            </div>
          ) : isSectionActive ? (
            /* Section-aware indicator */
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 shadow-lg backdrop-blur-md transition-all duration-300 ${config.accentClass}`}
            >
              <span className="text-xs">{config.icon}</span>
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
                {config.label}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

