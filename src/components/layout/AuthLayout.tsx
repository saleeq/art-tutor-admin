import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src={logo} alt="Teachstack" />
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Welcome to Art Tutor
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
        <div className="mt-6 text-center">
          <nav className="space-x-4">
            <Link
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Register
            </Link>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Forgot Password
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};