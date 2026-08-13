# Trackora

A personal finance web app built from scratch, with a React frontend and a Node/Express backend, structured as a monorepo. I started with authentication rather than features first — auth touches nearly every other part of the app, so I wanted it solid before building on top of it.

## Project Structure

- `/client` — React frontend, built with Vite
- `/server` — Node.js/Express backend, using Prisma

## What's Working So Far

**Authentication & User Flows**

- Registration with hashed passwords (bcrypt)
- Login using HTTP-only cookies for JWT sessions — no tokens sitting in localStorage
- Full forgot password and reset password flow using secure email tokens
- A built-in dark/light mode theme toggle for the auth screens

**Email Verification**

- Token-based verification flow with its own UI
- Resend requests are rate-limited (1-minute cooldown), and repeated failures trigger a 24-hour lockout

**Error Handling & Routing**

- Centralized error handling on the API
- Routes are split between public-only and protected, enforced consistently on both ends

**Backend Architecture & Data**

- Strict input validation using centralized Zod schemas on the Express layer
- Wallets API CRUD complete, featuring smart constraint handling (e.g., automatically demoting the previous primary wallet in a transaction)
- Prisma Schema configured for Wallets, Categories, and historical Transaction currency tracking

**Wallets & Currencies**

- Full frontend UI for managing wallets (create, edit, delete)
- Connected to a live backend API for supported currencies and real exchange rates
- Shows a unified total balance across all your wallets by automatically converting them into your base currency

**Transactions & Categories**

- Full transaction tracking (expenses, incomes, and transfers between wallets)
- Handled tricky stuff like cross-currency transfers (where sending USD and receiving EUR requires custom exchange amounts)
- Premium UI modals to view transaction details, edit them, or delete them safely
- Basic category selection is working for organizing expenses

## Status

- [x] Authentication (registration, login, sessions, password recovery)
- [x] Email verification
- [x] Centralized error handling & route guarding
- [x] Wallets (Backend API & Frontend UI Complete)
- [x] Core transaction tracking (CRUD & Transfers)
- [x] Categories (Basic support)
- [ ] Budgeting
- [ ] Dashboard / analytics

## Getting Started

Setup instructions live in each part's own README:

- [Client](./client/README.md)
- [Server](./server/README.md)
