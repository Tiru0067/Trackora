import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  createWalletService,
  getWalletsService,
  getWalletByIdService,
  updateWalletService,
  deleteWalletService,
} from "./wallets.services.js";

export const getAllWallets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const wallets = await getWalletsService(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Wallets fetched successfully",
    data: wallets,
  });
});

export const getWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const walletId = req.params.id;
  const wallet = await getWalletByIdService(userId, walletId);

  sendResponse(res, {
    statusCode: 200,
    message: "Wallet fetched successfully",
    data: wallet,
  });
});

export const createWallet = asyncHandler(async (req, res) => {
  const { name, currency, initialBalance, color, icon, isPrimary } = req.body;
  const userId = req.user.id;

  const wallet = await createWalletService(userId, {
    name,
    currency,
    initialBalance,
    color,
    icon,
    isPrimary,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Wallet created successfully",
    data: wallet,
  });
});

export const updateWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const walletId = req.params.id;

  const wallet = await updateWalletService(userId, walletId, req.body);

  sendResponse(res, {
    statusCode: 200,
    message: "Wallet updated successfully",
    data: wallet,
  });
});

export const deleteWallet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const walletId = req.params.id;

  await deleteWalletService(userId, walletId);

  sendResponse(res, {
    statusCode: 200,
    message: "Wallet deleted successfully",
  });
});
