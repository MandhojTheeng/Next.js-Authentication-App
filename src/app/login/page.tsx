import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  // Check if the user is already authenticated
  const session = await getServerSession(authOptions);

  // If a session exists, redirect to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
