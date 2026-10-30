import { Router } from "express";
import * as subcategory from "./subcategory.controller.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.route("/").post(authentication,subcategory.add).get(subcategory.getAll);
router.route("/:_id")
.get(subcategory.get)
.put(subcategory.update)
.delete(subcategory.remove);

export default router;