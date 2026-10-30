import express from "express";
import { connectDB } from "./DB/connection.js";
import { config } from "dotenv";
import * as allRouter from "./index.route.js";

const bootstrap = () => {
  config();
  const app = express();

  connectDB();
  app.use(express.json());
  
  app.get("/",(req,res) => {
    return res.json({message:"Hello!!!!!!"});
  })
  app.use("/auth",allRouter.authRouter);
  app.use("/user",allRouter.userRouter);
  app.use("/category",allRouter.categoryRouter);
  app.use("/subcategory",allRouter.subcategoryRouter);
  app.use("/product",allRouter.productRouter);


  app.use((req, res, next) => {
    next("Invalid URL");
  });
  app.use((err, req, res, next) => {
    return res.json({ message: err.message });
  });


  app.listen(process.env.PORT, () => {
    console.log("server is running");
  });
};

export default bootstrap;