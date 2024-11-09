"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "../actions/logout";

export function LogoutBtn() {
  async function handleLogout() {
    return logoutAction();
  }

  return <Button onClick={handleLogout}>Log out</Button>;
}
