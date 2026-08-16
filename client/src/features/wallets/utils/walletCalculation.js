/**
 * Calculates the income, expense, and balance summary for a wallet
 * @param {Object} wallet - The wallet object to summarize
 * @param {Array} transactions - Full list of transactions across all wallets
 * @returns {{ totalIncome: number, totalExpense: number, totalBalance: number }}
 */
export const getWalletSummary = (wallet, transactions = []) => {
  if (!wallet) return { totalIncome: 0, totalExpense: 0, totalBalance: 0 };

  // If no transactions are passed, use the backend's pre-computed totalBalance
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      totalBalance: wallet.totalBalance !== undefined ? Number(wallet.totalBalance) : Number(wallet.initialBalance || 0),
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  let netTransfers = 0;

  for (const t of transactions) {
    if (t.walletId !== wallet.id) continue;

    const type = (t.type || "").toUpperCase();
    const amount = Number(t.amount || 0);

    if (type === "INCOME") {
      totalIncome += amount;
    } else if (type === "EXPENSE") {
      totalExpense += amount;
    } else if (type === "TRANSFER") {
      if (t.transferDirection === "IN") netTransfers += amount;
      else if (t.transferDirection === "OUT") netTransfers -= amount;
    }
  }

  const totalBalance = Number(wallet.initialBalance || 0) + totalIncome - totalExpense + netTransfers;

  return {
    totalIncome,
    totalExpense,
    totalBalance,
  };
};
