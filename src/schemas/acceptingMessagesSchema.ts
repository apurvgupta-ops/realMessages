import { z } from "zod";

export const accptingMessagesSchema = z.object({
  acceptMessage: z.boolean(),
});
