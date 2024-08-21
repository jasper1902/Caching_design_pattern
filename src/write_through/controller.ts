import prisma from "../../prisma/prisma-client";
import { Response, Request } from "express";
import { redisClient } from "../redis/redisClient";

export const GetUserWriteThrough = async (req: Request, res: Response) => {
  try {
    if (!redisClient) {
      return res
        .status(500)
        .json({ message: "Database or Cache not initialized" });
    }

    const cachedUsers = await redisClient.get("users-v3");

    if (cachedUsers) {
      const users = JSON.parse(cachedUsers);
      return res.json(users);
    }

    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const PutUserWriteThrough = async (req: Request, res: Response) => {
  try {
    if (!redisClient) {
      return res
        .status(500)
        .json({ message: "Database or Cache not initialized" });
    }

    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    updatedUser.id = userId;

    const cachedUsersString = await redisClient.get("users-v3");
    let cachedUsers = cachedUsersString ? JSON.parse(cachedUsersString) : [];
    const updatedUserIdsString = await redisClient.get("updated-user-ids");
    let updatedUserIds = updatedUserIdsString
      ? JSON.parse(updatedUserIdsString)
      : [];

    const userIndex = cachedUsers.findIndex((user: any) => user.id === userId);
    if (userIndex !== -1) {
      cachedUsers[userIndex] = updatedUser;
      updatedUserIds.push(userId);
      await redisClient.setEx("users-v3", 60, JSON.stringify(cachedUsers));
    } else {
      const allUsers = await prisma.users.findMany();
      const userIndexInDb = allUsers.findIndex((user) => user.id === userId);

      if (userIndexInDb !== -1) {
        allUsers[userIndexInDb] = updatedUser;
        updatedUserIds.push(userId);
        await redisClient.setEx("users-v3", 60, JSON.stringify(allUsers));
      }
    }

    await redisClient.set("updated-user-ids", JSON.stringify(updatedUserIds));
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
