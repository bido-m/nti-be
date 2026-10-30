import { Router } from "express";
import * as brandController from "./brand.controller.js";
import { uploadMedia } from "../../services/uploadMedia.js";
import { authentication } from "../../middleware/auth.middle.js";

const router = Router();

router.get("/", brandController.getAll);
router.get("/:id", brandController.getById);

router.post(
    "/",
    authentication,
    uploadMedia().single("logo"),
    brandController.add
);

router.put(
    "/:id",
    authentication,
    uploadMedia().single("logo"),
    brandController.update
);

router.delete(
    "/:id",
    authentication,
    brandController.remove
);

export default router;
