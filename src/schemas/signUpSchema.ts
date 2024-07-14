import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Please enter atleast 2 character")
  .max(30, "UserName must be no more then 30 characters");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(6, "password must contain 6 characters"),
});
