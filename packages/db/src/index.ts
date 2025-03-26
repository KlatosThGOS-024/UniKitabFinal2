// src/index.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const User = prisma.user;
export { prisma, User };
export default prisma;
