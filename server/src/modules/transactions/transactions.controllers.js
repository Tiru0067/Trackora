import sendResponse from "#/utils/response.js";

export const getAllTransactions = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get All Transactions Route" });
};

export const getTransaction = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Get Transaction Route" });
};

export const createTransaction = (req, res) => {
  sendResponse(res, { statusCode: 201, message: "Create Transaction Route" });
};

export const updateTransaction = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Update Transaction Route" });
};

export const deleteTransaction = (req, res) => {
  sendResponse(res, { statusCode: 200, message: "Delete Transaction Route" });
};
