import { Router } from "express";
import * as product from "./product.controller.js";

const router = Router();

router.post("/",product.add);
router.get("/",product.getAll);
router.put("/:id",product.update);
router.delete("/:id",product.remove);

export default router;