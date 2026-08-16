import type { BlogCategory, BlogPost, PayloadListResponse } from "../../types/blog";

const PAYLOAD_API_URL = import.meta.env.VITE_PAYLOAD_API_URL || 'http://localhost:3002/api';

const withLocale = (endpoint: string, locale?: string) => {
  const url = new URL(`${PAYLOAD_API_URL}${endpoint}`);
  // i18next may report a browser-detected variant like "en-US"; Payload's
  // locales are exactly "en"/"hu"/"de", so only the base tag is ever sent.
  if (locale) url.searchParams.set('locale', locale.split('-')[0]);
  return url.toString();
};

export const payloadClient = {
  get: async (endpoint: string, locale?: string) => {
    const response = await fetch(withLocale(endpoint, locale));
    if (!response.ok) throw new Error(`Payload API Error: ${response.statusText}`);
    return response.json();
  },
};

export const blogApi = {
  listPosts: (locale: string, params?: { category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams({
      depth: '1',
      page: String(params?.page ?? 1),
      sort: '-publishedDate',
    });
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.category) query.set('where[categories][in]', params.category);
    return payloadClient.get(`/posts?${query.toString()}`, locale) as Promise<PayloadListResponse<BlogPost>>;
  },

  getPostBySlug: (slug: string, locale: string) => {
    const query = new URLSearchParams({ depth: '2', limit: '1' });
    query.set('where[slug][equals]', slug);
    return payloadClient.get(`/posts?${query.toString()}`, locale) as Promise<PayloadListResponse<BlogPost>>;
  },

  listCategories: (locale: string) =>
    payloadClient.get('/categories?limit=100', locale) as Promise<PayloadListResponse<BlogCategory>>,
};
