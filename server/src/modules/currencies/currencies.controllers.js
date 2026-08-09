import asyncHandler from "#/utils/asyncHandler.js";
import sendResponse from "#/utils/response.js";
import {
  getCurrenciesService,
  getExchangeRatesService,
} from "./currencies.services.js";

export const getCurrencies = asyncHandler(async (req, res) => {
  const currencies = await getCurrenciesService();

  sendResponse(res, {
    statusCode: 200,
    message: "Currencies fetched successfully",
    data: currencies,
  });
});

export const getExchangeRates = asyncHandler(async (req, res) => {
  const exchangeRates = await getExchangeRatesService();

  sendResponse(res, {
    statusCode: 200,
    message: "Exchange rates fetched successfully",
    data: exchangeRates,
  });
});
