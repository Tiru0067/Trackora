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

## Status

- [x] Auth endpoints (register, login, password recovery/change)
- [x] Email verification + rate limiting
- [x] Centralized error handling
- [ ] Wallet endpoints
- [ ] Transaction endpoints
- [ ] Category endpoints
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
