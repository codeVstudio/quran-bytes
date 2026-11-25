# Quran Bytes

A modular React 18 + TypeScript + Vite application for a free, open-source, ad-free Islamic learning platform.

## Tech Stack

- **Framework & Language:** React 18, TypeScript 5, Vite
- **Routing:** React Router DOM v6 (`BrowserRouter`, route guards, lazy secondary routes)
- **State & Networking:** Redux Toolkit, Redux Persist, RTK Query (`RtkQueryService`), Axios (`BaseService` / `ApiService`)
- **Styling & UI:** Tailwind CSS v3 (`@tailwindcss/typography`), editorial CSS design tokens, React Icons
- **Forms & Validation:** Formik + Yup
- **Animations & Motion:** GSAP (`ScrollTrigger` desktop 3D book choreography) + Framer Motion support
- **i18n & Dates:** i18next, `react-i18next`, Day.js
- **Tooling:** ESLint (`@typescript-eslint`), Prettier

## Scripts

```bash
npm install
npm run dev       # Start local Vite dev server
npm run lint      # Run ESLint across src/
npm run build     # Type-check with tsc and build dist/ via Vite
npm run preview   # Preview built dist/
```

## Project Structure

```text
├── .eslintrc.cjs
├── .eslintignore
├── .prettierrc
├── .prettierignore
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── tsconfig.json
├── tsconfig.eslint.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   ├── data/
│   └── img/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── @types/
    ├── assets/
    ├── components/
    │   ├── layouts/
    │   ├── route/
    │   ├── shared/
    │   ├── template/
    │   └── ui/
    ├── configs/
    ├── constants/
    ├── locales/
    ├── services/
    ├── store/
    ├── utils/
    └── views/
        ├── Views.tsx
        ├── home/
        ├── read/
        ├── memorize/
        ├── understand/
        ├── practice/
        ├── vision/
        ├── getInvolved/
        └── pages/
```

## Before Launch

- Connect `#updates-form` and `#contribute-form` (marked `TODO`) to your opt-in mailing/submission endpoint via `src/configs/endpoint.config.ts` and `src/views/getInvolved/api/getInvolvedApi.ts`.
- Verify source editions, translation attributions, and repository URLs.
