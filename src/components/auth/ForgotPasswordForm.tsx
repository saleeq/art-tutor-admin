// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await resetPassword(email);
      setMessage("Check your email for further instructions");
    } catch (err) {
      setError("Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
      {message && <Alert variant="default">{message}</Alert>}
      {error && <Alert variant="destructive">{error}</Alert>}
    </form>
  );
};
