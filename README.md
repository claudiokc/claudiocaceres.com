# claudiocaceres.com

Personal site: a Vite + React SPA with a tiny API (Cloudflare Pages Functions), hosted on the **Cloudflare free plan**.

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/resume` | Resume, with a **Download CV (PDF)** button (generated in the browser) |
| `/contact` | Contact details; the form opens a draft in the visitor's email app |
| `/login` | Owner sign-in |
| `/admin` | Editor for the Professional Experience section (requires sign-in) |
| `/llms.txt` | Generated at build time from `src/data/resume.json` |
| `/api/resume` | `GET` current experience (public), `PUT` save it (signed in) |
| `/api/login`, `/api/session` | Sign in, check session, sign out |

Resume content lives in `src/data/resume.json`. Experience saved from `/admin` is stored in Cloudflare KV and
overrides that file's `experience` on the live site; if the API is down the bundled copy is shown.

## Local development

```bash
npm install
npm run dev        # UI on http://localhost:3000 (proxies /api to :8788)
npm run dev:api    # built site + API on http://localhost:8788
```

For the API, copy `.dev.vars.example` to `.dev.vars` and fill in both values. `npm run typecheck`, `npm test` and
`npm run build` are what CI runs.

## Deployment

Cloudflare Pages deploys the site itself through its Git integration with this repository (Pages project
`claudiocaceresdotcom`):

- A push to `master` deploys to production (`claudiocaceres.com`).
- Every other branch gets a preview URL, which the Cloudflare bot posts on the pull request.
- The build command is `npm run build` and the output directory is `build`, both set in the Pages project's
  **Settings → Build**.

`.github/workflows/ci.yaml` only checks the code: it runs typecheck, tests and build on every pull request and
push to `master`. It needs no secrets. Make it a required check (**Settings → Branches** in GitHub) if you want
failing code blocked from `master`, because Cloudflare deploys `master` whether or not CI passes.

## One-time setup for login and editing

Until this is done the site works normally and `/login` answers "not configured".
In the Cloudflare dashboard, on the Pages project → **Settings**:

1. **Bindings → Add → KV namespace**: create a namespace (any name) and bind it as `RESUME_KV`.
2. **Variables and Secrets** (type *Secret*, Production):
   - `ADMIN_PASSWORD_HASH`: output of `npm run hash-password`
   - `SESSION_SECRET`: output of `openssl rand -base64 32`
3. Redeploy so the Functions pick them up: **Deployments → latest production deployment → Retry deployment**,
   or push a commit to `master`.

Changing `SESSION_SECRET` signs everyone out; changing `ADMIN_PASSWORD_HASH` changes the password.

## Rate limiting and cost

On the free plan there are no bandwidth charges and nothing bills on overage, so traffic cannot raise the cost.
Static files never run a Function (`public/_routes.json` limits Functions to `/api/*`). On top of that:

- `/api/*`: 60 requests per minute per IP (per edge isolate, best effort).
- Login: 5 failed attempts per IP per 15 minutes and 15 failed attempts overall per hour (stored in KV),
  then `429` even for the right password.
- Writes must be same-origin, at most 64 KB, and are validated field by field.

Recommended, in the dashboard (free): **Security → WAF → Rate limiting rules**, one rule on
`(http.request.uri.path wildcard "/api/*")`, 20 requests per 10 seconds per IP, action *Block*; and turn on
**Security → Bots → Bot Fight Mode**.
