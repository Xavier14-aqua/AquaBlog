import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { entryUrl } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const [projects, journal] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('journal', ({ data }) => !data.draft),
  ]);
  const paths = ['/', '/projects/', '/curations/', '/journal/', '/about/',
    ...projects.map((e) => entryUrl('projects', e.id)),
    ...journal.map((e) => entryUrl('journal', e.id)),
  ];
  const urls = paths.map((path) => `<url><loc>${new URL(path, site).href.replaceAll('&', '&amp;')}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
