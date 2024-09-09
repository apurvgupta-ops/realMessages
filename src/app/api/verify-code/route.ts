import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Get data from the body;
    const { username, code } = await request.json();

    const decodeUserName = decodeURIComponent(username);

    const user = await UserModel.findOne({
      userName: decodeUserName,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode == code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verification successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code is expired , please sign up again to get code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in verify code", error);
    return Response.json(
      {
        success: false,
        message: "Erron in verify code",
      },
      {
        status: 500,
      }
    );
  }
}
