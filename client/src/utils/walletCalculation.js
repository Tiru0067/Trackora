export const getWalletSummary = (wallet, transactions) => {
  const walletTransactions = transactions.filter(
    (t) => t.walletId === wallet.id,
  );

  const totalIncome = walletTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = walletTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = wallet.balance + totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    totalBalance,
  };
};
