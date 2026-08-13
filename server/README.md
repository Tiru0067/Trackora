# Trackora Backend (Server)

The API and database layer for Trackora, built with Node.js, Express, and Prisma.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Auth:** JWT + bcrypt for password hashing
- **Sessions:** HTTP-only cookies (no tokens in localStorage)

## What's Implemented

**Authentication & Accounts**

- Registration and login endpoints, with passwords hashed via bcrypt
- Password recovery flows (generating secure, short-lived tokens and sending reset emails)
- Password change endpoints for logged-in users

**Email Service**

- Centralized email service using Nodemailer to handle verification links and password resets reliably

**Email Verification**

- Token generation, validation, and resend endpoints
- Cooldowns and lockouts are tracked in the database — 1-minute cooldown between resends, 24-hour lockout after repeated failures — so this survives server restarts instead of living in memory

**Error Handling**

- A custom `AppError` class plus centralized middleware, so error responses (including metadata like cooldown timestamps) come back as consistent, clean JSON instead of ad-hoc error shapes per route

**Validation**

- Fully migrated validation logic to use **Zod** schemas natively within Express middlewares.
- Centralized reusable Zod schemas (e.g., currency codes, hex colors, and extremely strict emoji validation).

**Wallets API**

- Full CRUD operations for managing user wallets.
- Smart `isPrimary` promotion logic utilizing Prisma transactions (promoting a new wallet demotes the old primary automatically).
- Schema ensures no duplicate wallet names per user.

**Transactions & Categories**

- Full CRUD (Create, Read, Update, Delete) endpoints for Transactions
- Special logic for "Transfers" between wallets, linking two transactions together (one money out, one money in)
- Cross-currency transfers recalculate amounts automatically based on the user's destination amount
- Categories API to fetch and manage income/expense labels

**Currencies & Exchange Rates**

- Integrated a free API (Frankfurter) to get live exchange rates and supported currencies
- Built a simple caching layer so we don't spam the external API on every request

## Status

- [x] Auth endpoints (register, login, password recovery/change)
- [x] Email verification + rate limiting
- [x] Centralized error handling & Zod Validation
- [x] Wallets API endpoints
- [x] Transaction endpoints & Transfer logic
- [x] Category endpoints
- [x] Currencies & Exchange rates API
- [ ] Budget / analytics endpoints

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in `/server`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/trackora?schema=public"
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRES_IN="7d"
   NODE_ENV="development"
   ```

3. **Set up the database**

   ```bash
   npx prisma db push
   # or, for tracked migrations:
   npx prisma migrate dev
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
