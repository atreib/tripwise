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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2Icon, BackpackIcon } from "lucide-react";
import {
  createTripBackpackFromBackpackAction,
  createEmptyTripBackpackAction,
} from "./actions";
import type { Backpack } from "@/lib/backpack-service/types";

type Props = {
  tripId: string;
  backpacks: Backpack[];
  isReplacing?: boolean;
};

export function CreateTripBackpackDialog({
  tripId,
  backpacks,
  isReplacing = false,
  children,
}: React.PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>("");

  async function handleCreate() {
    if (status !== "idle") return;
    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    setStatus("loading");
    try {
      if (selectedOption === "empty") {
        const res = await createEmptyTripBackpackAction({ tripId });
        if (res?.serverError) throw new Error(res.serverError);
      } else {
        const res = await createTripBackpackFromBackpackAction({
          tripId,
          backpackId: selectedOption,
        });
        if (res?.serverError) throw new Error(res.serverError);
      }
      setOpen(false);
      setSelectedOption("");
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("idle");
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedOption("");
      setError(undefined);
      setStatus("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <BackpackIcon className="w-4 h-4" />
            {isReplacing ? "Change template" : "Create trip backpack"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isReplacing ? "Change trip backpack template" : "Create trip backpack"}
          </DialogTitle>
          <DialogDescription>
            {isReplacing
              ? "Warning: This will replace your current items. Choose a backpack to clone or start empty."
              : "Choose a backpack to clone or start with an empty list."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="empty" id="empty" />
              <Label htmlFor="empty" className="cursor-pointer">
                Start empty
              </Label>
            </div>
            {backpacks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No backpacks found. You can create one from the Backpacks menu.
              </p>
            ) : (
              backpacks.map((backpack) => (
                <div key={backpack.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={backpack.id} id={backpack.id} />
                  <Label htmlFor={backpack.id} className="cursor-pointer">
                    {backpack.name}
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>

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
            onClick={handleCreate}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isReplacing ? "Replace" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
