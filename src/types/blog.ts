import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export interface PayloadMedia {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: SerializedEditorState;
  coverImage?: PayloadMedia | null;
  categories?: BlogCategory[];
  publishedDate?: string;
}

export interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
