"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Backpack } from "@/lib/backpack-service/types";
import { Loader2Icon } from "lucide-react";
import { deleteBackpackAction } from "./actions";

type Props = {
  backpackId: Backpack["id"];
};

export function RemoveBackpackDialog({
  children,
  backpackId,
}: React.PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();

  async function handleRemoveBackpack() {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const res = await deleteBackpackAction({ id: backpackId });
      if (res?.serverError) throw new Error(res.serverError);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("idle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            backpack and all its items from our servers.
          </DialogDescription>

          {error ? (
            <aside className="mt-4">
              <p className="text-red-500">{error}</p>
            </aside>
          ) : null}
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 md:flex-row md:gap-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={status === "loading"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleRemoveBackpack}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
