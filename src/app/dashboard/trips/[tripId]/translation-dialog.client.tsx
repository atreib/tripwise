"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trip } from "@/lib/trips-service/types";
import { LanguagesIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateTextAction } from "./actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  text: z.string().min(1).max(200),
});

type Props = {
  tripDestination: Trip["destination"];
};

export function TranslationDialog({
  children,
  tripDestination,
}: React.PropsWithChildren<Props>) {
  const [translation, setTranslation] = useState<string>();
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (status === "loading") return;
    const text = values.text;
    try {
      setStatus("loading");
      const res = await translateTextAction({
        destination: tripDestination,
        text: text,
      });
      if (res?.serverError || !res?.data)
        throw new Error(res?.serverError ?? "Whoops, something happened");
      setTranslation(res.data);
    } catch (err) {
      form.setError("root", {
        message:
          err instanceof Error ? err.message : "Whoops, something happened",
      });
    } finally {
      setStatus("idle");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translator</DialogTitle>
          {form.formState.errors.root?.message ? (
            <aside className="mt-4">
              <p className="text-red-500">
                {form.formState.errors.root.message}
              </p>
            </aside>
          ) : null}
        </DialogHeader>
        <section className="flex flex-col gap-4">
          <div className="flex gap-2 items-start justify-start mt-2">
            <div>
              <LanguagesIcon
                className={cn(
                  "h-6 w-6 text-muted-foreground",
                  status === "loading" && "animate-pulse"
                )}
              />
            </div>
            <div className="text-pretty ml-2">
              {status === "loading" ? (
                <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
              ) : translation ? (
                <>{translation}</>
              ) : (
                <span className="text-muted-foreground animate-pulse">
                  Waiting
                </span>
              )}
            </div>
          </div>
          <div>
            <Form {...form}>
              <form
                id="translation-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you want to translate?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write here and we will translate it for you"
                          rows={4}
                          minLength={1}
                          maxLength={200}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Our translator can translate messages from your language
                        to the destination&apos;s language, or from the
                        destination&apos;s language to your language. You can
                        freely switch between languages and we will translate it
                        for you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </section>
        <DialogFooter className="flex flex-col-reverse gap-4 md:flex-row md:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button
            form="translation-form"
            type="submit"
            variant="default"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Translate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
