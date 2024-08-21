import express from "express";
import { GetUserLazyLoading } from "./controller";

const router = express.Router();

router.get("/api/user", GetUserLazyLoading);

export default router;
