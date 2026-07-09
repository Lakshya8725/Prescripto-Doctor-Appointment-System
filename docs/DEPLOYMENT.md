# Prescripto Deployment Guide

## Architecture

- **Frontend (patient):** Vercel → `frontend/`
- **Admin panel:** Vercel → `admin/` (optional but recommended)
- **Backend API:** Render → `backend/`

Repo: https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System

---

## 1. Deploy backend on Render

1. Go to [render.com](https://render.com) → **New** → **Blueprint** (or **Web Service**)
2. Connect GitHub repo `Prescripto-Doctor-Appointment-System`
3. If using Blueprint: Render reads `render.yaml` from repo root
4. Set these **secret** env vars in Render dashboard:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas URI (no `/prescripto` suffix — app adds it) |
| `JWT_SECRET` | Random long string |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | Cloudinary secret |
| `RAZORPAY_KEY_ID` | Razorpay key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `FRONTEND_URL` | Vercel patient URL (set after step 2) |
| `ADMIN_URL` | Vercel admin URL (set after step 3) |

5. **MongoDB Atlas:** Network Access → Add IP `0.0.0.0/0` (allow from anywhere)
6. Copy your Render URL: `https://prescripto-api.onrender.com`

---

## 2. Deploy patient frontend on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo
2. Settings:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. Environment variables:

| Name | Value |
|------|-------|
| `VITE_BACKEND_URL` | `https://YOUR-RENDER-URL.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | Same as `RAZORPAY_KEY_ID` |

4. Deploy → copy URL → update `FRONTEND_URL` on Render → redeploy backend

---

## 3. Deploy admin panel on Vercel

1. **New Project** (second Vercel project, same repo)
2. Root Directory: `admin`
3. Env: `VITE_BACKEND_URL` = Render URL
4. Deploy → copy URL → update `ADMIN_URL` on Render → redeploy backend

---

## 4. Verify

- `https://YOUR-RENDER-URL.onrender.com/health` → `{ "success": true }`
- Patient site loads doctors from API
- Login / register works
- Admin panel login works

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Set `FRONTEND_URL` / `ADMIN_URL` on Render exactly (no trailing slash) |
| API slow first request | Render free tier cold start (~30–60s) |
| MongoDB connection failed | Atlas IP whitelist + correct `MONGODB_URI` |
| 404 on refresh | `vercel.json` rewrites already in frontend/admin |
