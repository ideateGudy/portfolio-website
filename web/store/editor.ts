import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PostDraft = {
  id?: string; // set when editing an existing post
  title: string;
  slug: string;
  excerpt: string;
  tags: string; // comma-separated while editing
  coverUrl: string;
  coverAlt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string; // datetime-local value, "" = now on publish
  canonicalUrl: string;
};

export const emptyDraft: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  coverUrl: "",
  coverAlt: "",
  content: "",
  status: "DRAFT",
  publishedAt: "",
  canonicalUrl: "",
};

type EditorState = {
  draft: PostDraft;
  setDraft: (patch: Partial<PostDraft>) => void;
  resetDraft: (draft?: PostDraft) => void;
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      draft: emptyDraft,
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: (draft = emptyDraft) => set({ draft }),
    }),
    { name: "post-draft" },
  ),
);
