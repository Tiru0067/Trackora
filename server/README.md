# Trackora Backend (Server)

The backend API and database layer for Trackora. Built with Node.js, Express, and Prisma.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma
- **Auth:** JWT and bcrypt for password hashing
- **Sessions:** HTTP-only cookies

## Features

**Authentication & Security**
- User registration and login endpoints.
- Passwords are encrypted before saving using bcrypt.
- Secure forgot password flows that generate short-lived tokens and send reset emails.

**Email Service**
- Uses Nodemailer to reliably send verification links and password resets.

**Email Verification**
- Rate-limited verification endpoints.
- Uses a 1-minute cooldown between resends and a 24-hour lockout after repeated failures, all tracked securely in the database.

**Error Handling & Validation**
- A centralized error handling middleware to ensure API responses are consistent.
- Uses Zod schemas to strictly validate all incoming data (like currency codes, text inputs, and passwords) before it hits the database.

**Wallets API**
- Full CRUD operations to manage user wallets.
- Uses Prisma transactions to handle complex logic, like automatically removing the "primary" status from an old wallet when a new one is promoted.

**Transactions & Categories**
- RESTful endpoints for tracking income and expenses.
- Custom logic to handle transfers between wallets.
- Cross-currency transfers automatically calculate exchange amounts based on live rates.
- API for fetching and managing transaction categories.

**Currencies & Exchange Rates**
- Integrates with the free Frankfurter API to fetch live exchange rates.
- Includes a simple caching layer to prevent spamming the external API on every request.

**Dashboard Analytics**
- Endpoints to calculate total income, total expenses, and balance over time.
- Aggregates top spending categories for the frontend charts.

## Status

- [x] Auth endpoints (Register, Login, Password Reset)
- [x] Email Verification and Rate Limiting
- [x] Centralized Error Handling and Zod Validation
- [x] Wallets API
- [x] Transaction and Transfer Endpoints
- [x] Category Endpoints
- [x] Currencies and Exchange Rates API
- [x] Dashboard Analytics Endpoints
- [ ] Budgeting Endpoints

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `/server` directory:

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
