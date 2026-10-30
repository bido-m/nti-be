import { Router } from "express";
import * as product from "./product.controller.js";
import { authentication } from "../../middleware/auth.middle.js";
import { uploadMedia } from "../../services/uploadMedia.js";

const router = Router();

router.post("/", authentication, uploadMedia().single("image"), product.add);
router.get("/", product.getAll);
router.put("/:id", product.update);
router.delete("/:id", product.remove);

export default router;
