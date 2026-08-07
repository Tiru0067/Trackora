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

## Status

- [x] Authentication (registration, login, sessions, password recovery)
- [x] Email verification
- [x] Centralized error handling & route guarding
- [x] Wallets (Backend API Complete)
- [ ] Wallets (Frontend UI)
- [ ] Core transaction tracking
- [ ] Categories & budgeting
- [ ] Dashboard / analytics

## Getting Started

Setup instructions live in each part's own README:

- [Client](./client/README.md)
- [Server](./server/README.md)
