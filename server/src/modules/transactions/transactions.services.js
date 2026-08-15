import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

// ─── Create Transaction ────────────────────────────────────────────────────────
export const createTransactionService = async (userId, data) => {
  const {
    type,
    amount,
    destinationAmount,
    date,
    title,
    note,
    categoryId,
    walletId,
    fromWalletId,
    toWalletId,
  } = data;

  if (type !== "TRANSFER") {
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId, deletedAt: null },
    });
    if (!wallet) throw new AppError("Wallet not found", 404);

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId, deletedAt: null },
      });
      if (!category) throw new AppError("Category not found", 404);
    }

    return await prisma.transaction.create({
      data: {
        userId,
        walletId,
        categoryId,
        type,
        amount,
        date: new Date(date),
        title,
        note,
      },
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
            color: true,
            deletedAt: true,
          },
        },
        category: {
          select: { id: true, name: true, color: true, icon: true, deletedAt: true },
        },
      },
    });
  }

  const fromWallet = await prisma.wallet.findFirst({
    where: { id: fromWalletId, userId, deletedAt: null },
  });
  const toWallet = await prisma.wallet.findFirst({
    where: { id: toWalletId, userId, deletedAt: null },
  });

  if (!fromWallet || !toWallet)
    throw new AppError("One or both wallets not found", 404);

  if (fromWallet.currency !== toWallet.currency && !destinationAmount) {
    throw new AppError("destinationAmount is required for cross-currency transfers", 400);
  }

  const inAmount = destinationAmount || amount;

  return await prisma.$transaction(async (tx) => {
    const outLeg = await tx.transaction.create({
      data: {
        userId,
        walletId: fromWalletId,
        type: "TRANSFER",
        transferDirection: "OUT",
        amount,
        date: new Date(date),
        title,
        note,
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        walletId: toWalletId,
        type: "TRANSFER",
        transferDirection: "IN",
        amount: inAmount,
        date: new Date(date),
        title,
        note,
        transferId: outLeg.id,
      },
    });

    return await tx.transaction.findUnique({
      where: { id: outLeg.id },
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
            color: true,
            deletedAt: true,
          },
        },
        linkedTransfer: {
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
                currency: true,
                color: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    });
  });
};

// ─── Update Transaction ────────────────────────────────────────────────────────
export const updateTransactionService = async (
  userId,
  transactionId,
  updateData,
) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: { wallet: true },
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.type === "TRANSFER") {
    if (updateData.amount || updateData.categoryId !== undefined) {
      throw new AppError("Cannot edit amount or category of a transfer", 400);
    }

    return await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          title: updateData.title,
          note: updateData.note,
          date: updateData.date ? new Date(updateData.date) : undefined,
        },
      });

      const partnerLegId =
        transaction.transferId || transaction.linkedTransfer?.id;
      if (partnerLegId) {
        await tx.transaction.update({
          where: { id: partnerLegId },
          data: {
            title: updateData.title,
            note: updateData.note,
            date: updateData.date ? new Date(updateData.date) : undefined,
          },
        });
      }

      return await tx.transaction.findUnique({
        where: { id: transaction.id },
        include: {
          wallet: {
            select: {
              id: true,
              name: true,
              currency: true,
              color: true,
              deletedAt: true,
            },
          },
          linkedTransfer: {
            include: {
              wallet: {
                select: {
                  id: true,
                  name: true,
                  currency: true,
                  color: true,
                  deletedAt: true,
                },
              },
            },
          },
        },
      });
    });
  }

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      ...updateData,
      date: updateData.date ? new Date(updateData.date) : undefined,
    },
    include: {
      wallet: {
        select: {
          id: true,
          name: true,
          currency: true,
          color: true,
          deletedAt: true,
        },
      },
      category: {
        select: { id: true, name: true, color: true, icon: true, deletedAt: true },
      },
    },
  });
};

// ─── Delete Transaction ────────────────────────────────────────────────────────
export const deleteTransactionService = async (userId, transactionId) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: { linkedTransfer: true },
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const parentId = transaction.transferId || transaction.id;

  await prisma.transaction.delete({
    where: { id: parentId },
  });

  return { id: transactionId };
};

// ─── Get Transactions ──────────────────────────────────────────────────────────
export const getTransactionsService = async (userId, filters) => {
  const {
    walletId,
    categoryId,
    startDate,
    endDate,
    type,
    search,
    sortBy,
    orderDir,
    limit = 50,
    page = 1,
  } = filters;

  const parsedLimit = Number(limit);
  const parsedPage = Number(page);
  const skip = (parsedPage - 1) * parsedLimit;

  const where = { userId };

  if (walletId) where.walletId = walletId;
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const validSortFields = ["date", "amount"];
  const validOrderDirs = ["asc", "desc"];
  
  const orderByField = validSortFields.includes(sortBy) ? sortBy : "date";
  const orderByDir = validOrderDirs.includes(orderDir?.toLowerCase()) ? orderDir.toLowerCase() : "desc";

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [orderByField]: orderByDir },
      take: parsedLimit,
      skip: skip,
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
            color: true,
            deletedAt: true,
          },
        },
        category: {
          select: { id: true, name: true, color: true, icon: true, deletedAt: true },
        },
        linkedTransfer: {
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
                currency: true,
                color: true,
                deletedAt: true,
              },
            },
          },
        },
        transferLeg: {
          include: {
            wallet: {
              select: {
                id: true,
                name: true,
                currency: true,
                color: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

// ─── Get Transaction Stats ───────────────────────────────────────────────────
export const getTransactionStatsService = async (userId, filters) => {
  const { walletId, categoryId, startDate, endDate, type, search } = filters;

  const where = { userId };
  if (walletId) where.walletId = walletId;
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [totalCount, typeGroups] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.groupBy({
      by: ["type", "transferDirection"],
      where,
      _sum: { amount: true },
    })
  ]);

  let income = 0;
  let expense = 0;

  for (const group of typeGroups) {
    const sum = Number(group._sum.amount || 0);
    if (group.type === "INCOME" || (group.type === "TRANSFER" && group.transferDirection === "IN")) {
      income += sum;
    } else if (group.type === "EXPENSE" || (group.type === "TRANSFER" && group.transferDirection === "OUT")) {
      expense += sum;
    }
  }

  return {
    totalTransactions: totalCount,
    income,
    expense,
    net: income - expense,
  };
};
