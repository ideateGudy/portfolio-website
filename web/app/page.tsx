import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/site/Hero';
import { About } from '@/components/site/About';
import { Projects } from '@/components/site/Projects';
import { Services } from '@/components/site/Services';
import { Experience } from '@/components/site/Experience';
import { Education } from '@/components/site/Education';
import { Writing } from '@/components/site/Writing';
import { Contact } from '@/components/site/Contact';
import { ContactModal } from '@/components/site/ContactModal';
import { getContent, getLatestPosts, getProjects } from '@/lib/api';
import { parseContent } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const parsed = parseContent(await getContent());
  return {
    title: parsed.seoTitle,
    description: parsed.seoDescription,
    keywords: parsed.seoKeywords,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: parsed.seoTitle,
      description: parsed.seoDescription,
      ...(parsed.seoOgImageUrl ? { images: [{ url: parsed.seoOgImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: parsed.seoTitle,
      description: parsed.seoDescription,
      ...(parsed.seoOgImageUrl ? { images: [parsed.seoOgImageUrl] } : {}),
    },
  };
}

/** Portfolio home (PRD §5.1): all sections, API data with seed fallbacks. */
export default function Home() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="mx-auto min-h-[60vh] max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm text-muted">Loading portfolio…</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [contentRaw, projects, latest] = await Promise.all([
    getContent(),
    getProjects(),
    getLatestPosts(3),
  ]);
  const c = parseContent(contentRaw);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.profile.name,
    jobTitle: c.profile.role,
    url: siteUrl,
    description: c.profile.bio,
    sameAs: [c.socials.github, c.socials.x, c.socials.linkedin, c.socials.devto].filter(Boolean),
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: c.profile.name,
    url: siteUrl,
  };

  const vis = c.sectionVisibility;

  // Compute dynamic 2-digit indices for visible sections so numbering stays contiguous
  const sectionKeys = ['about', 'projects', 'services', 'experience', 'education', 'writing', 'contact'] as const;
  const indices: Record<string, string> = {};
  let currentCounter = 1;
  for (const key of sectionKeys) {
    if (vis[key]) {
      indices[key] = String(currentCounter).padStart(2, '0');
      currentCounter++;
    }
  }

  return (
    <div id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Navbar name={c.profile.name} resumeUrl={c.resumeUrl} visibility={vis} />
      <main id="main-content">
        <Hero hero={c.hero} profile={c.profile} socials={c.socials} resumeUrl={c.resumeUrl} />
        {vis.about && <About about={c.about} techStack={c.techStack} index={indices.about} />}
        {vis.projects && <Projects header={c.projectsHeader} projects={projects ?? []} index={indices.projects} />}
        {vis.services && <Services services={c.services} index={indices.services} />}
        {vis.experience && <Experience experience={c.experience} index={indices.experience} />}
        {vis.education && <Education education={c.education} index={indices.education} />}
        {vis.writing && <Writing posts={latest?.items ?? []} profile={c.profile} index={indices.writing} />}
        {vis.contact && <Contact contact={c.contact} socials={c.socials} resumeUrl={c.resumeUrl} index={indices.contact} />}
      </main>
      <Footer text={c.footerText} socials={c.socials} />
      <ContactModal recipientEmail={c.contact.email} />
    </div>
  );
}
