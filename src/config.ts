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

/**
 * Payments / licensing provider. `LICENSE_PROVIDER` must match the
 * `WXT_LICENSE_PROVIDER` the extensions are built with, and both must flip on
 * the same day: the privacy policies name the API host the extensions call,
 * the terms name the merchant of record, and the Pro button links to the
 * provider's checkout. Bump `PRIVACY_EFFECTIVE_DATE` and `TERMS_EFFECTIVE_DATE`
 * when it changes.
 */
export type LicenseProviderId = 'lemonsqueezy' | 'polar';
export const LICENSE_PROVIDER: LicenseProviderId = 'polar';

/**
 * Polar constants: public checkout links (`https://buy.polar.sh/polar_cl_...`)
 * for each Pro product and the customer portal (`https://polar.sh/<org-slug>/portal`).
 * Empty strings mean "not configured" and render as no link.
 */
export const POLAR_ARBOR_CHECKOUT_URL =
  'https://buy.polar.sh/polar_cl_jDjOkiSThpvFuLlt4GkjgAKsOtzErmBsdtQh801uZuF';
export const POLAR_REROUTE_CHECKOUT_URL =
  'https://buy.polar.sh/polar_cl_U2cHE7aJDjLVbnbxWvM8hgPoxkCKe6fNrimEz0F5f0c';
export const POLAR_CUSTOMER_PORTAL_URL = 'https://polar.sh/browserforge/portal';

/**
 * Lemon Squeezy checkout links (`buy_now_url` of each Pro product on the
 * `browserforge.lemonsqueezy.com` storefront). Retired once Polar is live.
 */
export const LEMONSQUEEZY_ARBOR_CHECKOUT_URL =
  'https://browserforge.lemonsqueezy.com/checkout/buy/57c6e6d6-8be1-42d9-943e-e05f7d556191';
export const LEMONSQUEEZY_REROUTE_CHECKOUT_URL =
  'https://browserforge.lemonsqueezy.com/checkout/buy/155e7615-3e23-4f18-8a82-9ec1208548d9';
export const LEMONSQUEEZY_CUSTOMER_PORTAL_URL = 'https://app.lemonsqueezy.com/my-orders';

interface LicenseProviderInfo {
  /** Display name, used in prose ("handled by Polar", "Polar is our merchant of record"). */
  name: string;
  /** Registered company name, used where the legal documents name the merchant of record. */
  legalName: string;
  url: string;
  privacyUrl: string;
  /** The one host the extensions contact for licence activation and re-validation. */
  apiHost: string;
  /** Where buyers find their keys again; linked from the extensions' "Restore purchase". */
  customerPortalUrl: string;
  checkout: { arbor: string; reroute: string };
}

const LICENSE_PROVIDERS: Record<LicenseProviderId, LicenseProviderInfo> = {
  lemonsqueezy: {
    name: 'Lemon Squeezy',
    legalName: 'Lemon Squeezy, LLC',
    url: 'https://www.lemonsqueezy.com',
    privacyUrl: 'https://www.lemonsqueezy.com/privacy',
    apiHost: 'api.lemonsqueezy.com',
    customerPortalUrl: LEMONSQUEEZY_CUSTOMER_PORTAL_URL,
    checkout: { arbor: LEMONSQUEEZY_ARBOR_CHECKOUT_URL, reroute: LEMONSQUEEZY_REROUTE_CHECKOUT_URL },
  },
  polar: {
    name: 'Polar',
    legalName: 'Polar Software, Inc.',
    url: 'https://polar.sh',
    privacyUrl: 'https://polar.sh/legal/privacy',
    apiHost: 'api.polar.sh',
    customerPortalUrl: POLAR_CUSTOMER_PORTAL_URL,
    checkout: { arbor: POLAR_ARBOR_CHECKOUT_URL, reroute: POLAR_REROUTE_CHECKOUT_URL },
  },
};

const provider = LICENSE_PROVIDERS[LICENSE_PROVIDER];

export const LICENCE_PROVIDER = provider.name;
export const LICENCE_PROVIDER_LEGAL_NAME = provider.legalName;
export const LICENCE_PROVIDER_URL = provider.url;
export const LICENCE_PROVIDER_PRIVACY_URL = provider.privacyUrl;
export const LICENCE_API_HOST = provider.apiHost;
export const CUSTOMER_PORTAL_URL = provider.customerPortalUrl;
export const REFUND_WINDOW_DAYS = 14;

/** Legal document dates. */
export const PRIVACY_EFFECTIVE_DATE = '2026-09-16';
export const TERMS_EFFECTIVE_DATE = '2026-09-16';

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
 * Canonical privacy-policy URL for each product, served at `/privacy` on the
 * product's own host. The page is built as `/privacy/${slug}` on the landing
 * host so the host rewrite in `vercel.json` has a file to serve;
 * `https://${LANDING_HOST}/privacy/${slug}` itself is permanently redirected
 * here. The index of all policies stays at `https://${LANDING_HOST}/privacy`.
 */
export const PRIVACY_URLS: Record<ProductSlug, string> = {
  arbor: `https://${PRODUCT_HOSTS.arbor}/privacy`,
  reroute: `https://${PRODUCT_HOSTS.reroute}/privacy`,
  cookiesweep: `https://${PRODUCT_HOSTS.cookiesweep}/privacy`,
};

/**
 * Store listing URLs. While a value is `null` the "Add to Chrome" button
 * renders as a disabled control labelled from the product's `status`
 * ("In review" / "Coming soon"). Edge users install from the Chrome Web Store;
 * `edge` stays `null` unless a separate Edge Add-ons listing exists.
 */
export const STORE_URLS: Record<ProductSlug, { chrome: string | null; edge: string | null }> = {
  arbor: {
    chrome: 'https://chromewebstore.google.com/detail/bchjeadfoipoeiiofffdeifecphcmhge',
    edge: null,
  },
  reroute: {
    chrome: 'https://chromewebstore.google.com/detail/aohmbahmabficbpaleikljpkmdopmccj',
    edge: null,
  },
  cookiesweep: { chrome: null, edge: null },
};

/** The current provider's hosted checkout per Pro product; an empty placeholder reads as `null`. */
const checkoutOrNull = (url: string): string | null => (url ? url : null);
export const ARBOR_CHECKOUT_URL = checkoutOrNull(provider.checkout.arbor);
export const REROUTE_CHECKOUT_URL = checkoutOrNull(provider.checkout.reroute);

export const CHECKOUT_URLS: Partial<Record<ProductSlug, string | null>> = {
  arbor: ARBOR_CHECKOUT_URL,
  reroute: REROUTE_CHECKOUT_URL,
};

/**
 * Whether Pro purchases are open. `true` once the provider's store can take
 * real payments (Polar: payout account connected, checkout links created,
 * sandbox test plan passed, extensions released with the same provider); while
 * `false` the Pro button is rendered disabled ("Pro opens soon") and the
 * checkout links above are not exposed.
 */
export const PRO_SALES_LIVE = true;

/** Per-product source, issues and changelog links. */
export const PRODUCT_LINKS: Record<
  ProductSlug,
  { source: string; issues: string; changelog: string }
> = {
  arbor: {
    source: `${GITHUB_REPO_URL}/tree/main/extensions/arbor`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Aarbor`,
    changelog: `${GITHUB_REPO_URL}/releases?q=arbor`,
  },
  reroute: {
    source: `${GITHUB_REPO_URL}/tree/main/extensions/reroute`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Areroute`,
    changelog: `${GITHUB_REPO_URL}/releases?q=reroute`,
  },
  cookiesweep: {
    source: `${GITHUB_REPO_URL}/tree/main/extensions/cookiesweep`,
    issues: `${GITHUB_REPO_URL}/issues?q=is%3Aissue+label%3Acookiesweep`,
    changelog: `${GITHUB_REPO_URL}/releases?q=cookiesweep`,
  },
};

export const NEW_ISSUE_URL = `${GITHUB_REPO_URL}/issues/new/choose`;
