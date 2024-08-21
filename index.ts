import express from "express";
import bodyParser from "body-parser";
import { initializeRedisClient } from "./src/redis/redisClient";
import lazyLoadingRouter from "./src/lazy_loading/route";
import writeBackRouter from "./src/write_back/route";
import writeThroughRouter from "./src/write_through/route";
import databaseRouter from "./src/database/route";
import "./src/cron/userSync";

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.use("/v1", lazyLoadingRouter);
app.use("/v2", writeBackRouter);
app.use("/v3", writeThroughRouter);
app.use("/v4", databaseRouter);

app.listen(PORT, async () => {
  await initializeRedisClient();
  console.log("Server running on port " + PORT);
});
