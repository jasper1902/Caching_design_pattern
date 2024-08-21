import express from "express";
import { GetUserWriteBack, PostUserWriteBack } from "./controller";

const router = express.Router();

router.get("/api/user", GetUserWriteBack);
router.post("/api/user", PostUserWriteBack);

export default router;
