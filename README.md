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

This repository now includes a lightweight proxy server used to communicate
with the Tuya smart‑home API (the cloud service returns malformed CORS
headers which prohibit direct browser access). Before running the frontend,
start the proxy if you plan to work with live device data.

```bash
npm install              # install dependencies (frontend + backend)
npm run start-server     # runs the Express proxy on port 3001
# in a separate shell...
npm run dev               # start Vite frontend
```

By default the frontend is configured via `.env` to use the proxy; set
`VITE_TUYA_USE_PROXY=true` if you wish to enable it.

**Tuya proxy (.env):** A status API-hoz a szervernek `client_id`, `secret` és
opcionálisan `EASY_ACCESS_TOKEN` kell. Ha megadod az `EASY_ACCESS_TOKEN`-t
(Postmanból vagy egy token endpoint hívással kapott érték), a szerver ezt
használja és nem hívja a token endpointot. (`EASY_REFRESH_TOKEN` később
használható lehet token megújításra.)

Finally, open [http://localhost:5173](http://localhost:5173) in your browser.

## License & Credits

Some 3D models used in this project are licensed under CC-BY-4.0. See the `public/models` directory for details and attributions.

---

Visit the live site: [www.pogranyitamas.com](https://www.pogranyitamas.com)
