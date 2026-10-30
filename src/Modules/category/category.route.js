import { Router } from "express";
import * as category from "./category.controller.js";
import { uploadMedia } from "../../services/uploadMedia.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.route("/").post(authentication,uploadMedia().single("image"),category.add).get(category.getAll);
router.route("/:_id")
.get(category.get)
.put(category.update)
.delete(category.remove);

export default router;