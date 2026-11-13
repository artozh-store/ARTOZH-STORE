ARTOZH STORE — V5 Cloudflare Pages Functions

PACKAGE CONTENTS
- index.html: storefront based on the supplied V4; visible layout and existing interactions are retained.
- functions/api/products.js: server-side Pages Function that reads active products from Supabase.

DEPLOYMENT
1. Back up the current GitHub repository.
2. Replace the repository-root index.html with this package's index.html.
3. Copy the functions folder to the repository root. The exact path must be functions/api/products.js.
4. Commit and push to branch main. Cloudflare Pages should deploy automatically.
5. In Cloudflare Dashboard > Workers & Pages > artozh-store > Settings > Variables and secrets, add Production variables:
   SUPABASE_URL = https://siwfctlsymhzmpmpfinw.supabase.co
   SUPABASE_ANON_KEY = the current publishable/anon key already used by the storefront.
6. Save and redeploy. Do not use the Supabase service_role key.
7. Test https://artozh-store.pages.dev/api/products, then test product catalog, search, cart, WhatsApp checkout, and mobile layout.

SECURITY LIMITS
- This moves the Supabase connection settings out of the HTML and routes product reads through a Cloudflare Pages Function. The API endpoint remains public because the storefront must display public active products; scraping is still possible.
- Supabase publishable/anon keys are designed for public clients, not secrets. Never expose service_role keys.
- HTML, CSS, browser JavaScript, and images sent to visitors remain inspectable/downloadable. Obfuscation is a deterrent, not encryption or a guarantee against copying.
- Keep Supabase RLS enabled and verify public users have only the intended SELECT access to active products.
