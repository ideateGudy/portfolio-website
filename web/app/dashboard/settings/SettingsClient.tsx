'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUploader } from '@/components/dashboard/ImageUploader';

function SettingsClient() {
  const toast = useUIStore((s) => s.toast);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [resumeUrl, setResumeUrl] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [github, setGithub] = useState('');
  const [x, setX] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [devto, setDevto] = useState('');

  useEffect(() => {
    void adminApi.content.getAll().then((all) => {
      if (!all) return;
      setResumeUrl(typeof all.resumeUrl === 'string' ? all.resumeUrl : '');
      const profile = all.profile as Record<string, unknown> | undefined;
      if (profile) {
        setName(String(profile.name ?? ''));
        setRole(String(profile.role ?? ''));
        setAvatarUrl(String(profile.avatarUrl ?? ''));
        setBio(String(profile.bio ?? ''));
      }
      const contact = all.contact as Record<string, unknown> | undefined;
      if (contact) setEmail(String(contact.email ?? ''));
      const socials = all.socials as Record<string, unknown> | undefined;
      if (socials) {
        setGithub(String(socials.github ?? ''));
        setX(String(socials.x ?? ''));
        setLinkedin(String(socials.linkedin ?? ''));
        setDevto(String(socials.devto ?? ''));
      }
    });
  }, []);

  async function save() {
    setError(null);
    if (resumeUrl && !/^https?:\/\//.test(resumeUrl)) {
      setError('Résumé URL must start with http(s)://');
      return;
    }
    setBusy(true);
    try {
      await Promise.all([
        adminApi.content.set('resumeUrl', resumeUrl),
        adminApi.content.set('profile', { name, role, avatarUrl, bio }),
        adminApi.content.set('contact', { email }),
        adminApi.content.set('socials', { github, x, linkedin, devto }),
      ]);
      toast('Settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Settings</h1>
        <p className="mt-1 text-sm text-muted">Profile, résumé link and social accounts.</p>
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-red-600/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <section className="glass flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold text-fg">Résumé</h2>
        <Input
          label="Résumé URL (Google Drive/Docs)"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          placeholder="https://drive.google.com/…"
        />
        <p className="-mt-2 text-xs text-muted">
          Leave empty to hide the “View Resume” buttons across the site.
        </p>
      </section>
      <section className="glass flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold text-fg">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Role / title" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <ImageUploader
          label="Profile picture"
          folder="portfolio/profile"
          value={avatarUrl}
          onUploaded={setAvatarUrl}
        />
        <Textarea label="Short bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={2} />
        <Input label="Contact email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </section>
      <section className="glass flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold text-fg">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="GitHub" value={github} onChange={(e) => setGithub(e.target.value)} />
          <Input label="X (Twitter)" value={x} onChange={(e) => setX(e.target.value)} />
          <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          <Input label="dev.to" value={devto} onChange={(e) => setDevto(e.target.value)} />
        </div>
      </section>
      <div className="flex justify-end">
        <Button disabled={busy} onClick={() => void save()}>
          {busy ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </div>
  );
}

export default SettingsClient;
