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
import { Loader2Icon, PencilIcon } from "lucide-react";
import { updateBackpackAction } from "../actions";

type Props = {
  backpackId: string;
  currentName: string;
};

export function EditBackpackDialog({ backpackId, currentName }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();
  const [name, setName] = useState(currentName);

  // Reset name when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setName(currentName);
      setError(undefined);
    }
  };

  async function handleUpdateBackpack() {
    if (status !== "idle") return;
    if (!name.trim()) {
      setError("Please enter a backpack name");
      return;
    }

    setStatus("loading");
    try {
      const res = await updateBackpackAction({ id: backpackId, name: name.trim() });
      if (res?.serverError) throw new Error(res.serverError);
      setOpen(false);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("idle");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilIcon className="w-4 h-4" />
          <span className="sr-only">Edit backpack name</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit backpack name</DialogTitle>
          <DialogDescription>
            Change the name of your backpack.
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
                  handleUpdateBackpack();
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
            onClick={handleUpdateBackpack}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
