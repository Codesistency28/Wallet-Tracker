import express from "express";
import { sql } from "./config/db.js";
import cors from "cors"
import rateLimiter from "./middleware/rareLimiter.js";
import transactionRouter from "./routes/transactionRoutes.js";
import { initDB } from "./utils/connectDb.js";
import job from "./config/cron.js";

const app = express();

if (process.env.NODE_ENV==="production") {
  job.start()
}

app.use(express.json());
app.use(cors())
app.use("/api", transactionRouter)


const startServer = ()=>{
  initDB().then(() => {
  app.listen(5000, () => {
    console.log(`Server is up and running on 5000`);
  });
});
}

startServer()


export default app

