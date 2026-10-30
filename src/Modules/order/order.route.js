import { Router } from "express";
import * as orderController from "./order.controller.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.post("/", authentication, orderController.createOrder);
router.get("/my-orders", authentication, orderController.getUserOrders);
router.get("/:id", authentication, orderController.getOrderById);
router.put("/:id/cancel", authentication, orderController.cancelOrder);

router.get("/", authentication, orderController.getAllOrders);
router.put("/:id/status", authentication, orderController.updateOrderStatus);

export default router;
