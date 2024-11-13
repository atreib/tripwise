"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon } from "lucide-react";
import { sendFeedbackAction } from "./actions";

const formSchema = z.object({
  message: z.string().min(2).max(500),
});

export function FeedbackForm() {
  const { toast } = useToast();
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (status === "loading") return;

    setStatus("loading");
    try {
      const res = await sendFeedbackAction({ message: values.message });
      if (res?.serverError || !res?.data)
        throw new Error(
          res?.serverError ??
            "Could not submit your feedback in the moment, please try again later."
        );
      form.reset();
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (err) {
      form.setError("root", {
        message:
          err instanceof Error
            ? err.message
            : "Could not submit your feedback in the moment, please try again later.",
      });
    } finally {
      setStatus("idle");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">
                Leave your message
              </FormLabel>
              <FormControl>
                <Textarea minLength={2} maxLength={500} rows={4} {...field} />
              </FormControl>
              <FormDescription>
                Tell us what you think about your experience with our product so
                far.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <Button disabled={status === "loading"} type="submit">
          {status === "loading" ? (
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  );
}
