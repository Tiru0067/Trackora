import sendResponse from "#/utils/response.js";

export const getAllWallets = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get All Wallets Route" });
};

export const getWallet = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get Wallet Route" });
};

export const createWallet = (req, res) => {
  sendResponse(res, { statusCode: 201, message: "Create Wallet Route" });
};

export const updateWallet = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Update Wallet Route" });
};

export const deleteWallet = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Delete Wallet Route" });
};
