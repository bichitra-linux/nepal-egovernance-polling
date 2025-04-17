import { UserRole } from "./next-auth";

export interface Poll {
  id: number;
  title: string;
  description: string | null;
  category?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  status?: string;
  user?: {
    name: string | null;
    email: string;
  };
  _count?: {
    votes: number;
  };
}

export interface PollOption {
  id: number;
  pollId: number;
  optionText: string;
  votes: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
