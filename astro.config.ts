import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { PRIVACY_URLS, PRODUCT_HOSTS, PRODUCT_SLUGS, SITE_URL } from './src/config';

/**
 * The landing page is built as `/home` rather than `/`, and the privacy index
 * as `/privacy-index` rather than `/privacy`, on purpose.
 *
 * Vercel serves files that exist on disk before it evaluates `rewrites`, so a
 * root `index.html` would win over the host-based rewrite that must turn
 * `arbor.shantanuojha.com/` into `/arbor`, and a `privacy/index.html` would
 * win over the one that turns `arbor.shantanuojha.com/privacy` into
 * `/privacy/arbor`. `vercel.json` therefore rewrites `/` -> `/home` and
 * `/privacy` -> `/privacy-index` for the landing host. This tiny integration
 * reproduces those rewrites in the dev server and `astro preview` so the
 * canonical paths work locally too.
 */
const LANDING_REWRITES: Record<string, string> = {
  '/': '/home',
  '/privacy': '/privacy-index',
};

function landingRewrites(): AstroIntegration {
  return {
    name: 'browserforge:landing-rewrites',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, _res, next) => {
          const path = (req.url ?? '').replace(/\/+$/, '') || '/';
          const target = LANDING_REWRITES[path];
          if (target) req.url = target;
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
    landingRewrites(),
    sitemap({
      // Product pages and their privacy policies are canonical on their own
      // hosts; the landing page is `/` and the privacy index is `/privacy`.
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/\/$/, '');
        if (path === '/home') {
          item.url = `${SITE_URL}/`;
          return item;
        }
        if (path === '/privacy-index') {
          item.url = `${SITE_URL}/privacy`;
          return item;
        }
        if (path === '/404') return undefined;
        for (const slug of PRODUCT_SLUGS) {
          if (path === `/${slug}`) {
            item.url = `https://${PRODUCT_HOSTS[slug]}/`;
            return item;
          }
          if (path === `/privacy/${slug}`) {
            item.url = PRIVACY_URLS[slug];
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
