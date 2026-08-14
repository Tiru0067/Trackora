import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const createCategoryService = async (userId, categoryData) => {
  const { name, color, icon, note } = categoryData;

  try {
    const newCategory = await prisma.category.create({
      data: {
        userId,
        name,
        color,
        icon,
        note,
      },
    });

    return newCategory;
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError(
        "A category with this name already exists",
        409,
        "DUPLICATE_CATEGORY_NAME"
      );
    }
    throw err;
  }
};

export const getCategoriesService = async (userId) => {
  const categories = await prisma.category.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId, categoryId: { not: null } },
    select: {
      categoryId: true,
      amount: true,
      type: true,
      wallet: {
        select: { currency: true },
      },
    },
  });

  const statsMap = {};
  for (const t of transactions) {
    if (!statsMap[t.categoryId]) {
      statsMap[t.categoryId] = {
        transactionCount: 0,
        balancesByCurrency: {},
        incomeByCurrency: {},
        expenseByCurrency: {},
      };
    }
    const catStats = statsMap[t.categoryId];
    catStats.transactionCount++;

    const currency = t.wallet.currency;
    let amt = Number(t.amount || 0);

    if (t.type === "INCOME" || (t.type === "TRANSFER" && t.transferDirection === "IN")) {
      catStats.incomeByCurrency[currency] = (catStats.incomeByCurrency[currency] || 0) + amt;
      catStats.balancesByCurrency[currency] = (catStats.balancesByCurrency[currency] || 0) + amt;
    } else if (t.type === "EXPENSE" || (t.type === "TRANSFER" && t.transferDirection === "OUT")) {
      catStats.expenseByCurrency[currency] = (catStats.expenseByCurrency[currency] || 0) + amt;
      catStats.balancesByCurrency[currency] = (catStats.balancesByCurrency[currency] || 0) - amt;
    }
  }

  return categories.map((c) => ({
    ...c,
    stats: statsMap[c.id] || {
      transactionCount: 0,
      balancesByCurrency: {},
      incomeByCurrency: {},
      expenseByCurrency: {},
    },
  }));
};

export const getCategoryByIdService = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, deletedAt: null },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId, categoryId },
    select: {
      amount: true,
      type: true,
      transferDirection: true,
      wallet: {
        select: { currency: true },
      },
    },
  });

  const stats = {
    transactionCount: 0,
    balancesByCurrency: {},
    incomeByCurrency: {},
    expenseByCurrency: {},
  };

  for (const t of transactions) {
    stats.transactionCount++;
    const currency = t.wallet.currency;
    let amt = Number(t.amount || 0);

    if (t.type === "INCOME" || (t.type === "TRANSFER" && t.transferDirection === "IN")) {
      stats.incomeByCurrency[currency] = (stats.incomeByCurrency[currency] || 0) + amt;
      stats.balancesByCurrency[currency] = (stats.balancesByCurrency[currency] || 0) + amt;
    } else if (t.type === "EXPENSE" || (t.type === "TRANSFER" && t.transferDirection === "OUT")) {
      stats.expenseByCurrency[currency] = (stats.expenseByCurrency[currency] || 0) + amt;
      stats.balancesByCurrency[currency] = (stats.balancesByCurrency[currency] || 0) - amt;
    }
  }

  return { ...category, stats };
};

export const updateCategoryService = async (userId, categoryId, updateData) => {
  // Verify category exists
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, deletedAt: null },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  try {
    return await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError(
        "A category with this name already exists",
        409,
        "DUPLICATE_CATEGORY_NAME"
      );
    }
    throw err;
  }
};

export const deleteCategoryService = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, deletedAt: null },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Soft delete
  await prisma.category.update({
    where: { id: categoryId },
    data: { deletedAt: new Date() },
  });
};
