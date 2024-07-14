import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().min(6, "password must contain 6 characters"),
});
