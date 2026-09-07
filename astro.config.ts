import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { PRODUCT_HOSTS, PRODUCT_SLUGS, SITE_URL } from './src/config';

/**
 * The landing page is built as `/home` rather than `/` on purpose.
 *
 * Vercel serves files that exist on disk before it evaluates `rewrites`, so a
 * root `index.html` would win over the host-based rewrite that must turn
 * `arbor.shantanuojha.com/` into `/arbor`. `vercel.json` therefore rewrites
 * `/` -> `/home` for the landing host. This tiny integration reproduces that
 * rewrite in the dev server and `astro preview` so `/` works locally too.
 */
function rootToHome(): AstroIntegration {
  return {
    name: 'browserforge:root-to-home',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/' || req.url === '') req.url = '/home';
          next();
        });
      },
    },
  };
}

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    rootToHome(),
    sitemap({
      // Product pages are canonical on their own hosts; the landing page is `/`.
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/$/, '');
        if (path === '/home') {
          item.url = `${SITE_URL}/`;
          return item;
        }
        if (path === '/404') return undefined;
        for (const slug of PRODUCT_SLUGS) {
          if (path === `/${slug}`) {
            item.url = `https://${PRODUCT_HOSTS[slug]}/`;
            return item;
          }
        }
        item.url = `${SITE_URL}${path}`;
        return item;
      },
    }),
  ],
  devToolbar: { enabled: false },
});
