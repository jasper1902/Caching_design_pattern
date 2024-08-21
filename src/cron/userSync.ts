import cron from "node-cron";
import prisma from "../../prisma/prisma-client";
import { Users } from "@prisma/client";
import { redisClient } from "../redis/redisClient";

cron.schedule("*/5 * * * * *", async () => {
  if (!redisClient) {
    console.log("Database or Cache not initialized");
    return;
  }

  const cachedUsersString = await redisClient.get("users-v3");
  const updatedUserIdsString = (await redisClient.get("updated-user-ids")) || "[]";

  const cachedUsers = cachedUsersString ? JSON.parse(cachedUsersString) : [];
  const updatedUserIds = JSON.parse(updatedUserIdsString);

  if (updatedUserIds.length > 0) {
    for (const userId of updatedUserIds) {
      const user = cachedUsers.find((user: Users) => user.id === userId);
      if (user) {
        const updatedUser = {
          name: user.name,
        };

        const updateResult = await prisma.users.update({
          where: { id: userId },
          data: {
            name: updatedUser.name,
          },
        });

        console.log("User updated in MySQL:", updateResult);
      }
    }
    await redisClient.del("updated-user-ids");
  }
});
