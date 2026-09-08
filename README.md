# BrowserForge website

Marketing and legal site for [BrowserForge](https://github.com/shantanuojha/browserforge), a set of open-source Manifest V3 browser extensions by Shantanu Ojha: **Arbor** (tree-style tab manager), **Reroute** (URL rewrite rules) and **CookieSweep** (automatic cookie cleanup).

Static Astro site. No UI framework, no analytics, fonts self-hosted. One Vercel deployment answers for four hostnames.

| Host | Serves |
| --- | --- |
| `shantanuojha.com` | Landing page, `/privacy` (index), `/terms`, `/support`; `/arbor` and `/privacy/arbor` (etc.) 308-redirect to the product host |
| `arbor.shantanuojha.com` | The Arbor product page at `/`, its privacy policy at `/privacy` |
| `reroute.shantanuojha.com` | The Reroute product page at `/`, its privacy policy at `/privacy` |
| `cookiesweep.shantanuojha.com` | The CookieSweep product page at `/`, its privacy policy at `/privacy` |

## Routes

| Route | File | Notes |
| --- | --- | --- |
| `/` | `src/pages/home.astro` | Built as `home.html`; Vercel rewrites `/` to it (see below) |
| `/arbor`, `/reroute`, `/cookiesweep` | `src/pages/*.astro` -> `src/layouts/ProductPage.astro` | Features, status, pricing, import callout, privacy + changelog links |
| `/privacy` | `src/pages/privacy-index.astro` | Index of policies; built as `privacy-index.html`, Vercel rewrites `/privacy` to it (see below) |
| `/privacy/arbor`, `/privacy/reroute`, `/privacy/cookiesweep` | `src/layouts/PrivacyPolicy.astro` | Per-extension privacy policy with permissions table and Limited Use statement; canonical at `https://<slug>.shantanuojha.com/privacy` |
| `/terms` | `src/pages/terms.astro` | One-time licence terms, refunds, MIT |
| `/support` | `src/pages/support.astro` | GitHub issue links per product, email |
| `/404` | `src/pages/404.astro` | Served by Vercel for unknown paths on every host |
| `/sitemap-index.xml`, `/robots.txt` | generated / `public/` | |

All product copy, feature lists, pricing and privacy details live in `src/data/products.ts`. All domains, emails, store URLs and checkout URLs live in `src/config.ts`. Nothing else should hard-code a hostname or address.

## Development

Requires Node >= 22.12 and pnpm 10.

Commits must be authored and committed as `shantanu ojha <shantanu.ojha49@gmail.com>` (no `Co-authored-by` trailers for tools or agents).

```powershell
pnpm install
pnpm dev        # http://localhost:4321  (/ is rewritten to /home by a dev-only integration)
pnpm build      # static output in dist/
pnpm preview    # serves dist/ ; open /home and /privacy-index (the / and /privacy rewrites are Vercel-only)
pnpm check      # astro check (TypeScript + template diagnostics)
pnpm og         # regenerate public/og/*.png and PNG favicons from SVG via sharp
```

## How host routing works

The build is a plain static folder. `vercel.json` does the rest:

- `cleanUrls: true`, `trailingSlash: false`, and Astro is configured with `build.format: 'file'` and `trailingSlash: 'never'`, so `/arbor` serves `arbor.html`.
- For each product host, rewrites with `has: [{ type: "host", value: "arbor.shantanuojha.com" }]` map `/` to `/arbor`, `/privacy` to `/privacy/arbor`, and `/(.*)` to `/arbor/$1`. Order matters: the `/privacy` rule must come before the catch-all.
- Vercel serves files that exist on disk **before** evaluating rewrites. That is why the landing page is built as `home.html` rather than `index.html`, and the privacy index as `privacy-index.html` rather than `privacy/index.html`: a file at the canonical path would win over the host rewrite and every product subdomain would show the landing page (or the policy index). Final rewrites map `/` to `/home` and `/privacy` to `/privacy-index` for the landing host.
- Apex redirects (308) send `shantanuojha.com/arbor`, `/arbor/*` and `/privacy/arbor` to the product host; likewise for the other products.

Because product pages and privacy policies are served from their own hosts, every link that leaves those pages is an absolute URL (`src/lib/links.ts`), and only `#anchors` are relative. Pages that live only on the landing host (privacy index, terms, support) use relative links so preview deployments keep working.

## Changing the landing host

If the landing page should move from the apex to `browserforge.shantanuojha.com`:

1. Set `LANDING_HOST` in `src/config.ts`.
2. Update `public/robots.txt` (`Sitemap:` line).
3. Add the new domain in Vercel and its CNAME at the registrar (see `DEPLOY.md`).

No other code changes are needed; `vercel.json` only names the product hosts.

## Placeholders to fill in

- `STORE_URLS` and `CHECKOUT_URLS` in `src/config.ts` (currently `null`, which renders disabled buttons).
- `PRODUCT_LINKS.*.source` paths assume `apps/<slug>` in the extensions monorepo.
- `CONTACT_EMAIL` (`hello@shantanuojha.com`) needs a real mailbox.
- Product `status` values in `src/data/products.ts` (`in-development` today).

## Deploy

See `DEPLOY.md`.

## Licence

MIT. Product names of third-party extensions (Tabs Outliner, Redirector, Cookie AutoDelete, ClearURLs) appear on the site only to describe import compatibility; BrowserForge is not affiliated with them or with Google.
