import { Router } from "express";
import {
  getAllWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
} from "./wallets.controllers.js";

const router = Router();

router.get("/", getAllWallets);
router
  .route("/:id")
  .get(getWallet)
  .post(createWallet)
  .put(updateWallet)
  .delete(deleteWallet);

export default router;
