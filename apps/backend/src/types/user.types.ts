import { z } from "zod";
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const runTimeUserSchemaSignUp = z.object({
  username: z.string(),
  email: z.string().email("Not a valid email"),
  password: z.string(),
});
const runTimeUserSchemaLogin = z.object({
  username: z.string(),
  password: z.string(),
});
export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
};
export { IUser, runTimeUserSchemaSignUp, runTimeUserSchemaLogin };
