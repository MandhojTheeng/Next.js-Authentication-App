"use client";

import { AuthForm, LoginFormValues } from "@/components/auth-form";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get error message based on search params
  let errorMessage = null;
  const errorParam = searchParams.get("error");
  if (errorParam === "email_exists") {
    errorMessage = "This email is already registered. Please log in instead.";
  } else if (errorParam === "registration_failed") {
    errorMessage = "Registration failed. Please try again.";
  } else if (errorParam === "invalid_credentials") {
    errorMessage = "Invalid email or password. Please try again.";
  } else if (errorParam === "login_failed") {
    errorMessage = "Login failed. Please try again.";
  }

  // Get success message if registration was successful
  let successMessage = null;
  const registeredParam = searchParams.get("registered");
  if (registeredParam === "true") {
    successMessage = "Registration successful! Please log in with your credentials.";
  }

  // Handle login using NextAuth
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      
      if (response?.error) {
        router.push("/login?error=invalid_credentials");
      } else {
        // Successfully signed in
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      router.push("/login?error=login_failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {errorMessage && (
            <div className="mt-2 text-center text-red-600">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-2 text-center text-green-600">
              {successMessage}
            </div>
          )}
        </div>
        <AuthForm 
          type="login" 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 