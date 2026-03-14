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

## Deployment (Cloudflare Pages) — GitHub Actions only (Option A)

We **do not** use Cloudflare’s built-in Git build (which can fail due to Yarn/Node version mismatch). The site is built only in GitHub Actions and deployed via the Wrangler API.

1. **One-time setup in Cloudflare**
   - Create a [Cloudflare account](https://dash.cloudflare.com) if needed.
   - Create a **Pages** project: **Workers & Pages → Create application → Pages → Connect to Git**.
   - Choose **Direct Upload** (do **not** connect your Git repo here). Create a project named `claudiocaceres-com` (or match the name in the workflow).
   - If you already have a project connected to Git: go to **Settings → Builds & deployments** and either disconnect the Git source and use Direct Upload only, or create a new Direct Upload project. Deploys will come only from GitHub Actions.

2. **One-time setup in GitHub**
   - In the repo: **Settings → Secrets and variables → Actions**. Add:
     - `CLOUDFLARE_API_TOKEN`: API token with **Cloudflare Pages — Edit** (create under [API Tokens](https://dash.cloudflare.com/profile/api-tokens)).
     - `CLOUDFLARE_ACCOUNT_ID`: from Cloudflare dashboard (right-hand sidebar → **Account ID**).

3. **Deploy**
   - Push to `master` (or run the workflow manually: **Actions → Deploy to Cloudflare Pages → Run workflow**). The workflow builds the app and runs `wrangler pages deploy build --project-name=claudiocaceres-com`.
   - To use a different project name, edit the workflow and ensure a Pages project with that name exists.

4. **Custom domain**
   - In Cloudflare Pages → your project → **Custom domains**, add `claudiocaceres.com` and `www.claudiocaceres.com`. Follow the DNS instructions (CNAME or A/AAAA as shown).

5. **SPA routing**
   - The file `public/_redirects` is copied into `build/` and tells Cloudflare Pages to serve `index.html` for all paths (`/* → /index.html 200`), so direct links to `/resume` and `/contact` work.

## Verification checklist

- **Routes**: Open `https://<your-domain>/`, `/resume`, `/contact` in a new tab or after a hard refresh; all should load the app (no 404).
- **Analytics**: Google Analytics tag is in `index.html` (ID `G-SRQZQ7KK1M`); SPA route changes are tracked in `src/App.tsx`.
- **HTTPS**: Ensure SSL is active for apex and `www` on Cloudflare.
