# Prescripto Deployment Guide

## Architecture

- **Frontend (patient):** Vercel → `frontend/`
- **Admin panel:** Vercel → `admin/` (optional but recommended)
- **Backend API:** Render → `backend/`

Repo: https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System

---

## Quick deploy (click these)

### Step 1 — Backend on Render (~5 min)

**[Deploy Blueprint on Render](https://render.com/deploy?repo=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System)**

1. Sign in with GitHub → approve access
2. Render reads `render.yaml` automatically
3. Fill in **all secret env vars** when prompted:

| Variable | Where to get it |
|----------|-----------------|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Connect → copy URI (no `/prescripto` suffix) |
| `JWT_SECRET` | Any long random string |
| `ADMIN_EMAIL` | Your admin login email |
| `ADMIN_PASSWORD` | Your admin login password |
| `CLOUDINARY_NAME` | [Cloudinary](https://cloudinary.com) dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard |
| `CLOUDINARY_SECRET_KEY` | Cloudinary dashboard |
| `RAZORPAY_KEY_ID` | [Razorpay](https://dashboard.razorpay.com) test/live keys |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard |
| `FRONTEND_URL` | Leave blank for now — add after Step 2 |
| `ADMIN_URL` | Leave blank for now — add after Step 3 |

4. **MongoDB Atlas:** Network Access → Add IP `0.0.0.0/0`
5. Wait for deploy → copy URL: `https://prescripto-api.onrender.com` (yours may differ)
6. Test: `https://YOUR-RENDER-URL.onrender.com/health` → `{ "success": true }`

---

### Step 2 — Patient frontend on Vercel (~3 min)

**[Deploy frontend on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System&root-directory=frontend&project-name=prescripto-frontend)**

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment variables** (add before deploy):

| Name | Value |
|------|-------|
| `VITE_BACKEND_URL` | `https://YOUR-RENDER-URL.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` |

Deploy → copy URL e.g. `https://prescripto-frontend.vercel.app`

---

### Step 3 — Admin panel on Vercel (~3 min)

**[Deploy admin on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System&root-directory=admin&project-name=prescripto-admin)**

| Setting | Value |
|---------|-------|
| Root Directory | `admin` |
| Env | `VITE_BACKEND_URL` = your Render URL |

Deploy → copy URL e.g. `https://prescripto-admin.vercel.app`

---

### Step 4 — Lock down CORS on Render

Go to Render dashboard → `prescripto-api` → **Environment**:

| Variable | Value |
|----------|-------|
| `FRONTEND_URL` | Your Vercel patient URL (no trailing slash) |
| `ADMIN_URL` | Your Vercel admin URL (no trailing slash) |

Click **Manual Deploy** → Redeploy. CORS is now strict.

---

## Verify

- `https://YOUR-RENDER-URL.onrender.com/health` → `{ "success": true }`
- Patient site loads doctors from API
- Login / register works
- Admin panel login works
- Payment flow works (Razorpay test mode)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Set `FRONTEND_URL` / `ADMIN_URL` on Render exactly (no trailing slash) |
| API slow first request | Render free tier cold start (~30–60s) |
| MongoDB connection failed | Atlas IP whitelist `0.0.0.0/0` + correct `MONGODB_URI` |
| 404 on refresh | `vercel.json` rewrites already in frontend/admin |
| Build fails on Vercel | Confirm Root Directory is `frontend` or `admin`, not repo root |
