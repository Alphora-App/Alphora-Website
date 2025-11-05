Quick waitlist proxy

Purpose

This minimal Node proxy forwards browser POSTs at /waitlist to your Supabase Edge Function
and adds the required Service Role Authorization header so the browser doesn't need the key.

Security

- The proxy requires the service role key in an environment variable. Do NOT expose this key in
  client-side code or public repos. Deploy the proxy only to a trusted hosting environment.

How to run locally (PowerShell)

```powershell
$env:WAITLIST_TARGET = 'https://zvrsxzkomtdraifgezan.functions.supabase.co/waitlistc'
$env:SERVICE_ROLE = '<your-service-role-key-here>'
node server.js
```

Then point your site to `http://localhost:3000/waitlist` as the waitlist endpoint (temporarily) or
set `window.__WAITLIST_ENDPOINT` in your served HTML:

```html
<script>window.__WAITLIST_ENDPOINT = 'http://localhost:3000/waitlist';</script>
```

Production

Deploy this tiny server to a trusted host (Render, Fly, Heroku, Railway, Vercel Serverless, etc.)
and set the env vars there (WAITLIST_TARGET and SERVICE_ROLE). Then update your live site's
meta tag or inline script so the frontend uses the proxy URL.

Notes

- This proxy intentionally has CORS enabled for browsers. In production, restrict origins as needed.
- If you prefer not to run a proxy, make the Supabase function public in the Supabase dashboard so browsers can POST directly.
