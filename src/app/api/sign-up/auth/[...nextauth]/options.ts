import UserModel from "@/models/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error(
              "you are not verified with  this email, please verifed before login"
            );
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordMatch) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
