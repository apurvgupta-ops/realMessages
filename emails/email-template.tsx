import * as React from "react";

interface EmailTemplateProps {
  userName: string;
  otp: string;
}

export default function EmailTemplate({ userName, otp }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {userName}!</h1>
    </div>
  );
}
