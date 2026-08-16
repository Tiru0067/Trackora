# Trackora

Trackora is a full-stack personal finance web application. It helps users track their income, expenses, and manage multiple wallets in different currencies. The project is built with React on the frontend and Node.js/Express on the backend.

## Project Structure

This project uses a monorepo structure:
- `/client` — React frontend built with Vite and Tailwind CSS.
- `/server` — Node.js and Express backend using Prisma ORM.

## Core Features

**Authentication & Security**
- User registration and login with bcrypt password hashing.
- Secure session management using HTTP-only cookies.
- Forgot password and reset password flows.
- Email verification with rate limiting (1-minute cooldowns) to prevent spam.

**Wallets & Multi-Currency**
- Create, edit, and delete wallets (e.g., Cash, Bank Accounts).
- Connects to a real-time API to fetch live exchange rates.
- Automatically converts balances from different currencies into the user's primary currency to show a total net worth.

**Transactions Tracking**
- Add income, expenses, and transfers between wallets.
- Supports cross-currency transfers (e.g., transferring from a USD wallet to a EUR wallet) with automatic exchange rate calculations.
- Manage and assign categories to transactions.

**Dashboard Analytics**
- Visual charts and graphs showing income and expense trends.
- Displays top spending categories.

## Status

- [x] Authentication and Email Verification
- [x] Multi-Currency Wallets
- [x] Transactions and Transfers
- [x] Categories Management
- [x] Dashboard and Charts
- [ ] Settings Page
- [ ] Budgeting System

## Setup Instructions

Please check the README files in each folder for setup instructions:

- [Client Setup](./client/README.md)
- [Server Setup](./server/README.md)
