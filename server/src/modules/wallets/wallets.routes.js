import { Router } from "express";
import { authenticate } from "#/middlewares/authenticate.js";
import {
  validateCreateWallet,
  validateUpdateWallet,
} from "./wallets.validators.js";
import {
  getAllWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
} from "./wallets.controllers.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getAllWallets).post(validateCreateWallet, createWallet);

router
  .route("/:id")
  .get(getWallet)
  .patch(validateUpdateWallet, updateWallet)
  .delete(deleteWallet);

export default router;
