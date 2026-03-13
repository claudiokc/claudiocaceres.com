# Security

## Summary of findings (as of last review)

### 1. Secrets and credentials

- **`.env`** is gitignored and must **never** be committed. It may contain `CLOUDFLARE_API_TOKEN` for local or CI use.
- **CI (GitHub Actions)** should use only **repository secrets** (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`), not `.env` in the repo.
- **If the Cloudflare API token was ever committed or shared**, rotate it immediately in [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) and update the value in GitHub Secrets (and locally in `.env` if you use it there).

### 2. Dependencies

- **Vite** (and its dependency **esbuild**) had known CVEs in the version previously used. These are addressed by upgrading to Vite **4.5.13+** (see `package.json`). Run `yarn audit` periodically and upgrade dependencies as needed.
- Any remaining audit findings in **devDependencies** (e.g. **lodash** via `@testing-library/jest-dom`, **rollup** via Vite) are build-time only and do not ship to production. Consider upgrading to Vite 5+ when feasible for newer Rollup and other fixes.

### 3. Frontend

- No `dangerouslySetInnerHTML`, `eval`, or raw `innerHTML` usage was found; React’s default escaping is in use.
- **External links**: There are no `target="_blank"` links in the repo. If you add any in the future, use `rel="noopener noreferrer"` to avoid tab-nabbing (e.g. `<a href="..." target="_blank" rel="noopener noreferrer">`).

### 4. Hosting and config

- Hosting is **Cloudflare Pages** (static). Do not put API keys or secrets in repository config; use Cloudflare environment variables or similar for any production secrets.
- **Contact form** currently only logs to the console and does not send data to a backend; there is no server-side processing or storage to harden until you add an API.

### 5. Recommended actions

1. Keep **`.env`** out of version control and use GitHub Secrets for CI.
2. Run **`yarn audit`** after dependency changes and fix or accept reported issues.
3. Rotate **CLOUDFLARE_API_TOKEN** if it may have been exposed.
4. When adding **`target="_blank"`** links, always set **`rel="noopener noreferrer"`**.
