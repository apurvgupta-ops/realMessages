import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, "password must contain 6 characters"),
});
