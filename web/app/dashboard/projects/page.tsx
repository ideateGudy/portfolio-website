'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminApi, type AdminProject } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUploader } from '@/components/dashboard/ImageUploader';

type Draft = {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  tech: string;
  liveUrl: string;
  repoUrl: string;
  visible: boolean;
};

const empty: Draft = {
  title: '',
  description: '',
  imageUrl: '',
  imageAlt: '',
  tech: '',
  liveUrl: '',
  repoUrl: '',
  visible: true,
};

function toDraft(p: AdminProject): Draft {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl ?? '',
    imageAlt: p.imageAlt ?? '',
    tech: p.tech.join(', '),
    liveUrl: p.liveUrl ?? '',
    repoUrl: p.repoUrl ?? '',
    visible: p.visible,
  };
}


export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const toast = useUIStore((s) => s.toast);

  const load = useCallback(async () => {
    setError(null);
    try {
      setProjects(await adminApi.projects.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects');
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void adminApi.projects
      .list()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load projects');
          setProjects([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);


  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...(d ?? empty), ...p }));
  }

  async function onSave() {
    if (!draft) return;
    if (!draft.title.trim() || !draft.description.trim()) {
      setError('Title and description are required');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        imageUrl: draft.imageUrl || undefined,
        imageAlt: draft.imageAlt || undefined,
        tech: draft.tech.split(',').map((t) => t.trim()).filter(Boolean),
        liveUrl: draft.liveUrl.trim() || undefined,
        repoUrl: draft.repoUrl.trim() || undefined,
        visible: draft.visible,
      };
      if (draft.id) await adminApi.projects.update(draft.id, body);
      else await adminApi.projects.create(body);
      setDraft(null);
      toast('Project saved');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (!projects) return;
    const next = [...projects];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setProjects(next);
    try {
      await adminApi.projects.reorder(next.map((p) => p.id));
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Reorder failed', 'error');
      await load();
    }
  }

  function onDelete(p: AdminProject) {
    openConfirm({
      title: 'Delete project',
      description: `“${p.title}” will be permanently removed.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        await adminApi.projects.remove(p.id);
        toast('Project deleted');
        await load();
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Projects</h1>
          <p className="mt-1 text-sm text-muted">Manage the work shown on your portfolio.</p>
        </div>
        <Button onClick={() => setDraft(draft ? null : empty)}>
          {draft ? 'Cancel' : 'New project'}
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-600/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {draft && (
        <div className="glass flex flex-col gap-4 p-5">
          <h2 className="text-lg font-semibold text-fg">{draft.id ? 'Edit project' : 'New project'}</h2>
          <Input label="Title" value={draft.title} onChange={(e) => patch({ title: e.target.value })} />
          <Textarea
            label="Description"
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
          />
          <ImageUploader
            label="Cover image"
            folder="portfolio/projects"
            value={draft.imageUrl}
            onUploaded={(url) => patch({ imageUrl: url })}
          />
          {draft.imageUrl && (
            <Input label="Image alt" value={draft.imageAlt} onChange={(e) => patch({ imageAlt: e.target.value })} />
          )}
          <Input
            label="Tech (comma-separated)"
            value={draft.tech}
            onChange={(e) => patch({ tech: e.target.value })}
            placeholder="React, Node, AWS"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Live URL" value={draft.liveUrl} onChange={(e) => patch({ liveUrl: e.target.value })} />
            <Input label="Repo URL" value={draft.repoUrl} onChange={(e) => patch({ repoUrl: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={draft.visible}
              onChange={(e) => patch({ visible: e.target.checked })}
              className="h-4 w-4"
            />
            Visible on the public site
          </label>
          <div className="flex gap-2">
            <Button disabled={busy} onClick={() => void onSave()}>
              {busy ? 'Saving…' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="glass divide-y divide-[var(--line)]">
        {projects === null ? (
          <p className="px-4 py-8 text-center text-sm text-muted">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">No projects yet.</p>
        ) : (
          projects.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => void move(i, -1)}
                  className="text-muted hover:text-fg disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === projects.length - 1}
                  onClick={() => void move(i, 1)}
                  className="text-muted hover:text-fg disabled:opacity-30"
                >
                  ▼
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium text-fg">
                  {p.title}
                  {!p.visible && <span className="font-mono text-xs text-muted">(hidden)</span>}
                </p>
                <p className="truncate text-sm text-muted">{p.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => setDraft(toDraft(p))}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-xs text-red-600 dark:text-red-400"
                  onClick={() => onDelete(p)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
