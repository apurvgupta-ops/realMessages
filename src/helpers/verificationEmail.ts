import { resend } from "@/lib/resend";
import EmailTemplate from "../../emails/email-template";
import { ApiResponse } from "@/helpers/apiResponse";

//  interface  verificationsEmails {
//   email: string;
//   username: string;
//   verifyCode: string;
// }

export async function sendVerificationEmails(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Hello world",
      react: EmailTemplate({ userName, otp: verifyCode }),
    });

    return { success: true, message: "Message send successfully" };
  } catch (error) {
    console.error("error in send emails", error);
    return { success: false, message: "error in send emails" };
  }
}
