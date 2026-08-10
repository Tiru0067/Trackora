import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const createWalletService = async (userId, walletData) => {
  const { name, currency, initialBalance, color, icon, isPrimary } = walletData;

  try {
    // Handle transaction for primary wallet constraint
    return await prisma.$transaction(async (tx) => {
      // If this wallet is marked primary, demote any other primary wallet first
      if (isPrimary) {
        await tx.wallet.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        });
      }

      // Create the new wallet safely
      const newWallet = await tx.wallet.create({
        data: {
          userId,
          name,
          currency,
          initialBalance: initialBalance || 0,
          color,
          icon,
          isPrimary: isPrimary || false,
        },
      });

      return newWallet;
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError(
        "A wallet with this name already exists",
        409,
        "DUPLICATE_WALLET_NAME",
      );
    }
    throw err;
  }
};

export const getWalletsService = async (userId) => {
  return await prisma.wallet.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
};

export const getWalletByIdService = async (userId, walletId) => {
  const wallet = await prisma.wallet.findFirst({
    where: { id: walletId, userId, deletedAt: null },
  });

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  const groups = await prisma.transaction.groupBy({
    by: ["type", "transferDirection"],
    where: { walletId },
    _sum: { amount: true },
    _count: { _all: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let transactionCount = 0;
  let netTransfers = 0;

  for (const group of groups) {
    const sum = Number(group._sum.amount || 0);
    const count = group._count._all;

    transactionCount += count;

    if (group.type === "INCOME") {
      totalIncome += sum;
    } else if (group.type === "EXPENSE") {
      totalExpense += sum;
    } else if (group.type === "TRANSFER") {
      if (group.transferDirection === "IN") {
        netTransfers += sum;
      } else if (group.transferDirection === "OUT") {
        netTransfers -= sum;
      }
    }
  }

  const totalBalance =
    Number(wallet.initialBalance || 0) +
    totalIncome -
    totalExpense +
    netTransfers;

  const lastTx = await prisma.transaction.findFirst({
    where: { walletId },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  return {
    ...wallet,
    stats: {
      totalIncome,
      totalExpense,
      totalBalance,
      transactionCount,
      lastTransactionDate: lastTx?.date || null,
    },
  };
};

export const updateWalletService = async (userId, walletId, updateData) => {
  // First, verify the wallet exists
  const wallet = await prisma.wallet.findFirst({
    where: { id: walletId, userId, deletedAt: null },
  });

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  try {
    // Handle transaction if isPrimary is changing to true
    if (updateData.isPrimary === true && !wallet.isPrimary) {
      return await prisma.$transaction(async (tx) => {
        // Demote current primary wallet
        await tx.wallet.updateMany({
          where: { userId, isPrimary: true },
          data: { isPrimary: false },
        });

        // Update and return this wallet as primary
        return await tx.wallet.update({
          where: { id: walletId },
          data: updateData,
        });
      });
    }

    // If isPrimary is false, or not provided, just update normally
    return await prisma.wallet.update({
      where: { id: walletId },
      data: updateData,
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError(
        "A wallet with this name already exists",
        409,
        "DUPLICATE_WALLET_NAME",
      );
    }
    throw err;
  }
};

export const deleteWalletService = async (userId, walletId) => {
  const wallet = await prisma.wallet.findFirst({
    where: { id: walletId, userId, deletedAt: null },
  });

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  // Soft delete
  await prisma.wallet.update({
    where: { id: walletId },
    data: { deletedAt: new Date() },
  });
};
