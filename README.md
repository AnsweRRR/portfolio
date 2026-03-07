# Tamás Pogrányi – Portfolio

[![Website](https://img.shields.io/badge/Live%20Site-www.pogranyitamas.com-blue?style=flat-square)](https://www.pogranyitamas.com)

## Overview

This is the personal portfolio of **Tamás Pogrányi**, a Full Stack Developer specializing in React, TypeScript, and .NET. The site showcases my work, skills, and experience, and provides a way to get in touch. I develop web, mobile, and desktop applications, and enjoy learning new technologies.

## Features
- About me and my background
- Work experience and major projects
- Tech stack and skills
- Project portfolio with live demos and source code
- Contact form
- Multilingual support (EN, HU, DE)
- Modern, responsive design

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **State & i18n:** React Context, react-i18next
- **3D/Visuals:** Three.js, @react-three/fiber, @react-three/drei
- **Other:** EmailJS, React Icons

## Getting Started

### Local Development

#### 1. Setup Environment Variables

Copy the example environment file and fill in your actual API keys:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- EmailJS service ID, template ID, and public key
- reCAPTCHA site and secret keys  
- Tuya API credentials (device ID, client ID, secret, access token)

#### 2. Install Dependencies & Run

```bash
npm install              # Install all dependencies

# Option 1: Run frontend + backend together
npm run dev:all          # Starts Express server (port 3001) + Vite dev server (port 5173)

# Option 2: Run separately
npm run start-server     # Start Express proxy on port 3001
npm run dev              # Start Vite frontend on port 5173 (in separate terminal)
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deployment to Vercel

#### 1. Environment Variables in Vercel Dashboard

Go to your Vercel project → **Settings** → **Environment Variables** and add all variables from your `.env` file:

**Important:** Add these environment variables for all environments (Production, Preview, Development):
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_RECAPTCHA_SITE_KEY`
- `VITE_RECAPTCHA_SECRET_KEY`
- `VITE_TUYA_API_BASE_URL`
- `VITE_TUYA_DEVICE_ID`
- `VITE_TUYA_CLIENT_ID`
- `VITE_TUYA_SECRET`
- `EASY_ACCESS_TOKEN` (optional, for faster testing)

**Note:** You don't need to set `VITE_API_BASE_URL` or `VITE_TUYA_USE_PROXY` for Vercel deployments, as the serverless API functions at `/api/*` are automatically used.

#### 2. Deploy

Push to GitHub and Vercel will automatically build and deploy:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

#### 3. Architecture

**Development:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Vite proxy: `/api` → `localhost:3001`

**Production:**
- Frontend + Backend: `https://your-project.vercel.app`
- API endpoints: `https://your-project.vercel.app/api/*`

## License & Credits

Some 3D models used in this project are licensed under CC-BY-4.0. See the `public/models` directory for details and attributions.

---

Visit the live site: [www.pogranyitamas.com](https://www.pogranyitamas.com)
