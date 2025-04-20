"use server";

import { LoginFormValues, RegisterFormValues } from "@/components/auth-form";

export async function loginAction(values: LoginFormValues) {
  try {
    // Import bcrypt and prisma here to avoid issues with server components
    const bcrypt = await import("bcryptjs");
    const { prisma } = await import("@/lib/prisma");
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: values.email },
    });
    
    if (!user) {
      // User not found, return error instead of redirecting
      return { success: false, error: 'invalid_credentials' };
    }
    
    // Verify password
    const isValid = await bcrypt.compare(values.password, user.password);
    
    if (!isValid) {
      // Invalid password, return error instead of redirecting
      return { success: false, error: 'invalid_credentials' };
    }
    
    // Password is valid, return success
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    // Return error instead of redirecting
    return { success: false, error: 'login_failed' };
  }
}

export async function registerAction(values: LoginFormValues | RegisterFormValues) {
  // Type guard to ensure we're working with RegisterFormValues
  if (!('name' in values) || !('confirmPassword' in values) || !('terms' in values)) {
    throw new Error("Invalid form values for registration");
  }
  
  try {
    // Import bcrypt and prisma here to avoid issues with server components
    const bcrypt = await import("bcryptjs");
    const { prisma } = await import("@/lib/prisma");
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
    });
    
    if (existingUser) {
      // Instead of using redirect inside try block, return early
      // and let the redirect happen outside the try/catch
      return { success: false, error: 'email_exists' };
    }
    
    // Hash the password before storing in the database
    const hashedPassword = await bcrypt.default.hash(values.password, 10);

    // Create the user in the database
    await prisma.user.create({
      data: {
        email: values.email,
        password: hashedPassword,
        name: values.name,
      },
    });

    // Return success status instead of redirecting inside try block
    return { success: true };
  } catch (error) {
    // Handle errors during registration
    console.error("Error during registration:", error);
    return { success: false, error: 'registration_failed' };
  }
} 