# Architecture

This document outlines the technical architecture of the AI Spend Audit SaaS application.

## Overall System Design

The application follows a standard MERN-stack pattern but replaces React/Webpack with React 19/Vite for modern development speed. It is divided into two distinct components:
- `client/`: The frontend Single Page Application (SPA).
- `server/`: The backend REST API.

## Frontend Architecture

- **React 19 & Vite:** Provides fast HMR and modern concurrent rendering features.
- **Routing:** React Router DOM for handling navigation between the landing page, the audit form, and the shareable results page.
- **State Management & Data Fetching:** TanStack Query (React Query) for caching, background updates, and API interactions. Local state is managed via React hooks. `localStorage` is used for form persistence to avoid forcing users to sign up immediately.
- **UI & Styling:** TailwindCSS v3 for utility-first styling, combined with shadcn/ui for accessible, pre-built components. Framer Motion is used for micro-animations to create a premium feel.
- **Form Handling:** React Hook Form + Zod for performant, validated form inputs.

## Backend Architecture

- **Node.js & Express:** Lightweight, robust server handling HTTP requests.
- **TypeScript:** Enforces type safety across controllers, services, and models.
- **MongoDB & Mongoose:** NoSQL database for flexible document storage (Audits, Leads, Summaries).
- **Security:** Helmet for HTTP headers, CORS, and Express Rate Limit to protect public-facing APIs.

## Audit Engine

The core business logic resides on the backend.
- It calculates current spend vs. alternative plans using deterministic, rule-based algorithms.
- It does **not** rely on LLMs for calculations to ensure 100% accuracy and predictability based on the `PRICING_DATA.md` guidelines.

## AI Integration

- **Anthropic API (Claude):** Exclusively used to generate professional, personalized 100-word summaries of the audit results.
- **Fallback Mechanism:** If the API fails or rate-limits, a template-based summary is returned to ensure the user experience is not disrupted.

## Deployment Strategy

- **Frontend:** Deployed to Vercel for Edge caching and global CDN delivery.
- **Backend:** Deployed to Render for seamless Node.js hosting.
- **Database:** Hosted on MongoDB Atlas.
