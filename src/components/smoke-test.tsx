import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export function SmokeTestDialog({ children }: React.PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pretty soon!</DialogTitle>
          <DialogDescription>
            We are very happy to know you&apos;re interested in this feature!
            However, we&apos;re still working on it, but it&apos;s coming soon!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img
            className="w-full aspect-video"
            src="/assets/we-are-working-on-it.webp"
            alt="We are working on it"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
