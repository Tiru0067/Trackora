/**
 * Calculates the income, expense, and balance summary for a wallet
 * @param {Object} wallet - The wallet object to summarize
 * @param {Array} transactions - Full list of transactions across all wallets
 * @returns {{ totalIncome: number, totalExpense: number, totalBalance: number }}
 */
export const getWalletSummary = (wallet, transactions) => {
  if (!wallet) return { totalIncome: 0, totalExpense: 0, totalBalance: 0 };

  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.walletId !== wallet.id) continue;

    if (t.type === "income") {
      totalIncome += Number(t.amount || 0);
    } else if (t.type === "expense") {
      totalExpense += Number(t.amount || 0);
    }
  }

  const totalBalance = Number(wallet.initialBalance || 0) + totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    totalBalance,
  };
};
