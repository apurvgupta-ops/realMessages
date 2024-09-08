import * as React from "react";

interface EmailTemplateProps {
  userName: string;
  otp: string;
}

export default function EmailTemplate({ userName, otp }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {userName}! </h1>
      <p>Your Verification code is {otp}</p>
    </div>
  );
}
