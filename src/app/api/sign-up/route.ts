import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { sendVerificationEmails } from "@/helpers/verificationEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userName, email, password } = await req.json(); // same as req.body

    const isUserNameVerified = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (isUserNameVerified) {
      return Response.json(
        {
          success: false,
          message: "UserName is already taken",
        },
        { status: 400 }
      );
    }

    const userExistByEmail = await UserModel.findOne({
      email,
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // OTP

    const verificationCodeExpiry = new Date(); // OTP Expiry

    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 1);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userExistByEmail) {
      if (userExistByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already exist",
          },
          {
            status: 400,
          }
        );
      } else {
        userExistByEmail.password = hashedPassword;
        userExistByEmail.verifyCode = verificationCode;
        userExistByEmail.verifyCodeExpiry = verificationCodeExpiry;

        await userExistByEmail.save();
      }
    } else {
      const createNewUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        isVerified: false,
        verifyCodeExpiry: verificationCodeExpiry,
        isAcceptingMessage: true,
        messages: [],
      });

      await createNewUser.save();
    }

    // ? SEND VERIFICATION EMAIL
    const emailResponse = await sendVerificationEmails(
      userName,
      email,
      verificationCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message: "User Registration Successfully, Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("error while register the user", error);
    return Response.json(
      {
        success: false,
        message: "error while register the user",
      },
      {
        status: 500,
      }
    );
  }
}
