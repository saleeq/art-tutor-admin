// src/hooks/useAuth.ts
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../utils/firebase";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { API_BASE_URL } from "@/config";

interface ServerAuthResponse {
  message: string;
  status: number;
  access_token: string;
  isNewUser: boolean;
  userEmail: string;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  const [serverToken, setServerToken] = useState<string | null>(
    localStorage.getItem("serverToken")
  );

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  useEffect(() => {
    if (serverToken) {
      localStorage.setItem("serverToken", serverToken);
    } else {
      localStorage.removeItem("serverToken");
    }
  }, [serverToken]);

  const getServerToken = async (
    firebaseUser: User
  ): Promise<ServerAuthResponse> => {
    const firebaseToken = await firebaseUser.getIdToken();
    try {
      const response = await axios.post<ServerAuthResponse>(
        `${API_BASE_URL}users/user-auth/login/`,
        { firebase_token: firebaseToken }
      );
      if (response.data.status === 200) {
        setServerToken(response.data.access_token);
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to get server token");
      }
    } catch (error) {
      console.error("Error getting server token:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<ServerAuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return await getServerToken(userCredential.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<ServerAuthResponse> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return await getServerToken(userCredential.user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setServerToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  return {
    ...context,
    login,
    register,
    logout,
    resetPassword,
    serverToken,
    getServerToken,
  };
};
