import prisma from "../../prisma/prisma-client";
import { Response, Request } from "express";

export const GetUserDatabase = async (req: Request, res: Response) => {
  const users = await prisma.users.findMany();
  res.json(users);
};
