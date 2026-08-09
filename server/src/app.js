import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import authRoutes from "#/modules/auth/auth.routes.js";
import dashboardRoutes from "#/modules/dashboard/dashboard.routes.js";
import walletsroutes from "#/modules/wallets/wallets.routes.js";
import categoriesRoutes from "#/modules/categories/categories.routes.js";
import transactionsRoutes from "#/modules/transactions/transactions.routes.js";
import { currenciesRouter, exchangeRatesRouter } from "#/modules/currencies/currencies.routes.js";

import errorHandler from "#/middlewares/errorHandler.js";
import notFound from "#/middlewares/notFound.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/wallets", walletsroutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/currencies", currenciesRouter);
app.use("/api/exchange-rates", exchangeRatesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
