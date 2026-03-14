# claudiocaceres.com

Personal site (Vite + React SPA). Deployed on **Cloudflare Pages**.

## Local development

```bash
yarn install
yarn dev
```

Open http://localhost:3000. Use the nav or go directly to http://localhost:3000/resume and http://localhost:3000/contact to verify routes.

## Build

```bash
yarn build
```

Output is written to `build/`.

## Deployment (Cloudflare Pages)

1. **One-time setup**
   - Create a [Cloudflare account](https://dash.cloudflare.com) and a Pages project named `claudiocaceres-com` (or change the name in the workflow and create the project with that name).
   - For **GitHub Actions** deploy, add repository secrets:
     - `CLOUDFLARE_API_TOKEN`: API token with "Cloudflare Pages — Edit" (create under [API Tokens](https://dash.cloudflare.com/profile/api-tokens)).
     - `CLOUDFLARE_ACCOUNT_ID`: from Cloudflare dashboard → Account ID.

2. **Deploy via GitHub Actions**
   - Push to `master` runs the workflow in `.github/workflows/cloudflare-pages.yaml`: it builds the frontend and runs `wrangler pages deploy build --project-name=claudiocaceres-com`.
   - To use a different project name, edit the workflow and ensure a Pages project with that name exists.

3. **Custom domain**
   - In Cloudflare Pages → your project → **Custom domains**, add `claudiocaceres.com` and `www.claudiocaceres.com`. Follow the DNS instructions (CNAME or A/AAAA as shown).

4. **SPA routing**
   - The file `public/_redirects` is copied into `build/` and tells Cloudflare Pages to serve `index.html` for all paths (`/* → /index.html 200`), so direct links to `/resume` and `/contact` work.

## Verification checklist

- **Routes**: Open `https://<your-domain>/`, `/resume`, `/contact` in a new tab or after a hard refresh; all should load the app (no 404).
- **Analytics**: Google Analytics tag is in `index.html` (ID `G-SRQZQ7KK1M`); SPA route changes are tracked in `src/App.tsx`.
- **HTTPS**: Ensure SSL is active for apex and `www` on Cloudflare.
