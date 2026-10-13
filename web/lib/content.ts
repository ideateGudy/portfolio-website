// Typed accessors over the flattened SiteContent object (PRD §7)
// with seed fallbacks (PRD §11) so the page renders before DB seed.
export type HeroContent = {
  greeting: string; headline: string; tagline: string; intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  availability: string; currentFocus: string; techChips: string[];
};
export type AboutContent = {
  title: string; subtitle: string; statement: string; paragraph: string;
  principles: string[]; facts: { label: string; value: string }[];
};
export type ServiceItem = {
  index: string; label: string; title: string; description: string;
  detail: string; deliverables: string[];
};
export type ServicesContent = {
  title: string; subtitle: string; sectionTitle: string;
  sectionSubtitle: string; items: ServiceItem[];
};
export type ExperienceItem = { role: string; company: string; description: string };
export type ExperienceContent = { title: string; subtitle: string; items: ExperienceItem[] };
export type ProjectsHeader = {
  title: string; subtitle: string; sectionTitle: string; sectionSubtitle: string;
};
export type ContactContent = {
  title: string; subtitle: string; heading: string; sectionSubtitle: string;
  blockHeading: string; blockText: string; email: string; availability: string;
};
export type ProfileContent = { name: string; role: string; avatarUrl: string; bio: string };
export type SocialsContent = { github: string; x: string; linkedin: string; devto: string };

export function obj<T>(v: unknown, fallback: T): T {
  if (v && typeof v === 'object' && !Array.isArray(v))
    return { ...fallback, ...(v as Record<string, unknown>) } as T;
  return fallback;
}

export const fallbackHero: HeroContent = {
  greeting: "Hi 👋! I'm Goodnews, a Fullstack Engineer.",
  headline: 'Architecting Robust Backends & Cloud Infrastructure',
  tagline: 'Engineering Scalable Systems from Backend to Modern Web',
  intro:
    'Backend, DevOps and fullstack engineer building scalable server architecture, resilient REST APIs and cloud infrastructure — from AWS and Docker to modern Next.js frontends.',
  primaryCta: { label: 'Show my work', href: '#projects' },
  secondaryCta: { label: 'View Resume', href: '' },
  availability: 'Available for remote contracts & full-time roles worldwide.',
  currentFocus: 'Building modern fullstack & cloud solutions',
  techChips: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Next.js'],
};

export const fallbackAbout: AboutContent = {
  title: 'About',
  subtitle: 'The point is reliable software, not just code.',
  statement: 'Fullstack developer passionate about building reliable software.',
  paragraph:
    'I am a Backend & DevOps (Fullstack) engineer focused on production-grade server-side systems, cloud infrastructure and modern web applications. I teach practical software development and cloud computing, and I care about clear communication, resilient architecture and continuous improvement.',
  principles: [
    'Collaborative engineering with open, direct communication.',
    'Very flexible with time-zone communication.',
    'I constantly try to improve.',
  ],
  facts: [
    { label: 'Role', value: 'Backend & DevOps Engineer (Fullstack)' },
    { label: 'Education', value: 'Delta State University' },
    { label: 'Location', value: 'Nigeria' },
    { label: 'Focus', value: 'Node.js · TypeScript · AWS · Next.js' },
  ],
};

export const fallbackServices: ServicesContent = {
  title: 'Services', subtitle: 'What I offer',
  sectionTitle: 'How I can help you succeed',
  sectionSubtitle:
    'Tailored backend, DevOps, and fullstack engineering solutions designed to elevate your product, ensure high performance, and drive tangible business results.',
  items: [
    {
      index: '01', label: 'Core Specialty',
      title: 'Backend Architecture & Robust APIs',
      description: 'High-Performance, Secure & Scalable',
      detail:
        'Production-grade server-side systems, high-throughput RESTful APIs, database models with robust authentication (JWT/OAuth/OTP), rate limiting and RBAC.',
      deliverables: [
        'RESTful APIs with Node.js, C#, Express/NestJS',
        'Authentication, authorization, OTP & token security',
        'Database schema design, indexing & Redis caching',
        'Structured logging, Swagger/OpenAPI documentation & testing',
      ],
    },
    {
      index: '02', label: 'DevOps',
      title: 'DevOps & Cloud Infrastructure',
      description: 'CI/CD, Automation & Cloud Deployment',
      detail:
        'Streamlined deployment lifecycles and infrastructure reliability via containerization, automated CI/CD, cloud environments (AWS, Docker, Terraform) and proactive monitoring.',
      deliverables: [
        'Docker containerization & multi-environment setups',
        'AWS cloud provisioning & serverless deployments',
        'CI/CD pipeline automation (GitHub Actions / GitLab)',
        'Infrastructure as Code (Terraform) & performance monitoring',
      ],
    },
    {
      index: '03', label: 'Fullstack',
      title: 'Fullstack Web Applications',
      description: 'End-to-End Modern Architecture',
      detail:
        'Full-cycle web applications connecting solid backend services/APIs with modern, responsive Next.js/React frontends, payments and real-time syncing.',
      deliverables: [
        'Type-safe Next.js / TypeScript end-to-end applications',
        'Real-time data flow with WebSockets & message queues',
        'Payment gateway integrations & webhook handlers',
        'High Core Web Vitals & responsive UI delivery',
      ],
    },
  ],
};

export const fallbackExperience: ExperienceContent = {
  title: 'Experience', subtitle: 'Where I have been making an impact.',
  items: [
    { role: 'Instructor', company: 'Ann Notch Digital Academy',
      description: 'Teach students practical software development and cloud computing concepts, including AWS, helping learners build hands-on technical skills.' },
    { role: 'Backend Engineer', company: 'Kingdom Scripts Tech Solutions',
      description: 'Backend engineer intern, developing and maintaining backend services using C# and LINQ while contributing to application functionality and performance.' },
    { role: 'Backend Engineer', company: 'Dive Africa',
      description: 'Built secure REST APIs with Node.js, implementing OTP authentication, refresh tokens, email verification, RBAC, rate limiting, structured logging and Swagger API documentation.' },
    { role: 'Frontend Developer', company: 'Coriftech Solutions',
      description: 'Developed responsive web interfaces using HTML5, CSS and modern frontend technologies while contributing to real-world client projects.' },
  ],
};

export const fallbackProjectsHeader: ProjectsHeader = {
  title: 'Selected work', subtitle: 'Projects',
  sectionTitle: 'A small selection of recent projects',
  sectionSubtitle:
    'Real-world applications crafted with modern frontend architecture, interactive animations, and responsive design.',
};

export const fallbackContact: ContactContent = {
  title: 'Contact', subtitle: 'Reach out',
  heading: 'Ready to take your digital presence to the next level?',
  sectionSubtitle: 'Reach out today to discuss custom web development, landing pages, or fullstack solutions.',
  blockHeading: 'Have a project in mind?',
  blockText: 'Reach out directly to discuss backend architecture, API integrations, or fullstack web applications.',
  email: 'azonubigoodnews@gmail.com',
  availability: 'Flexible with time-zone communication.',
};

export const fallbackProfile: ProfileContent = {
  name: 'Goodnews Azonubi', role: 'Backend & DevOps Engineer', avatarUrl: '',
  bio: 'Turning Ideas Into Scalable Products. Full-Stack Engineer: Node.js • TypeScript • AWS • Flutter.',
};

export const fallbackSocials: SocialsContent = {
  github: 'https://github.com/ideateGudy',
  x: 'https://x.com/ideategudy',
  linkedin: 'https://www.linkedin.com/in/ideategudy',
  devto: 'https://dev.to/ideategudy',
};

export function parseContent(all: Record<string, unknown> | null) {
  const c = all ?? {};
  const footerRaw = obj<{ text: string }>(c.footer, { text: '' });
  const seoRaw = obj<{ title: string; description: string; keywords: string[]; ogImageUrl: string }>(c.seo, {
    title: '',
    description: '',
    keywords: [],
    ogImageUrl: '',
  });
  return {
    hero: obj(c.hero, fallbackHero),
    about: obj(c.about, fallbackAbout),
    services: obj(c.services, fallbackServices),
    experience: obj(c.experience, fallbackExperience),
    projectsHeader: obj(c.projects, fallbackProjectsHeader),
    contact: obj(c.contact, fallbackContact),
    profile: obj(c.profile, fallbackProfile),
    socials: obj(c.socials, fallbackSocials),
    techStack: Array.isArray(c.techStack) ? (c.techStack as string[]) : fallbackHero.techChips,
    resumeUrl: typeof c.resumeUrl === 'string' ? c.resumeUrl : '',
    footerText: footerRaw.text || 'Goodnews Azonubi · Backend & DevOps Engineer · Fullstack Developer',
    seoTitle: seoRaw.title || 'Goodnews Azonubi | Backend & DevOps Engineer (Fullstack)',
    seoDescription: seoRaw.description || 'Portfolio of Goodnews Azonubi, Backend & DevOps Engineer specializing in scalable server architecture, resilient REST APIs, AWS cloud infrastructure, Docker, CI/CD, and fullstack modern web applications.',
    seoKeywords: Array.isArray(seoRaw.keywords) ? seoRaw.keywords : [],
    seoOgImageUrl: seoRaw.ogImageUrl || '',
  };
}
