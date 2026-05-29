import { Router } from "express";
import {
  getAllCarts,
  getCartById,
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "./cart.controller";

const router = Router();

router.get("/", getAllCarts);
router.get("/user/:userId", getCartByUserId);
router.get("/:id", getCartById);
router.post("/", createCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

router.post("/:id/items", addCartItem);
router.put("/:id/items/:productId", updateCartItem);
router.delete("/:id/items/:productId", removeCartItem);

export default router;
