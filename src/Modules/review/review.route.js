import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.get("/product/:product_id", reviewController.getProductReviews);

router.post("/", authentication, reviewController.addReview);
router.put("/:id", authentication, reviewController.updateReview);
router.delete("/:id", authentication, reviewController.deleteReview);

export default router;
