# Rider Tracker (Next.js + MongoDB + Tailwind) — Netlify ready
1. `cp .env.example .env.local` aur values bharein
2. `npm install && npm run dev`
3. Deploy: GitHub push -> Netlify "Import project" -> Environment variables: MONGODB_URI, APP_PASSWORD, AUTH_SECRET
4. MongoDB Atlas -> Network Access -> 0.0.0.0/0 allow (Netlify ke IPs fixed nahi hote)
