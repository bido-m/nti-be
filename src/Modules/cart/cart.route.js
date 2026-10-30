import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.use(authentication);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/quantity", cartController.updateQuantity);
router.delete("/product/:product_id", cartController.removeProductFromCart);
router.delete("/clear", cartController.clearCart);

export default router;
