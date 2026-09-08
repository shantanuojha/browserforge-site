/**
 * Single source of truth for domains, emails, store URLs and other
 * deployment-specific constants. Nothing else in the site should hard-code
 * a hostname or an email address.
 */

/** Root domain the owner controls. */
export const ROOT_DOMAIN = 'shantanuojha.com';

/**
 * Host that serves the BrowserForge landing page, privacy policies, terms and
 * support pages. Currently the apex domain; switch to
 * `browserforge.${ROOT_DOMAIN}` if the apex is needed for something else.
 * Remember to update `vercel.json` (the `has: host` rules) if this changes.
 */
export const LANDING_HOST = ROOT_DOMAIN;

/** Absolute origin of the landing site, without trailing slash. */
export const SITE_URL = `https://${LANDING_HOST}`;

export const BRAND = 'BrowserForge';
export const OWNER = 'Shantanu Ojha';
export const TAGLINE =
  'The open-source workshop that rebuilds the browser tools Manifest V3 left behind.';

/** Contact addresses (placeholders until mailboxes exist). */
export const CONTACT_EMAIL = `hello@${ROOT_DOMAIN}`;
export const PRIVACY_EMAIL = CONTACT_EMAIL;

/** Source code. */
export const GITHUB_ORG_URL = 'https://github.com/shantanuojha';
export const GITHUB_REPO_URL = 'https://github.com/shantanuojha/browserforge';
export const SITE_REPO_URL = 'https://github.com/shantanuojha/browserforge-site';

/** Payments / licensing provider. */
export const LICENCE_PROVIDER = 'Lemon Squeezy';
export const LICENCE_PROVIDER_URL = 'https://www.lemonsqueezy.com';
export const LICENCE_PROVIDER_PRIVACY_URL = 'https://www.lemonsqueezy.com/privacy';
export const LICENCE_API_HOST = 'api.lemonsqueezy.com';
export const REFUND_WINDOW_DAYS = 14;

/** Legal document dates. */
export const PRIVACY_EFFECTIVE_DATE = '2026-09-08';
export const TERMS_EFFECTIVE_DATE = '2026-09-08';

export type ProductSlug = 'arbor' | 'reroute' | 'cookiesweep';

export const PRODUCT_SLUGS: readonly ProductSlug[] = ['arbor', 'reroute', 'cookiesweep'];

/**
 * Product hostnames. Each product page is canonical at its own subdomain. The
 * page is built as `/${slug}` on the landing host only so the host rewrite in
 * `vercel.json` has a file to serve; `https://${LANDING_HOST}/${slug}` itself
 * is permanently redirected to the subdomain.
 */
export const PRODUCT_HOSTS: Record<ProductSlug, string> = {
  arbor: `arbor.${ROOT_DOMAIN}`,
  reroute: `reroute.${ROOT_DOMAIN}`,
  cookiesweep: `cookiesweep.${ROOT_DOMAIN}`,
};

/**
 * Store listing URLs. PLACEHOLDERS: replace with the real Chrome Web Store
 * and Edge Add-ons listing URLs once the extensions are published. While the
 * value is `null` the "Add to Chrome" button renders as a disabled
 * "not yet published" control.
 */
export const STORE_URLS: Record<ProductSlug, { chrome: string | null; edge: string | null }> = {
  arbor: { chrome: null, edge: null },
  reroute: { chrome: null, edge: null },
  cookiesweep: { chrome: null, edge: null },
};

/** Lemon Squeezy checkout URLs for Pro licences. PLACEHOLDERS. */
export const CHECKOUT_URLS: Partial<Record<ProductSlug, string | null>> = {
  arbor: null,
  reroute: null,
};

/** Per-product source, issues and changelog links. */
export const PRODUCT_LINKS: Record<
  ProductSlug,
  { source: string; issues: string; changelog: string }
> = {
  arbor: {
    source: `${GITHUB_REPO_URL}/tree/main/apps/arbor`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Aarbor`,
    changelog: `${GITHUB_REPO_URL}/releases?q=arbor`,
  },
  reroute: {
    source: `${GITHUB_REPO_URL}/tree/main/apps/reroute`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Areroute`,
    changelog: `${GITHUB_REPO_URL}/releases?q=reroute`,
  },
  cookiesweep: {
    source: `${GITHUB_REPO_URL}/tree/main/apps/cookiesweep`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Acookiesweep`,
    changelog: `${GITHUB_REPO_URL}/releases?q=cookiesweep`,
  },
};

export const NEW_ISSUE_URL = `${GITHUB_REPO_URL}/issues/new/choose`;
