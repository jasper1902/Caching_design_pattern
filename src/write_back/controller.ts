import prisma from "../../prisma/prisma-client";
import { Response, Request } from "express";
import { redisClient } from "../redis/redisClient";

export const GetUserWriteBack = async (req: Request, res: Response) => {
  if (!redisClient) {
    return res
      .status(500)
      .json({ message: "Database or Cache not initialized" });
  }

  const cachedUsers = await redisClient.get("users-v2");

  if (cachedUsers) {
    const users = JSON.parse(cachedUsers);
    return res.json(users);
  }

  const users = await prisma.users.findMany();
  res.json(users);
};

export const PostUserWriteBack = async (req: Request, res: Response) => {
  if (!redisClient) {
    return res
      .status(500)
      .json({ message: "Database or Cache not initialized" });
  }

  const newUser = req.body;
  const insertResult = await prisma.users.create({
    data: {
      name: newUser.name,
    },
  });

  const cachedUsers = await redisClient.get("users-v2");

  if (cachedUsers) {
    const users = JSON.parse(cachedUsers);
    users.push(insertResult);
    await redisClient.setEx("users-v2", 60, JSON.stringify(users));
  } else {
    const allUsers = await prisma.users.findMany();
    await redisClient.setEx("users-v2", 60, JSON.stringify(allUsers));
  }

  res.json({ message: "User added successfully", result: insertResult });
};
