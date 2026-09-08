import { LANDING_HOST, PRODUCT_HOSTS, SITE_URL, type ProductSlug } from '../config';

/**
 * Link helpers.
 *
 * The site is static and one deployment answers for several hostnames:
 *
 *   https://shantanuojha.com/            landing, /privacy, /terms, /support
 *   https://arbor.shantanuojha.com/      product page, canonical; a Vercel
 *                                        rewrite serves the built `/arbor` file
 *
 * `https://shantanuojha.com/arbor` is permanently redirected to the subdomain
 * by `vercel.json`, so it must never be linked to. Product pages are served
 * from their own host, so any link that leaves the page must be an absolute
 * URL on the landing host. Only in-page anchors (`#pricing`) may be relative.
 */

/** Absolute URL on the landing host, e.g. `abs('/privacy/arbor')`. */
export function abs(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean.replace(/\/+$/, '')}`;
}

/**
 * Canonical URL of a product page, e.g. `https://arbor.shantanuojha.com/`.
 * Use this for every link to a product; the landing-host path `/arbor` only
 * exists as the rewrite target and redirects here.
 */
export function productHome(slug: ProductSlug): string {
  return `https://${PRODUCT_HOSTS[slug]}/`;
}

/** Absolute URL of a product's privacy policy on the landing host. */
export function privacyUrl(slug?: ProductSlug): string {
  return abs(slug ? `/privacy/${slug}` : '/privacy');
}

export const termsUrl = () => abs('/terms');
export const supportUrl = () => abs('/support');
export const homeUrl = () => abs('/');

/** Human-readable host for display, e.g. in the footer. */
export const landingHostLabel = LANDING_HOST;

export type LinkMode = 'relative' | 'absolute';

/**
 * Returns an href builder for shared components (header, footer).
 *
 * - `relative`: used on pages that only ever live on the landing host
 *   (landing, privacy, terms, support). Keeps preview deployments working.
 * - `absolute`: used on product pages, which may be served from a product
 *   subdomain where a relative `/privacy` would resolve to the wrong host.
 */
export function linker(mode: LinkMode): (path: string) => string {
  return mode === 'absolute' ? abs : (path: string) => (path === '/' ? '/' : path.replace(/\/+$/, ''));
}
