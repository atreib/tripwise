"use client";

import { Button } from "@/components/ui/button";
import { expectedToFailAction } from "../actions/break";

export function ExpectedToFailBtn() {
  async function handleExpectedToFail() {
    const result = await expectedToFailAction();
    alert("server action failed: " + JSON.stringify(result));
  }

  return <Button onClick={handleExpectedToFail}>Should not work</Button>;
}
