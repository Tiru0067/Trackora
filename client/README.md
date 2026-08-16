# Trackora Frontend (Client)

The frontend for Trackora, a personal finance tracker. Built using React and Vite.

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React and Phosphor Icons

## Features

**Authentication UI**
- Login and registration forms with validation.
- Secure forgot password and reset password flows.
- Built-in dark mode and light mode toggle.

**Email Verification**
- Interactive email verification page with live countdown timers for resend cooldowns to prevent spam.

**User Experience (UX)**
- Global toast notification system to provide success and error feedback.
- Protected routes to prevent unauthorized access to the dashboard and redirect logged-in users away from the login page.
- Smooth loading skeletons that match the exact layout of the page data.

**Wallets & Currencies**
- Complete UI for creating, editing, and deleting wallets.
- Uses a real-time currency API to fetch and display supported currencies.
- Calculates and displays a unified total net worth by automatically converting all wallet balances into a single base currency.

**Transactions & Categories**
- Modal-based forms to add expenses, incomes, and transfers between wallets.
- Supports cross-currency transfers with dynamic exchange rate inputs.
- Users can assign categories to their transactions for better tracking.

**Dashboard Analytics**
- Interactive charts built with Recharts showing income and expense trends over time.
- Displays a breakdown of top spending categories.

**User Settings**
- A dedicated page for users to manage their profile, including their display name and base currency preference.
- Ability to change passwords and toggle the app's light/dark mode.
- A fully functional "Danger Zone" allowing users to permanently delete their account and data.


## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the `/client` directory:

   ```env
   VITE_API_URL="http://localhost:3000/api"
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.
