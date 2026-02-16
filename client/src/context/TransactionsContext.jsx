import { createContext, useState } from "react";

const TransactionsContext = createContext();
export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      walletId: 1, // Personal
      categoryId: 1, // Groceries
      amount: 1250,
      type: "expense",
      date: "2026-02-14T09:15:00Z",
      description: "Weekly grocery shopping",
    },
    {
      id: 2,
      walletId: 1,
      categoryId: 2, // Food & Dining
      amount: 350,
      type: "expense",
      date: "2026-02-14T19:45:00Z",
      description: "Dinner with friends",
    },
    {
      id: 3,
      walletId: 3, // Freelance (USD)
      categoryId: 10, // Freelance income
      amount: 800,
      type: "income",
      date: "2026-02-13T10:30:00Z",
      description: "Landing page project",
    },
    {
      id: 4,
      walletId: 2, // Savings
      categoryId: 12, // Investment
      amount: 5000,
      type: "income",
      date: "2026-02-12T08:00:00Z",
      description: "Mutual fund returns",
    },
    {
      id: 5,
      walletId: 1,
      categoryId: 4, // Bills & Utilities
      amount: 1800,
      type: "expense",
      date: "2026-02-12T18:40:00Z",
      description: "Electricity bill",
    },
    {
      id: 6,
      walletId: 6, // Business Account (PHP)
      categoryId: 11, // Business Income
      amount: 12000,
      type: "income",
      date: "2026-02-11T09:00:00Z",
      description: "Client payment",
    },
    {
      id: 7,
      walletId: 1,
      categoryId: 3, // Transport
      amount: 450,
      type: "expense",
      date: "2026-02-11T17:20:00Z",
      description: "Fuel",
    },
    {
      id: 8,
      walletId: 5, // Travel Fund (USD)
      categoryId: 5, // Shopping
      amount: 220,
      type: "expense",
      date: "2026-02-10T14:10:00Z",
      description: "Travel backpack",
    },
    {
      id: 9,
      walletId: 1,
      categoryId: 6, // Entertainment
      amount: 600,
      type: "expense",
      date: "2026-02-09T21:00:00Z",
      description: "Movie night",
    },
    {
      id: 10,
      walletId: 2,
      categoryId: 9, // Salary
      amount: 45000,
      type: "income",
      date: "2026-02-01T09:00:00Z",
      description: "Monthly salary",
    },
    {
      id: 11,
      walletId: 1,
      categoryId: 7, // Health
      amount: 900,
      type: "expense",
      date: "2026-01-29T11:15:00Z",
      description: "Doctor consultation",
    },
    {
      id: 12,
      walletId: 1,
      categoryId: 8, // Education
      amount: 2000,
      type: "expense",
      date: "2026-01-28T15:30:00Z",
      description: "Online course subscription",
    },
  ]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export default TransactionsContext;
