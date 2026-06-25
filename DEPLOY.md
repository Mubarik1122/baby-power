# Deploy Baby Power (Vercel + Render + MongoDB Atlas)

Repo: https://github.com/Mubarik1122/baby-power

## Architecture

| Service | Host | URL (example) |
|---------|------|----------------|
| Frontend (Next.js) | [Vercel](https://vercel.com) | `https://babypowers.co.uk` |
| Backend (Express) | [Render](https://render.com) | `https://baby-power-api.onrender.com` |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | Atlas connection string |

---

## Step 1 — MongoDB Atlas

1. Sign in at https://cloud.mongodb.com
2. **Create** → **Database** → **M0 FREE** cluster (any region close to UK).
3. **Database Access** → Add user (username + strong password). Save these — not your Atlas login password.
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
5. **Database** → **Connect** → **Drivers** → copy connection string, e.g.:
   ```
   mongodb+srv://DB_USER:DB_PASS@cluster0.xxxxx.mongodb.net/baby_power?retryWrites=true&w=majority
   ```
   Replace `<password>` with your DB user password. Database name: `baby_power`.

6. **Seed production data** (once, from your Mac):
   ```bash
   cd backend
   # Set MONGODB_URI in .env to your Atlas string, then:
   npm run seed
   ```

---

## Step 2 — Render (Backend API)

1. Sign in at https://render.com with **GitHub** (account `Mubarik1122`).
2. **New** → **Web Service** → connect repo `Mubarik1122/baby-power`.
3. Settings:

   | Field | Value |
   |-------|--------|
   | Name | `baby-power-api` |
   | Root Directory | `backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free (or paid for always-on) |

4. **Environment Variables**:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string (32+ chars) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | `https://babypowers.co.uk` (or your Vercel URL first) |
   | `ADMIN_EMAIL` | `admin@babypower.com` |
   | `ADMIN_PASSWORD` | Strong production password |

5. Deploy. Note your API URL, e.g. `https://baby-power-api.onrender.com`.
6. Test: `https://baby-power-api.onrender.com/api/health`

**Note:** Free Render spins down after inactivity (cold start ~30s). For persistent uploads, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on Render (see README). Without Cloudinary, files in `backend/uploads/` are **not persistent** on free tier.

---

## Step 3 — Vercel (Frontend)

Vercel has **no separate password** — sign in with the same **GitHub** account (`Mubarik1122`).

1. Go to https://vercel.com → **Sign Up** → **Continue with GitHub**.
2. **Add New** → **Project** → import `Mubarik1122/baby-power`.
3. Settings:

   | Field | Value |
   |-------|--------|
   | Framework Preset | Next.js |
   | Root Directory | `frontend` |

4. **Environment Variables**:

   | Key | Value |
   |-----|--------|
   | `NEXT_PUBLIC_API_URL` | `https://baby-power-api.onrender.com/api` |
   | `NEXT_PUBLIC_SITE_URL` | `https://babypowers.co.uk` |

5. **Deploy**.

6. After deploy, update Render `FRONTEND_URL` to your final Vercel/custom domain if it changed.

---

## Step 4 — Custom domain (babypowers.co.uk)

### Vercel (website)
1. Vercel project → **Settings** → **Domains** → add `babypowers.co.uk` and `www.babypowers.co.uk`.
2. In **Namecheap** → **Domain List** → `babypowers.co.uk` → **Advanced DNS**:
   - `A` record `@` → Vercel IP (shown in Vercel)
   - `CNAME` `www` → `cname.vercel-dns.com`

### Optional API subdomain
- `CNAME` `api` → your Render hostname (e.g. `baby-power-api.onrender.com`)
- Then set `NEXT_PUBLIC_API_URL` to `https://api.babypowers.co.uk/api`

---

## Admin login (production)

- URL: `https://babypowers.co.uk/admin/login`
- Email / password: values you set in Render `ADMIN_EMAIL` / `ADMIN_PASSWORD` (run seed after setting Atlas URI).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Empty shop / no products | Run `npm run seed` with Atlas `MONGODB_URI`; check API health URL |
| CORS errors | `FRONTEND_URL` on Render must match exact site URL (no trailing slash) |
| Admin login fails | Re-seed admin user; check JWT_SECRET is set |
| Slow first load | Render free tier cold start — normal |
