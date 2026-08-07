import { prisma } from "#/config/db.js";
import AppError from "#/utils/AppError.js";

export const createWalletService = async (userId, walletData) => {
  const { name, currency, initialBalance, color, icon, isPrimary } = walletData;

  // Check if wallet with same name already exists for this user
  const existingWallet = await prisma.wallet.findFirst({
    where: { userId, name, deletedAt: null },
  });

  if (existingWallet) {
    throw new AppError("Wallet with this name already exists", 400);
  }

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

  return wallet;
};

export const updateWalletService = async (userId, walletId, updateData) => {
  // First, verify the wallet exists
  const wallet = await prisma.wallet.findFirst({
    where: { id: walletId, userId, deletedAt: null },
  });

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  // If name is being updated, verify it doesn't clash with an existing wallet
  if (updateData.name && updateData.name !== wallet.name) {
    const existingWallet = await prisma.wallet.findFirst({
      where: { userId, name: updateData.name, deletedAt: null },
    });

    if (existingWallet) {
      throw new AppError("Wallet with this name already exists", 400);
    }
  }

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
};

export const deleteWalletService = async (userId, walletId) => {
  const wallet = await prisma.wallet.findFirst({
    where: { id: walletId, userId, deletedAt: null },
  });

  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }

  if (wallet.isPrimary) {
    throw new AppError(
      "Cannot delete your primary wallet. Please set another wallet as primary first.",
      400,
    );
  }

  // Soft delete
  await prisma.wallet.update({
    where: { id: walletId },
    data: { deletedAt: new Date() },
  });
};
