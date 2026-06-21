import sendResponse from "#/utils/response.js";

export const getAllWallets = (req, res) => {
  sendResponse(res, 200, "Get All Wallets Route");
};

export const getWallet = (req, res) => {
  sendResponse(res, 200, "Get Wallet Route");
};

export const createWallet = (req, res) => {
  sendResponse(res, 201, "Create Wallet Route");
};

export const updateWallet = (req, res) => {
  sendResponse(res, 200, "Update Wallet Route");
};

export const deleteWallet = (req, res) => {
  sendResponse(res, 200, "Delete Wallet Route");
};
