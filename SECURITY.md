# Security

- **Secrets**: `.env` and `.dev.vars` are gitignored. CI uses the repository secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID`; the site uses the Pages secrets `ADMIN_PASSWORD_HASH` and `SESSION_SECRET`.
  Rotate any of them if exposed.
- **Login**: one owner account. The password is stored only as a salted PBKDF2-SHA256 hash. Sessions are
  HMAC-signed cookies (`HttpOnly`, `Secure`, `SameSite=Strict`, 12 hours).
- **API**: writes require a valid session and a same-origin `Origin` header, are capped at 64 KB and validated.
  Rate limits are described in the README.
- **Headers**: `public/_headers` sets a Content-Security-Policy, `X-Frame-Options: DENY` and related headers.
- **Frontend**: no `dangerouslySetInnerHTML`; stored experience is rendered as text.
- **Dependencies**: Renovate opens a monthly update PR; run `npm audit` after dependency changes.

Report issues to the email address on the contact page.
