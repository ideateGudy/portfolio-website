// Seed: admin user + site content + 4 projects (PRD §11) + 11 draft post
// placeholders (PRD §12). Run with: pnpm exec prisma db seed
import 'dotenv/config';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in api/.env');
  }

  // --- Admin user (only user that will ever exist) ---
  const passwordHash = await hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: 'ADMIN' },
  });

  // --- Site content blocks (PRD §11) ---
  const content: Record<string, unknown> = {
    seo: {
      title: 'Goodnews Azonubi | Backend & DevOps Engineer (Fullstack)',
      description:
        'Portfolio of Goodnews Azonubi, Backend & DevOps Engineer specializing in scalable server architecture, resilient REST APIs, AWS cloud infrastructure, Docker, CI/CD, and fullstack modern web applications.',
      keywords: [
        'Backend Developer',
        'DevOps Engineer',
        'Cloud Engineer',
        'AWS',
        'Docker',
        'Terraform',
        'CI/CD',
        'Node.js',
        'Next.js',
        'PostgreSQL',
        'TypeScript',
        'REST APIs',
        'Fullstack Developer',
      ],
      ogImageUrl: '',
    },
    hero: {
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
    },
    about: {
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
    },
    services: {
      title: 'Services',
      subtitle: 'What I offer',
      sectionTitle: 'How I can help you succeed',
      sectionSubtitle:
        'Tailored backend, DevOps, and fullstack engineering solutions designed to elevate your product, ensure high performance, and drive tangible business results.',
      items: [
        {
          index: '01',
          label: 'Core Specialty',
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
          index: '02',
          label: 'DevOps',
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
          index: '03',
          label: 'Fullstack',
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
    },
    experience: {
      title: 'Experience',
      subtitle: 'Where I have been making an impact.',
      items: [
        {
          role: 'Instructor',
          company: 'Ann Notch Digital Academy',
          description:
            'Teach students practical software development and cloud computing concepts, including AWS, helping learners build hands-on technical skills.',
        },
        {
          role: 'Backend Engineer',
          company: 'Kingdom Scripts Tech Solutions',
          description:
            'Backend engineer intern, developing and maintaining backend services using C# and LINQ while contributing to application functionality and performance.',
        },
        {
          role: 'Backend Engineer',
          company: 'Dive Africa',
          description:
            'Built secure REST APIs with Node.js, implementing OTP authentication, refresh tokens, email verification, RBAC, rate limiting, structured logging and Swagger API documentation.',
        },
        {
          role: 'Frontend Developer',
          company: 'Coriftech Solutions',
          description:
            'Developed responsive web interfaces using HTML5, CSS and modern frontend technologies while contributing to real-world client projects.',
        },
      ],
    },
    education: {
      title: 'Education',
      subtitle: 'Academic background & certifications.',
      items: [
        {
          school: 'AltSchool Africa',
          degree: 'Diploma, Cloud Engineering',
          fieldOfStudy: 'Cloud Engineering',
          duration: '2023 - 2024',
          skills: [
            'CI/CD',
            'Amazon Web Services (AWS)',
            'Docker',
            'Linux',
            'Terraform',
            'Kubernetes',
          ],
        },
        {
          school: 'Delta State University, Nigeria',
          degree: 'Bachelor of Science - BS, Computer Science',
          fieldOfStudy: 'Computer Science',
          duration: '2018 - 2023',
          grade: 'Second Class (Upper Division)',
          activities: 'NACOS & NASS',
          skills: [
            'Object-Oriented Programming (OOP)',
            'Compiler Construction',
            'Data Structures & Algorithms',
            'Database Systems',
            'Software Engineering',
          ],
        },
      ],
    },
    projects: {
      title: 'Selected work',
      subtitle: 'Projects',
      sectionTitle: 'A small selection of recent projects',
      sectionSubtitle:
        'Real-world applications crafted with modern frontend architecture, interactive animations, and responsive design.',
    },
    contact: {
      title: 'Contact',
      subtitle: 'Reach out',
      heading: 'Ready to take your digital presence to the next level?',
      sectionSubtitle:
        'Reach out today to discuss custom web development, landing pages, or fullstack solutions.',
      blockHeading: 'Have a project in mind?',
      blockText:
        'Reach out directly to discuss backend architecture, API integrations, or fullstack web applications.',
      email: 'azonubigoodnews@gmail.com',
      availability: 'Flexible with time-zone communication.',
    },
    profile: {
      name: 'Goodnews Azonubi',
      role: 'Backend & DevOps Engineer',
      avatarUrl: '',
      bio: 'Turning Ideas Into Scalable Products. Full-Stack Engineer: Node.js • TypeScript • AWS • Flutter.',
    },
    socials: {
      github: 'https://github.com/ideateGudy',
      x: 'https://x.com/ideategudy',
      linkedin: 'https://www.linkedin.com/in/ideategudy',
      devto: 'https://dev.to/ideategudy',
    },
    resumeUrl:
      'https://drive.google.com/file/d/131xzO3sfyHhDgA88GFlPxYf75mRwg8Wg/view?usp=drive_link',
    footer: {
      text: 'Goodnews Azonubi · Backend & DevOps Engineer · Fullstack Developer',
    },
  };

  for (const [key, value] of Object.entries(content)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }
  // --- 4 projects (PRD §11) — images uploaded later via the dashboard ---
  const projects = [
    {
      title: 'My Portfolio',
      description:
        'A modern fullstack developer portfolio showcasing backend, DevOps, cloud and fullstack engineering experience, services, projects and technical expertise.',
      tech: ['Next.js', 'Tailwind', 'TypeScript'],
      liveUrl: 'https://dev.ideategudy.tech/',
    },
    {
      title: 'Brainwave: AI Landing Page',
      description:
        'A modern AI-focused landing page built with React and TypeScript, featuring a polished interface, responsive layouts and interactive sections designed for an AI product.',
      tech: ['React', 'Tailwind', 'TypeScript'],
      liveUrl: 'https://brainwave-two-umber.vercel.app/',
    },
    {
      title: 'Stacklenzz: Developer Observability Platform',
      description:
        'A developer-first observability ecosystem for Node.js backends with Express and NestJS telemetry, Prometheus metrics, structured logging, error tracking, and React/Next.js dashboards.',
      tech: ['React', 'TypeScript', 'Next.js'],
      liveUrl: 'https://stacklenzz.vercel.app/',
    },
    {
      title: 'Apple Verse: 3D Apple Website',
      description:
        "A recreation of Apple's product experience featuring immersive 3D visuals, smooth animations and an interactive modern interface inspired by the Apple website.",
      tech: ['React', 'Tailwind', 'TypeScript', 'Three.js', 'GSAP'],
      liveUrl: 'https://apple-vers.vercel.app/',
    },
  ];

  for (const [index, project] of projects.entries()) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (existing) continue;
    await prisma.project.create({ data: { ...project, order: index } });
  }
  // --- 11 draft post placeholders (PRD §12 metadata only; owner pastes Markdown) ---
  const drafts = [
    {
      title:
        'How I Built and Deployed a Production ready MERN Application on AWS using Modular Terraform and Keyless GitHub Actions OIDC 🚀',
      slug: 'how-i-built-and-deployed-a-full-stack-mern-application-on-aws-using-modular-terraform-and-keyless',
      tags: ['aws', 'devops', 'terraform', 'webdev'],
      canonicalUrl:
        'https://dev.to/ideategudy/how-i-built-and-deployed-a-full-stack-mern-application-on-aws-using-modular-terraform-and-keyless-3fba',
      readingTime: 9,
    },
    {
      title:
        'How I Built and Deployed a Full-Stack MERN App on AWS EC2 using Docker Compose, Terraform, and GitHub Actions 🚀',
      slug: 'how-i-built-and-deployed-a-full-stack-mern-app-on-aws-ec2-using-docker-compose-terraform-and',
      tags: ['aws', 'devops', 'docker', 'terraform'],
      canonicalUrl:
        'https://dev.to/ideategudy/how-i-built-and-deployed-a-full-stack-mern-app-on-aws-ec2-using-docker-compose-terraform-and-23k8',
      readingTime: 8,
    },
    {
      title: 'Build Smart AI Agents with Mastra and TypeScript (Integrating with Telex.im)',
      slug: 'how-to-create-ai-agents-using-mastra-and-typescript',
      tags: ['agents', 'node', 'typescript', 'ai'],
      canonicalUrl: 'https://dev.to/ideategudy/how-to-create-ai-agents-using-mastra-and-typescript-1pai',
      readingTime: 9,
    },
    {
      title:
        "Flutter's UI Architecture Explained for Beginners: Widgets, Elements, and Render Objects",
      slug: 'flutter-basics',
      tags: ['mobile', 'flutter', 'programming', 'beginners'],
      canonicalUrl: 'https://dev.to/ideategudy/flutter-basics-4l2f',
      readingTime: 9,
    },
    {
      title: 'Dynamic Profile Endpoint (Express/Nodejs/Typescript)',
      slug: 'dynamic-profile-endpoint-expressnodejstypescript',
      tags: ['express', 'node', 'typescript', 'backend'],
      canonicalUrl:
        'https://dev.to/ideategudy/dynamic-profile-endpoint-expressnodejstypescript-52c3',
      readingTime: 3,
    },
    {
      title: 'Ansible For Beginners - Part 1',
      slug: 'ansible-for-beginners-part-1',
      tags: ['ansible', 'devops', 'cloudcomputing', 'automation'],
      canonicalUrl: 'https://dev.to/ideategudy/ansible-for-beginners-part-1-ag7',
      readingTime: 7,
    },
    {
      title: 'Docker For Beginners',
      slug: 'docker-for-beginners',
      tags: ['devops', 'docker', 'containerapps', 'softwaredevelopment'],
      canonicalUrl: 'https://dev.to/ideategudy/docker-for-beginners-3jgd',
      readingTime: 10,
    },
    {
      title: "Hosting a Static website on a private Amazon S3 bucket using CloudFront's OAC",
      slug: 'hosting-a-static-website-on-a-private-amazon-s3-bucket-using-cloudfronts-oac',
      tags: ['aws', 'staticwebapps', 'cloudstorage', 'devops'],
      canonicalUrl:
        'https://dev.to/ideategudy/hosting-a-static-website-on-a-private-amazon-s3-bucket-using-cloudfronts-oac-1b0i',
      readingTime: 3,
    },
    {
      title:
        'Laravel LAMP Stack Deployment: Automating Setup with Bash Script on an Ubuntu Server',
      slug: 'laravel-lamp-stack-deployment-automating-setup-with-bash-script-on-an-ubuntu-server',
      tags: ['laravel', 'bash', 'automation'],
      canonicalUrl:
        'https://dev.to/ideategudy/laravel-lamp-stack-deployment-automating-setup-with-bash-script-on-an-ubuntu-server-19kp',
      readingTime: 5,
    },
    {
      title: 'Protecting Sensitive Data using Ansible Vault',
      slug: 'protecting-sensitive-data-using-ansible-vault',
      tags: ['ansible', 'devops', 'cloudcomputing', 'security'],
      canonicalUrl: 'https://dev.to/ideategudy/protecting-sensitive-data-using-ansible-vault-5h7k',
      readingTime: 4,
    },
    {
      title: 'User Management Automation Using Bash Script',
      slug: 'user-management-automation-using-bash-script',
      tags: ['devops', 'automation', 'linux', 'bash'],
      canonicalUrl: 'https://dev.to/ideategudy/user-management-automation-using-bash-script-1p4o',
      readingTime: 3,
    },
  ];

  for (const draft of drafts) {
    // Keep existing content if the owner already pasted it; only backfill metadata.
    await prisma.post.upsert({
      where: { slug: draft.slug },
      update: {},
      create: {
        title: draft.title,
        slug: draft.slug,
        excerpt: '',
        content: '',
        tags: draft.tags,
        status: 'DRAFT',
        publishedAt: null, // becomes now()/chosen date when the owner publishes
        canonicalUrl: draft.canonicalUrl,
        readingTime: draft.readingTime,
      },
    });
  }

  console.log('Seed complete: admin user, site content, 4 projects, 11 draft posts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
