"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { createTripAction } from "./actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewTripBtn() {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "loading">("idle");

  async function handleClick() {
    if (status === "loading") return;
    setStatus("loading");

    try {
      const res = await createTripAction({
        destination: "Paris, France",
        season: "winter",
        budget: "luxury",
        purpose: "leisure",
        duration: "weeks",
      });
      if (res?.serverError || !res?.data)
        throw new Error(res?.serverError ?? "Whoops, something went wrong");
      await router.push(`/dashboard/trips/${res?.data?.id}`);
    } catch (err) {
      alert("Failed to create trip");
      console.error(err);
      setStatus("idle");
    }
  }

  return (
    <Button disabled={status === "loading"} onClick={handleClick}>
      {status === "loading" ? (
        <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      New Trip
    </Button>
  );
}
