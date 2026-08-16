import { prisma } from "#/config/db.js";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const formatDate = (date) =>
  `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}`;

export const getDashboardDataService = async (userId, range = "30d") => {
  const now = new Date();

  let days = 30;
  if (range === "7d") days = 7;
  else if (range === "90d") days = 90;

  const startDate = new Date();
  startDate.setDate(now.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  // 1. Wallets & Net Worth (across all time to get current balance)
  const wallets = await prisma.wallet.findMany({
    where: { userId, deletedAt: null },
    select: { id: true, initialBalance: true },
  });

  const txGroups = await prisma.transaction.groupBy({
    by: ["walletId", "type", "transferDirection"],
    where: { userId },
    _sum: { amount: true },
  });

  let totalNetWorth = 0;

  for (const w of wallets) {
    let wBalance = Number(w.initialBalance || 0);
    const relatedTx = txGroups.filter((g) => g.walletId === w.id);
    for (const group of relatedTx) {
      const sum = Number(group._sum.amount || 0);
      if (
        group.type === "INCOME" ||
        (group.type === "TRANSFER" && group.transferDirection === "IN")
      ) {
        wBalance += sum;
      } else if (
        group.type === "EXPENSE" ||
        (group.type === "TRANSFER" && group.transferDirection === "OUT")
      ) {
        wBalance -= sum;
      }
    }
    totalNetWorth += wBalance;
  }

  // 2. Last 30 days stats (Income / Expense)
  const recentStats = await prisma.transaction.groupBy({
    by: ["type", "transferDirection"],
    where: { userId, date: { gte: startDate } },
    _sum: { amount: true },
  });

  let monthlyIncome = 0;
  let monthlyExpense = 0;
  for (const group of recentStats) {
    const sum = Number(group._sum.amount || 0);
    if (
      group.type === "INCOME" ||
      (group.type === "TRANSFER" && group.transferDirection === "IN")
    ) {
      monthlyIncome += sum;
    } else if (
      group.type === "EXPENSE" ||
      (group.type === "TRANSFER" && group.transferDirection === "OUT")
    ) {
      monthlyExpense += sum;
    }
  }

  // 3. Chart Data (Group by date for last 30 days)
  const chartTransactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: startDate } },
    select: { date: true, amount: true, type: true, transferDirection: true },
  });

  const chartDataMap = {};
  for (let i = days - 1; i >= 0; i--) {
    const dDate = new Date();
    dDate.setDate(now.getDate() - i);
    const d = formatDate(dDate);
    chartDataMap[d] = { date: d, income: 0, expense: 0 };
  }

  for (const tx of chartTransactions) {
    const d = formatDate(new Date(tx.date));
    if (!chartDataMap[d]) continue;
    const amount = Number(tx.amount);
    if (
      tx.type === "INCOME" ||
      (tx.type === "TRANSFER" && tx.transferDirection === "IN")
    ) {
      chartDataMap[d].income += amount;
    } else if (
      tx.type === "EXPENSE" ||
      (tx.type === "TRANSFER" && tx.transferDirection === "OUT")
    ) {
      chartDataMap[d].expense += amount;
    }
  }
  const chartData = Object.values(chartDataMap);

  // 4. Category Breakdown (Expenses only)
  const categoryGroups = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      date: { gte: startDate },
      type: "EXPENSE",
      categoryId: { not: null },
    },
    _sum: { amount: true },
  });

  const categoryIds = categoryGroups.map((g) => g.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true, color: true, icon: true },
  });

  const categoryBreakdown = categoryGroups
    .map((group) => {
      const cat = categories.find((c) => c.id === group.categoryId);
      return {
        name: cat ? cat.name : "Unknown",
        color: cat ? cat.color : "#9ca3af",
        icon: cat ? cat.icon : null,
        value: Number(group._sum.amount),
      };
    })
    .sort((a, b) => b.value - a.value);

  // 5. Recent Transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: {
      category: { select: { name: true, icon: true, color: true } },
      wallet: { select: { name: true, currency: true } },
    },
  });

  return {
    netWorth: totalNetWorth,
    monthlyIncome,
    monthlyExpense,
    chartData,
    categoryBreakdown,
    recentTransactions,
  };
};
