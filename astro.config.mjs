import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Set SITE_URL in the hosting platform after choosing the canonical domain.
const site = process.env.SITE_URL || 'https://aqua14.icu';
if (site && !/^https?:\/\//.test(site)) {
  throw new Error('SITE_URL must be a complete URL, e.g. https://your-domain.com');
}

export default defineConfig({
  site: site || undefined,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
});
