import express from "express";
import { GetUserDatabase } from "./controller";

const router = express.Router();

router.get("/api/user", GetUserDatabase);

export default router;
