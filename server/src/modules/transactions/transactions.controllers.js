import sendResponse from "#/utils/response.js";

export const getAllTransactions = (req, res) => {
  sendResponse(res, 200, "Get All Transactions Route");
};

export const getTransaction = (req, res) => {
  sendResponse(res, 200, "Get Transaction Route");
};

export const createTransaction = (req, res) => {
  sendResponse(res, 201, "Create Transaction Route");
};

export const updateTransaction = (req, res) => {
  sendResponse(res, 200, "Update Transaction Route");
};

export const deleteTransaction = (req, res) => {
  sendResponse(res, 200, "Delete Transaction Route");
};
