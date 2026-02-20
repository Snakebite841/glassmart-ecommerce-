# GlassMart E-Commerce Deployment Guide

This guide will walk you through deploying your full-stack React + Node.js/Firebase application. You will host the **Frontend** on Vercel and the **Backend** on Render.

---

## 🏗️ Prerequisites
1. **GitHub Account**: Make sure your codebase (`frontend` and `backend` separately, or as a single monorepo) is pushed to a GitHub repository.
2. **Firebase Account**: Go to the Firebase Console and create a project to get your Service Account credentials.
3. **Paystack Account**: Get your Live API Keys from the Paystack dashboard.
4. **Vercel Account**: Register at [Vercel](https://vercel.com/) for frontend hosting.
5. **Render Account**: Register at [Render](https://render.com/) for backend hosting.

---

## 🛠️ Phase 1: Prepare the Backend (Node.js + Express)
The backend needs a few tweaks to ensure it runs smoothly in a production cloud environment.

1. **Ensure start script exists**
   Open `backend/package.json` and ensure there is a start script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. **Get Firebase Service Account Key**
   - Go to **Firebase Console** -> **Project Settings** -> **Service Accounts**.
   - Click **Generate new private key**. It will download a JSON file.
   - Convert the entire contents of this JSON file into a **Base64 String**. You can use an online tool like [Base64 Encode](https://www.base64encode.org/).
   - You will use this Base64 string as the `FIREBASE_SERVICE_ACCOUNT_BASE64` environment variable in production.

---

## 🚀 Phase 2: Deploy Backend on Render

Render is excellent for hosting Node.js REST APIs for free.

1. Go to your Render Dashboard and create a new **Web Service**.
2. Connect your GitHub repository containing the `backend` code.
3. **Configuration**:
   - **Name**: `glassmart-api` (or your choice)
   - **Root Directory**: `backend` (if you are using a monorepo, specify the subfolder. Otherwise leave blank).
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**: Add your production `.env` variables in the Render dashboard:
   - `PORT`: `5000`
   - `FRONTEND_URL`: (Leave empty for now, you will update this in Phase 4)
   - `JWT_SECRET`: (Create a very secure random string)
   - `PAYSTACK_SECRET_KEY`: (Your Paystack LIVE Secret Key)
   - `PAYSTACK_PUBLIC_KEY`: (Your Paystack LIVE Public Key)
   - `FIREBASE_SERVICE_ACCOUNT_BASE64`: (The Base64 string from Phase 1)
5. Click **Create Web Service**. Wait for the builder to finish. 
6. **Copy the URL of your deployed backend** (e.g., `https://glassmart-api-xxxxx.onrender.com`).

---

## 🎨 Phase 3: Prepare the Frontend (React + Vite)
We need to connect your frontend code to the live backend URL you just generated instead of `localhost`.

1. Open `frontend/src/pages/Home.tsx` (and anywhere else you make fetch calls).
2. Look for the API calls:
   ```javascript
   // Change this:
   fetch(`http://localhost:5000/api/products/${productId}/buy` ...)
   
   // To your new LIVE backend URL:
   fetch(`https://glassmart-api-xxxxx.onrender.com/api/products/${productId}/buy` ...)
   ```
   *(Best Practice: You should ideally put the backend URL inside an environment variable in Vite using `.env.production` containing `VITE_API_URL=https://glassmart-api-xxxxx.onrender.com`)*.

---

## 🌐 Phase 4: Deploy Frontend on Vercel

Vercel provides seamless deployment for Vite/React applications.

1. Go to your Vercel Dashboard and click **Add New... -> Project**.
2. Import your GitHub repository containing the `frontend` code.
3. **Configuration**:
   - **Project Name**: `glassmart-store`
   - **Framework Preset**: Vercel should automatically detect `Vite`.
   - **Root Directory**: `frontend` (if you are in a monorepo structure).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   - If you set up a Vite environment variable for the backend in Phase 3 (e.g., `VITE_API_URL`), paste it here.
5. Click **Deploy**.
6. Wait for Vercel to build your optimized production bundle.
7. **Copy the URL of your deployed frontend** (e.g., `https://glassmart-store.vercel.app`).

---

## 🔒 Phase 5: Final Cross-Origin Security Check
Because of CORS (Cross-Origin Resource Sharing), your backend needs to strictly allow traffic from your newly hosted frontend.

1. Go back to your **Render Dashboard** (Backend deployment).
2. Go to the **Environment** tab of your Web Service.
3. Update or Add the `FRONTEND_URL` variable to exactly match your Vercel URL:
   - `FRONTEND_URL` = `https://glassmart-store.vercel.app`
4. Render will automatically redeploy the backend with the updated headers.

**Congratulations! 🎉 Your premium Glassmorphism E-Commerce store is now live on the internet, communicating flawlessly with a secure Firebase database.**
