import bootstrap from "./src/bootstrap.js";
const app = bootstrap();

export default app;

if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("server is running");
  });
}
