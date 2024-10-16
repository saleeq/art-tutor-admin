import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm";

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
