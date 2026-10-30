import { Router } from "express";
import * as user from "./user.controller.js";
import { authentication } from "../../middleware/auth.middle.js";
import { uploadMedia } from "../../services/uploadMedia.js";

const router = Router();

router.get("/profile", authentication, user.getProfile);

router.patch(
    "/profile/image",
    authentication,
    uploadMedia().single("profile"),
    user.upload
);

router.put("/profile", authentication, user.update);

export default router;
