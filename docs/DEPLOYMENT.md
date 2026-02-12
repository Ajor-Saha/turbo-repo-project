# 🚀 Deployment Guide - Vercel

Step-by-step guide to deploy both API and Web to Vercel.

## ⚠️ CRITICAL: Environment Variables Required

The API **WILL NOT WORK** without these environment variables set in Vercel:

1. **`MASTER_KEY_HEX`** - Your 64-character hex encryption key
   - Example: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
   - Set this in: Vercel Dashboard → Project Settings → Environment Variables

2. **`FRONTEND_URL`** (optional) - Your frontend URL for CORS
   - Example: `https://your-frontend.vercel.app`
   - Default: `http://localhost:3000`

### How to Set Environment Variables in Vercel:
1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add each variable name and value
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**
6. **Redeploy** your project (Deployments → ⋯ → Redeploy)

---

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Account**: Your code must be on GitHub
3. **Vercel CLI** (optional but recommended):
   ```bash
   pnpm add -g vercel
   ```

---

## Step 1: Push to GitHub

```bash
# Initialize git (if not done)
cd /Users/ajorsaha/Desktop/Personal/all-deploy/my-turbo-project
git init

# Add all files
git add .

# Commit
git commit -m "feat: complete secure transactions app with AES-256-GCM encryption"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy API to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Root Directory:** Select `apps/api`
4. **Framework Preset:** Other
5. **Build Command:** `pnpm build` (or leave default)
6. **Output Directory:** `dist`
7. **Install Command:** `pnpm install`

8. **Environment Variables** - Add these:
   ```
   MASTER_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
   PORT=3002
   ```

9. Click **Deploy**

### Option B: Using Vercel CLI

```bash
cd apps/api

# Login to Vercel
vercel login

# Deploy
vercel --prod

# When prompted:
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: secure-transactions-api
# - Directory: ./
# - Override settings: N

# Add environment variable
vercel env add MASTER_KEY_HEX
# Paste: 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
# Environment: Production
```

### Verify API Deployment

```bash
# Test the deployed API
curl https://YOUR_API_URL/health

# Should return:
# {"status":"ok","timestamp":"...","records":0}
```

**Save your API URL!** You'll need it for the frontend.

---

## Step 3: Deploy Web to Vercel

### Option A: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import the **same** GitHub repository
3. **Root Directory:** Select `apps/web`
4. **Framework Preset:** Next.js
5. **Build Command:** Leave default
6. **Output Directory:** Leave default

7. **Environment Variables** - Add:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_API_URL_FROM_STEP2
   ```

8. Click **Deploy**

### Option B: Using Vercel CLI

```bash
cd apps/web

# Login (if not already)
vercel login

# Deploy
vercel --prod

# When prompted:
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: secure-transactions-web
# - Directory: ./
# - Override settings: N

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL
# Paste: https://YOUR_API_URL_FROM_STEP2
# Environment: Production
```

### Verify Web Deployment

Visit your deployed frontend URL in a browser. You should see:
- 🔐 Secure Transactions header
- Input form for Party ID and JSON
- Encrypt & Save button

---

## Step 4: Test End-to-End

1. **Open your deployed frontend** (e.g., https://your-app.vercel.app)

2. **Encrypt a transaction:**
   - Party ID: `party_test`
   - Payload:
     ```json
     {
       "amount": 500,
       "currency": "USD"
     }
     ```
   - Click "Encrypt & Save"

3. **Verify you get a transaction ID**

4. **Click "Decrypt"** to recover the original payload

5. **Check the API directly:**
   ```bash
   curl -X POST https://YOUR_API_URL/tx/encrypt \
     -H "Content-Type: application/json" \
     -d '{"partyId":"party_test","payload":{"amount":100}}'
   ```

---

## Step 5: Update CORS (if needed)

If you get CORS errors, update `apps/api/src/index.ts`:

```typescript
await fastify.register(cors, {
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ]
});
```

Redeploy:
```bash
cd apps/api
git add .
git commit -m "fix: update CORS for production"
git push
# Vercel will auto-deploy
```

---

## 📋 Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] API deployed to Vercel
- [ ] `MASTER_KEY_HEX` environment variable set
- [ ] API health endpoint returns 200 OK
- [ ] Web deployed to Vercel
- [ ] `NEXT_PUBLIC_API_URL` environment variable set
- [ ] Frontend loads without errors
- [ ] Can encrypt a transaction
- [ ] Can decrypt a transaction
- [ ] End-to-end flow works

---

## 🐛 Common Issues

### Issue: "MASTER_KEY_HEX not set"
**Solution:** Add environment variable in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `MASTER_KEY_HEX` with your 64-character hex key
3. Redeploy

### Issue: "CORS error in browser"
**Solution:** Update CORS configuration in API to include your Vercel URL

### Issue: "Build failed - Module not found"
**Solution:** Ensure `pnpm-workspace.yaml` is in the root and workspaces are configured correctly

### Issue: "Cannot find package @repo/crypto"
**Solution:** Vercel needs to build from the monorepo root. Try:
1. Set **Root Directory** to `.` (root)
2. Set **Build Command** to `cd apps/api && pnpm build`
3. Or create a `vercel.json` in the app directory

---

## 🔧 Advanced: Custom Vercel Configuration

Create `apps/api/vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": null,
  "outputDirectory": "dist"
}
```

Create `apps/web/vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install"
}
```

---

## 📝 Your Deployment URLs

After deployment, save these for submission:

- **GitHub Repo:** https://github.com/YOUR_USERNAME/YOUR_REPO
- **API URL:** https://your-api.vercel.app
- **Web URL:** https://your-web.vercel.app

---

## Next Steps

After deployment:
1. **Test everything** thoroughly
2. **Record Loom video** (3-6 minutes)
3. **Fill submission form:** https://forms.gle/YeGkQdRGQCZcKG3g7

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Turborepo + Vercel: https://turbo.build/repo/docs/handbook/deploying-with-vercel
