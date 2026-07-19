# Reflection & Mentorship Notes

## What went well
- **Deterministic Approach:** By strictly avoiding LLMs for the actual price calculation, we ensured that the core value proposition (savings accuracy) is 100% reliable and easy to unit test.
- **Architecture:** Splitting the MERN stack into a clean `client/` and `server/` monorepo allows for distinct deployment pipelines (Vercel + Render).
- **Premium Aesthetics:** Utilizing Tailwind with Framer Motion gave the application a genuine "Product Hunt" feel, escaping the typical "student project" look.

## Areas for Improvement (V2)
- **Database Scaling:** Currently, Audits and Leads are loosely coupled. In V2, we should introduce a full Auth system (e.g., Clerk or Auth0) so users can log in and view historical audits.
- **Dynamic Pricing Sync:** Instead of hardcoding `PRICING_DATA.md` into the codebase logic, we could build an admin dashboard to update tool prices dynamically in the database, allowing the engine to pull real-time rates.
- **Testing:** We achieved the minimum required test coverage for the core engine. Expanding tests to cover frontend components (React Testing Library) and E2E flows (Playwright/Cypress) is essential before a massive public launch.
