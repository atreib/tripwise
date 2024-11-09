"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInAction } from "./actions";
import { Loader2Icon } from "lucide-react";
import { appConstants } from "../constants";

const loginFormSchema = z.object({
  email: z.string().email(),
});

export function LoginForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "sent">(
    "idle"
  );

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setStatus("loading");
    try {
      const res = await signInAction(values);
      if (res?.serverError) throw new Error(res.serverError);
      setStatus("sent");
    } catch (err) {
      const error = err as Error;
      setStatus("idle");
      form.setError("root", { message: error.message });
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center space-y-4">
        <p className="text-primary font-semibold">
          Magic link sent successfully!
        </p>
        <p>Check your email to sign in to {appConstants.APP_NAME}.</p>
        <p className="text-muted-foreground text-sm">
          You can close this page now.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your best email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormDescription>
                We will email you a link to sign in to {appConstants.APP_NAME}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <footer className="flex justify-end">
          <Button disabled={status === "loading"} type="submit">
            {status === "loading" ? (
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Sign in
          </Button>
        </footer>
      </form>
    </Form>
  );
}
