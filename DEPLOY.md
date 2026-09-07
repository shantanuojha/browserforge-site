# Deploying the BrowserForge site to Vercel

One Vercel project, one static build, four hostnames. Host routing is handled entirely by `vercel.json`; there is nothing to configure in Astro for it.

## 1. Import the repository

1. Sign in to Vercel and choose **Add New... > Project**.
2. Import `shantanuojha/browserforge-site` from GitHub.
3. Settings Vercel should detect from the repo (check them):
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Install command: `pnpm install`
   - Node.js version: **22.x** or newer (Project Settings > General > Node.js Version). Astro 7 requires >= 22.12.
4. No environment variables are needed.
5. Deploy. The first deployment is reachable at `https://browserforge-site-<hash>.vercel.app`. On that host, `/` shows the landing page and `/arbor` etc. work; the product subdomains only exist once DNS is set up.

## 2. Add the domains to the project

Project **Settings > Domains > Add**. Add all four:

```
shantanuojha.com
arbor.shantanuojha.com
reroute.shantanuojha.com
cookiesweep.shantanuojha.com
```

Leave every domain pointing at the production branch (`main`). Do **not** set any of them to redirect to another; the `vercel.json` rewrites need each host to be served directly.

If Vercel offers to add `www.shantanuojha.com` as a redirect to the apex, accept it; it does not interfere.

## 3. DNS at the registrar

Vercel shows the exact records to add on the domain's card after you add it; those override anything written here if they differ. As of writing, the standard records are:

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | Apex `shantanuojha.com` |
| `CNAME` | `arbor` | `cname.vercel-dns.com` | `arbor.shantanuojha.com` |
| `CNAME` | `reroute` | `cname.vercel-dns.com` | `reroute.shantanuojha.com` |
| `CNAME` | `cookiesweep` | `cname.vercel-dns.com` | `cookiesweep.shantanuojha.com` |

Notes:

- If the DNS provider supports `ALIAS`/`ANAME`/flattened `CNAME` at the apex, `ALIAS @ -> cname.vercel-dns.com` can be used instead of the `A` record.
- Some Vercel accounts are issued a newer A record (for example `216.198.79.1`) or a per-project CNAME target. Use whatever the Vercel Domains page displays.
- Remove any existing `A`/`AAAA`/`CNAME` records for these names first; conflicting records prevent certificate issuance.
- Propagation usually takes minutes; Vercel issues TLS certificates automatically once the records resolve.

## 4. Verify

After DNS resolves, check each of these:

```
https://shantanuojha.com/                   landing page
https://shantanuojha.com/arbor              product page (same content as the subdomain)
https://arbor.shantanuojha.com/             Arbor product page
https://reroute.shantanuojha.com/           Reroute product page
https://cookiesweep.shantanuojha.com/       CookieSweep product page
https://shantanuojha.com/privacy/arbor      privacy policy
https://arbor.shantanuojha.com/anything     404 page
https://shantanuojha.com/sitemap-index.xml
```

Links on the product subdomains point to `https://shantanuojha.com/...` for privacy, terms and support, by design.

## 5. Optional: deploy from the command line

Only needed if you prefer not to use the Vercel dashboard. Requires a Vercel token (Account Settings > Tokens). Never commit it; keep it in `C:\Users\SHANTANU\.browserforge\secrets.env` as `VERCEL_TOKEN=...`.

```powershell
$token = (Get-Content C:\Users\SHANTANU\.browserforge\secrets.env | Select-String '^VERCEL_TOKEN=(.+)$').Matches[0].Groups[1].Value
pnpm dlx vercel@latest link --yes --token $token
pnpm dlx vercel@latest --prod --yes --token $token
pnpm dlx vercel@latest domains add shantanuojha.com --token $token
pnpm dlx vercel@latest domains add arbor.shantanuojha.com --token $token
pnpm dlx vercel@latest domains add reroute.shantanuojha.com --token $token
pnpm dlx vercel@latest domains add cookiesweep.shantanuojha.com --token $token
```

After `link`, connect the Vercel project to the GitHub repo in **Settings > Git** so pushes to `main` deploy automatically.

## 6. Moving the landing page to a subdomain later

If the apex is needed for something else and the landing page should live at `browserforge.shantanuojha.com`:

1. Set `LANDING_HOST = 'browserforge.shantanuojha.com'` in `src/config.ts`, update `public/robots.txt`, commit.
2. Add `browserforge.shantanuojha.com` in Vercel Domains and a `CNAME browserforge -> cname.vercel-dns.com` at the registrar.
3. Remove `shantanuojha.com` from the project (or leave it; the landing page would then be reachable at both).

The product subdomains and `vercel.json` are unaffected.
