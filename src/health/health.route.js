import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;