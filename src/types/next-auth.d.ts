import "next-auth";
import { DefaultSession } from "next-auth";

// Define the role type explicitly using string literals to match your database
export type UserRole = "user" | "admin";

declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    phoneNumber?: string | null;
    province?: string | null;
    district?: string | null;
    localLevel?: string | null;
    citizenshipNo?: string | null;
    nationalIdNo?: string | null;
    voterIdNo?: string | null;
    image?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: UserRole;
      phoneNumber?: string | null;
      province?: string | null;
      district?: string | null;
      localLevel?: string | null;
      citizenshipNo?: string | null;
      nationalIdNo?: string | null;
      voterIdNo?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// Add this section to ensure the credentials provider is properly typed
declare module "next-auth/providers/credentials" {
  interface CredentialsConfig {
    authorize(credentials: { email: string; password: string }): Promise<{
      id: string;
      name: string | null;
      email: string;
      role: UserRole;
    } | null>;
  }
}
