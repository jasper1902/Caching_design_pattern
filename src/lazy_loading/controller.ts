import prisma from "../../prisma/prisma-client";
import { Response, Request } from "express";
import { redisClient } from "../redis/redisClient";

export const GetUserLazyLoading = async (req: Request, res: Response) => {
  if (!redisClient) {
    return res
      .status(500)
      .json({ message: "Database or Cache not initialized" });
  }
  const cachedUsers = await redisClient.get("users-v1");

  if (cachedUsers) {
    const users = JSON.parse(cachedUsers);
    return res.json(users);
  }

  const users = await prisma.users.findMany();
  await redisClient.setEx("users-v1", 60, JSON.stringify(users));
  res.json(users);
};
