import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    // FETCHING QUERY PARAMETERS
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UserNameQuerySchema.safeParse(queryParams);
    console.log({ result });

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            userNameErrors.length > 0
              ? userNameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: "Username is already taken",
      });
    }

    return Response.json({
      success: false,
      message: "username is available",
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
