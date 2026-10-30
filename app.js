import express from "express";
import cors from "cors";
import { connectDB } from "./src/DB/connection.js";
import { config } from "dotenv";
import * as allRouter from "./src/index.route.js";

config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());
  
  app.use("/", allRouter.healthRouter);
  app.use("/auth",allRouter.authRouter);
  app.use("/brand",allRouter.brandRouter);
  app.use("/cart",allRouter.cartRouter);
  app.use("/category",allRouter.categoryRouter);
  app.use("/order",allRouter.orderRouter);
  app.use("/product",allRouter.productRouter);
  app.use("/review",allRouter.reviewRouter);
  app.use("/subcategory",allRouter.subcategoryRouter);
  app.use("/user",allRouter.userRouter);


  app.use((req, res, next) => {
    next(new Error("Invalid URL"));
  });
  app.use((err, req, res, next) => {
    return res.json({ message: err.message });
  });


  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });