"use client";

import { AuthForm, RegisterFormValues, LoginFormValues } from "@/components/auth-form";
import { useSearchParams, redirect } from "next/navigation";
import { registerAction } from "@/actions/auth";
import Link from "next/link";

export function RegisterForm() {
  const searchParams = useSearchParams();
  
  // Get error message based on search params
  let errorMessage = null;
  const errorParam = searchParams.get("error");
  if (errorParam === "email_exists") {
    errorMessage = "This email is already registered. Please log in instead.";
  } else if (errorParam === "registration_failed") {
    errorMessage = "Registration failed. Please try again.";
  }

  // Wrap registerAction to handle the response and match the expected type
  const handleSubmit = async (values: RegisterFormValues | LoginFormValues) => {
    const result = await registerAction(values);
    
    if (result.success) {
      redirect("/login?registered=true");
    } else if (result.error === 'email_exists') {
      redirect("/login?error=email_exists");
    } else {
      redirect("/login?error=registration_failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          {errorMessage && (
            <div className="mt-2 text-center text-red-600">
              {errorMessage}
            </div>
          )}
        </div>
        <AuthForm 
          type="register" 
          onSubmit={handleSubmit} 
          isLoading={false} 
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 