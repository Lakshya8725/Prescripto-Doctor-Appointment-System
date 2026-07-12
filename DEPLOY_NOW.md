# Deploy Prescripto — 15 Minute Checklist

**Repo (latest code pushed):** https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System

---

## Step 1 — MongoDB Atlas (required)

1. Go to https://cloud.mongodb.com → Create free cluster
2. **Database Access** → Add user + password
3. **Network Access** → Add IP `0.0.0.0/0`
4. **Connect** → Drivers → Copy URI:
   ```
   mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net
   ```
   (No `/prescripto` at the end)

---

## Step 2 — Backend on Render

**[Click: Deploy on Render](https://render.com/deploy?repo=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System)**

Fill these env vars:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your Atlas URI |
| `JWT_SECRET` | Any long random string |
| `ADMIN_EMAIL` | `admin@priscripto.com` |
| `ADMIN_PASSWORD` | `qwerty123` (change in prod) |
| `CLOUDINARY_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_SECRET_KEY` | From Cloudinary |
| `RAZORPAY_KEY_ID` | From Razorpay |
| `RAZORPAY_KEY_SECRET` | From Razorpay |
| `FRONTEND_URL` | Leave empty for now |
| `ADMIN_URL` | Leave empty for now |

Wait for deploy → copy URL e.g. `https://prescripto-api.onrender.com`

Test: `https://YOUR-URL.onrender.com/health`

---

## Step 3 — Patient frontend on Vercel

**[Click: Deploy Frontend](https://vercel.com/new/clone?repository-url=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System&root-directory=frontend&project-name=prescripto-frontend)**

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Framework | Vite |

**Environment variables:**

| Name | Value |
|------|-------|
| `VITE_BACKEND_URL` | `https://YOUR-RENDER-URL.onrender.com` |
| `VITE_RAZORPAY_KEY_ID` | Same as Razorpay key |

Deploy → copy URL e.g. `https://prescripto-frontend.vercel.app`

---

## Step 4 — Admin panel on Vercel

**[Click: Deploy Admin](https://vercel.com/new/clone?repository-url=https://github.com/Lakshya8725/Prescripto-Doctor-Appointment-System&root-directory=admin&project-name=prescripto-admin)**

| Setting | Value |
|---------|-------|
| Root Directory | `admin` |

**Environment variable:**

| Name | Value |
|------|-------|
| `VITE_BACKEND_URL` | `https://YOUR-RENDER-URL.onrender.com` |

Deploy → copy URL e.g. `https://prescripto-admin.vercel.app`

---

## Step 5 — Set CORS on Render

Render dashboard → `prescripto-api` → **Environment**:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | Your Vercel patient URL (no trailing slash) |
| `ADMIN_URL` | Your Vercel admin URL (no trailing slash) |

Click **Manual Deploy** → Redeploy.

---

## Step 6 — Verify

- [ ] `https://YOUR-RENDER-URL.onrender.com/health` → success
- [ ] Patient site loads doctors
- [ ] Admin login works
- [ ] Add doctor → shows on patient site
- [ ] Book + pay flow works

---

## Optional — Real email OTP on production

Add on Render:

| Key | Value |
|-----|-------|
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password |

Without these, OTP shows in dev mode only.
