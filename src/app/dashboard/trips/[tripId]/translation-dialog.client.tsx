"use client";

import debounce from "lodash/debounce";
import { useRef, useState } from "react";
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
import { Trip } from "@/lib/trips-service/types";
import { Textarea } from "@/components/ui/textarea";
import { LanguagesIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateTextAction } from "./actions";

type Props = {
  tripDestination: Trip["destination"];
};

export function TranslationDialog({
  children,
  tripDestination,
}: React.PropsWithChildren<Props>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [translation, setTranslation] = useState<string>();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string>();

  function resetForm() {
    setTranslation(undefined);
    setError(undefined);
  }

  async function handleTranslate() {
    const text = textareaRef.current?.value;
    if (!text || status === "loading") return;
    try {
      resetForm();
      setStatus("loading");
      console.log("text", text);
      const res = await translateTextAction({
        destination: tripDestination,
        text: text,
      });
      if (res?.serverError || !res?.data)
        throw new Error(res?.serverError ?? "Whoops, something happened");
      setTranslation(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Whoops, something happened"
      );
    } finally {
      setStatus("idle");
    }
  }

  const debouncedHandleTranslate = debounce(handleTranslate, 600);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translator</DialogTitle>
          <DialogDescription>
            Write in your own language and get the translation in the local
            language from {tripDestination}
          </DialogDescription>
          {error ? (
            <aside className="mt-4">
              <p className="text-red-500">{error}</p>
            </aside>
          ) : null}
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <div className="text-right">
            <Textarea
              ref={textareaRef}
              maxLength={200}
              rows={4}
              onChange={debouncedHandleTranslate}
            />
            <p className="text-sm text-muted-foreground">Max 200 characters</p>
          </div>

          <div className="flex gap-2 items-start justify-start">
            <div>
              <LanguagesIcon
                className={cn(
                  "h-6 w-6 text-muted-foreground",
                  status === "loading" && "animate-pulse"
                )}
              />
            </div>
            {translation || status === "loading" ? (
              <div className="text-pretty ml-2">
                {status === "loading" ? (
                  <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <>{translation}</>
                )}
              </div>
            ) : null}
          </div>
        </section>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={status === "loading"}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
