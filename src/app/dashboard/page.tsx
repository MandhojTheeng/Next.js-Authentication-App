import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Dashboard | TimeMonitor",
  description: "TimeMonitor dashboard",
};

export default async function DashboardPage() {
  // Get the session
  const session = await getServerSession(authOptions);
  
  // If no session exists, redirect to login
  if (!session) {
    redirect("/login");
  }
  
  // Get user name or email to display
  const userName = session.user?.name || session.user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            TimeMonitor
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-medium mb-4">
                Welcome to TimeMonitor, {userName}!
              </h2>
              <p className="text-gray-500">
                You&apos;re now logged in to your TimeMonitor dashboard. Track your time efficiently and boost your productivity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 