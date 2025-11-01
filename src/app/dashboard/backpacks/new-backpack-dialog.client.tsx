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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, BackpackIcon } from "lucide-react";
import { createBackpackAction } from "./actions";

export function NewBackpackDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();
  const [name, setName] = useState("");

  async function handleCreateBackpack() {
    if (status !== "idle") return;
    if (!name.trim()) {
      setError("Please enter a backpack name");
      return;
    }

    setStatus("loading");
    try {
      const res = await createBackpackAction({ name: name.trim() });
      if (res?.serverError) throw new Error(res.serverError);
      setOpen(false);
      setName("");
      setError(undefined);
    } catch (err) {
      const error = err as Error;
      if (error.message !== "NEXT_REDIRECT") {
        setError(error.message);
        setStatus("idle");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BackpackIcon className="w-4 h-4" />
          New backpack
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new backpack</DialogTitle>
          <DialogDescription>
            Give your backpack a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Backpack name</Label>
            <Input
              id="name"
              placeholder="e.g., Weekend trip essentials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateBackpack();
                }
              }}
            />
          </div>

          {error ? (
            <aside>
              <p className="text-red-500 text-sm">{error}</p>
            </aside>
          ) : null}
        </div>

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
            onClick={handleCreateBackpack}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create backpack
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
