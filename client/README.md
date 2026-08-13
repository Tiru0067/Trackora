# Trackora Frontend (Client)

The React frontend for Trackora, built with Vite.

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React

## What's Implemented

**Authentication UI**

- Login and registration forms
- Forgot password and reset password flows
- Global dark/light mode theme toggle for the app

**Email Verification UX**

- Countdown timers for resend cooldowns and lockouts, so the 1-minute/24-hour limits from the backend show up as a live timer instead of a raw error message

**Toast Notifications**

- A small reusable toast system for success/error feedback across the app

**Route Guards**

- `ProtectedRoute` — keeps unauthenticated users out of the dashboard
- `PublicOnlyRoute` — keeps logged-in users off the login/register pages

**Reusable Components**

- `FormField`, `ComboBox`, and `Popover` — built to be extensible rather than one-off

**Wallets & Currencies**

- Full UI for creating, editing, and deleting wallets
- Connected a real-time currency API to get supported currencies
- Cool feature: The Wallet Stats section takes all your different wallets (like USD, EUR, INR) and magically converts them into your base currency to show one single total balance!

**Transactions & Categories**

- Beautiful UI for creating expenses, incomes, and transfers
- Handled cross-currency transfers (e.g. sending money from a USD wallet to an EUR wallet)
- A slick transaction details modal with an Edit and Delete flow
- Basic category dropdowns for expenses

## Status

- [x] Auth UI (login, register, forgot/reset password)
- [x] Email verification UX
- [x] Toast system + route guards
- [x] Wallets UI & Exchange Rates
- [x] Transactions UI
- [x] Categories UI (Basic support)
- [ ] Dashboard / analytics

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` (or `.env.local`) in `/client`:

   ```env
   VITE_API_URL="http://localhost:3000/api"
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.
