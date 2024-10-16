import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "../components/auth/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <RegisterForm />
    </AuthLayout>
  );
};
