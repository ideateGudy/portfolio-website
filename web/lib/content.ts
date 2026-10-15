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
export type ExperienceItem = {
  role: string;
  company: string;
  description: string;
  duration?: string;
  location?: string;
  employmentType?: string;
  skills?: string[];
};
export type ExperienceContent = { title: string; subtitle: string; items: ExperienceItem[] };

export type EducationItem = {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  duration?: string;
  grade?: string;
  activities?: string;
  description?: string;
  credentialUrl?: string;
  skills?: string[];
};
export type EducationContent = { title: string; subtitle: string; items: EducationItem[] };

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
    'Tailored backend, frontend, and DevOps engineering solutions designed to elevate your product, ensure high performance, and drive tangible business results.',
  items: [
    {
      index: '01', label: 'Backend Engineering',
      title: 'Backend Architecture & Robust APIs',
      description: 'High-Performance, Secure & Scalable Server Systems',
      detail:
        'Architect and implement production-grade server-side systems, high-throughput RESTful APIs, and relational database architectures with robust authentication, rate limiting, and RBAC.',
      deliverables: [
        'RESTful APIs with Node.js, C#, Express & NestJS',
        'Authentication, authorization, OTP & token security',
        'PostgreSQL schema design, indexing & Redis caching',
        'Structured logging, Swagger/OpenAPI documentation & testing',
      ],
    },
    {
      index: '02', label: 'Frontend Development',
      title: 'Modern Frontend & Interactive Web Apps',
      description: 'Responsive, Performant & User-Centric Interfaces',
      detail:
        'Craft lightning-fast, accessible web frontends with Next.js, React, and TypeScript. Focused on sleek interactive micro-animations, mobile responsiveness, and high Core Web Vitals.',
      deliverables: [
        'Type-safe Next.js (App Router) & React interfaces',
        'Mobile-first responsive layouts & Tailwind styling',
        'State management (Zustand), real-time updates & WebSockets',
        'Interactive animations (Framer Motion) & SEO optimization',
      ],
    },
    {
      index: '03', label: 'DevOps & Cloud',
      title: 'DevOps & Cloud Infrastructure',
      description: 'CI/CD, Automation & Cloud Deployment',
      detail:
        'Streamline deployment lifecycles and infrastructure reliability via containerization, automated CI/CD workflows, cloud environments (AWS, Docker, Terraform) and proactive monitoring.',
      deliverables: [
        'Docker containerization & multi-environment setups',
        'AWS cloud provisioning (EC2, S3, RDS, ECS, Lambda)',
        'CI/CD pipeline automation (GitHub Actions / GitLab)',
        'Infrastructure as Code (Terraform) & server monitoring',
      ],
    },
  ],
};

export const fallbackExperience: ExperienceContent = {
  title: 'Experience',
  subtitle: 'Where I have been making an impact.',
  items: [
    {
      role: 'Backend Engineer',
      company: 'Dive Africa',
      duration: 'Feb 2025 - May 2025',
      location: 'Remote',
      employmentType: 'Internship',
      description:
        '• Built secure REST APIs with OTP authentication, refresh tokens, and email verification, improving user onboarding reliability and reducing unauthorized access attempts. • Integrated Winston and Morgan for structured logging and HTTP request monitoring, enhancing debugging efficiency and reducing issue resolution time. • Documented all API endpoints using Swagger, streamlining team collaboration and cutting integration time for frontend developers. • Implemented role-based access control (RBAC), ensuring secure and efficient resource management across the platform. • Added rate limiting to sensitive endpoints using middleware, protecting the application from abuse and reducing bot-related traffic.',
      skills: ['Node.js', 'Express', 'JWT/OTP Security', 'RBAC', 'Swagger', 'Winston', 'Rate Limiting'],
    },
    {
      role: 'Instructor',
      company: 'Ann Notch Digital Academy',
      duration: '2024 - Present',
      location: 'Remote',
      employmentType: 'Contract',
      description:
        '• Teach students practical software development and cloud computing concepts including AWS, Docker containerization, and modern JavaScript/TypeScript. • Guide learners in building hands-on technical projects and adopting clean architecture principles.',
      skills: ['AWS', 'Cloud Computing', 'Docker', 'TypeScript', 'Node.js'],
    },
    {
      role: 'Backend Engineer',
      company: 'Kingdom Scripts Tech Solutions',
      duration: '2023 - 2024',
      location: 'Remote',
      employmentType: 'Full-time',
      description:
        '• Developed and maintained robust backend services using C# and LINQ. • Designed optimized database schemas and built high-performance internal microservices.',
      skills: ['C#', '.NET', 'LINQ', 'REST APIs', 'SQL Database Design'],
    },
    {
      role: 'Frontend Instructor',
      company: 'Coriftech Solutions',
      duration: 'Jun 2023 - Oct 2023',
      location: 'On-site',
      employmentType: 'Contract',
      description:
        '• Instructed students in core web technologies, modern responsive design, and frontend development fundamentals. • Mentored students through practical lab exercises, project reviews, and frontend best practices.',
      skills: ['HTML', 'CSS', 'Bootstrap'],
    },
    {
      role: 'Frontend Developer',
      company: 'Coriftech Solutions',
      duration: 'May 2023 - Nov 2023',
      location: 'On-site',
      employmentType: 'Full-time',
      description:
        '• Built dynamic, responsive user interfaces and client-side applications. • Collaborated with the engineering team to implement clean JavaScript/TypeScript modules and integrated with RESTful backends.',
      skills: ['Javascript', 'Typescript', 'Express.js', 'React'],
    },
  ],
};

export const fallbackEducation: EducationContent = {
  title: 'Education',
  subtitle: 'Academic background & certifications.',
  items: [
    {
      school: 'AltSchool Africa',
      degree: 'Diploma, Cloud Engineering',
      fieldOfStudy: 'Cloud Engineering',
      duration: '2023 - 2024',
      skills: ['CI/CD', 'Amazon Web Services (AWS)', 'Docker', 'Linux', 'Terraform', 'Kubernetes'],
    },
    {
      school: 'Delta State University, Nigeria',
      degree: 'Bachelor of Science - BS, Computer Science',
      fieldOfStudy: 'Computer Science',
      duration: '2018 - 2023',
      grade: 'Second Class (Upper Division)',
      activities: 'NACOS & NASS',
      skills: ['Object-Oriented Programming (OOP)', 'Compiler Construction', 'Data Structures & Algorithms', 'Database Systems', 'Software Engineering'],
    },
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
    education: obj(c.education, fallbackEducation),
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
