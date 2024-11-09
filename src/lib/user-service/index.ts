import "server-only";

import { User } from "./types";

async function getUserByEmail(email: string): Promise<User> {
  return {
    id: "123",
    email,
    name: "John Doe",
  };
}

async function getUserById(id: string): Promise<User | undefined> {
  return {
    id,
    email: "john.doe@example.com",
    name: "John Doe",
  };
}

export function getUserService() {
  return {
    getUserByEmail,
    getUserById,
  };
}
