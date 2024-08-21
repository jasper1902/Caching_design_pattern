import express from "express";
import { GetUserWriteThrough, PutUserWriteThrough } from "./controller";

const router = express.Router();

router.get("/api/user", GetUserWriteThrough);
router.put("/api/user/:id", PutUserWriteThrough);

export default router;
