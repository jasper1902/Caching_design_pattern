import redis, { createClient } from "redis";

export let redisClient: redis.RedisClientType | null = null;

export const initializeRedisClient = async () => {
  const redisUri = process.env.RADIS_URL as string;
  redisClient = createClient({ url: redisUri });
  redisClient.on("error", (err: Error) =>
    console.log("Redis Client Error", err)
  );
  await redisClient.connect();
};
