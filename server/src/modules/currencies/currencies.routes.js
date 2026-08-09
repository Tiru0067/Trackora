import { Router } from "express";
import { authenticate } from "#/middlewares/authenticate.js";
import {
  getCurrencies,
  getExchangeRates,
} from "./currencies.controllers.js";

export const currenciesRouter = Router();
export const exchangeRatesRouter = Router();

currenciesRouter.use(authenticate);
exchangeRatesRouter.use(authenticate);

currenciesRouter.get("/", getCurrencies);
exchangeRatesRouter.get("/", getExchangeRates);
