# DeceiveNet Auth Deployment Handoff Prompt

You are continuing work in `C:\Users\cmant\OneDrive\Desktop\DeceiveNet`.

Current issue: login/register failed on `https://deceivenet.netlify.app`.

What was found:
- Direct navigation to `https://deceivenet.netlify.app/register` returned Netlify 404, so SPA fallback redirects were missing.
- Navigating from the landing page to register loaded the form, but submitting a throwaway account got stuck on `Creating account...`.
- The frontend had multiple production fallbacks to `http://localhost:3000`, so a Netlify build without `VITE_API_URL` tries to call the visitor's local machine.
- Auth `fetch()` network failures left `loading` stuck because login/register did not reset loading in a catch path.
- Backend auth endpoints compile and work locally when the built server is started with `node dist/index.js`.

Code already changed:
- Added `frontend/src/lib/config.ts` with shared `API_ORIGIN`, `API_BASE_URL`, `getWebSocketUrl()`, and auth network error messages.
- Updated `frontend/src/lib/api.ts`, `frontend/src/lib/auth.tsx`, `frontend/src/lib/useWebSockets.ts`, and `frontend/src/pages/public/ProjectDetailPage.tsx` to use the shared config.
- Fixed login/register loading state on network failures.
- Added Netlify SPA fallback files:
  - `netlify.toml`
  - `frontend/netlify.toml`
  - `frontend/public/_redirects`
- Updated env examples:
  - `frontend/.env.example`
  - `backend/.env.example`
- Cleaned TypeScript-blocking unused imports/locals.

Verification already completed:
- `cd frontend && npm run typecheck` passes.
- `cd frontend && npm run build` passes when run outside the sandbox.
- `cd backend && npm run build` passes.
- Direct backend register/login test passed with a throwaway account:
  - registered email shape: `codex<timestamp>@example.com`
  - register returned a user id
  - login returned a token and role `viewer`

Remaining deployment requirement:
- Netlify must be redeployed with `VITE_API_URL` set to the public HTTPS URL of the deployed backend API, for example `https://your-deceivenet-api.example.com`.
- The backend host must set `CORS_ORIGIN` to include `https://deceivenet.netlify.app` and local dev origins as needed.
- If there is no hosted backend yet, login/register cannot work on Netlify because this repo's backend is an Express server and Netlify is only serving the static frontend.

Next steps:
1. Find or deploy the backend API URL.
2. Set Netlify environment variable `VITE_API_URL=<backend HTTPS origin without /api>`.
3. Set backend environment variable `CORS_ORIGIN=http://localhost:5173,https://deceivenet.netlify.app`.
4. Redeploy both frontend and backend.
5. Verify:
   - `https://deceivenet.netlify.app/register` loads without 404.
   - Register a throwaway account with a 6-8 character password.
   - Confirm it navigates to `/dashboard`.
   - Log out, then log in with the same throwaway account.
   - Confirm `/dashboard` loads again.
