import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "password must contain 10 characters" }),
});
