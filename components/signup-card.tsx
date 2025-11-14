"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthFlowStore } from "@/store/useAuthFlowStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

type SignupSchema = z.infer<typeof signupSchema>;

export const SignupCard = () => {
  const authFlow = useAuthFlowStore();
  const auth = useAuthStore();
  const router = useRouter();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: SignupSchema) => {
    setServerError(null);

    // Use same base URL pattern as other stores. If you prefer an env var,
    // replace this with NEXT_PUBLIC_API_BASE_URL or import from a central place.
    const BASE_URL = "https://api.duckcross.com";

    try {
      const res = await fetch(`${BASE_URL}/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // If API provides field-level errors, map them to the form fields
        if (data && typeof data === "object") {
          // common shape: { errors: { email: '...' } } or { message: '...' }
          if (data.errors && typeof data.errors === "object") {
            const errors = data.errors as Record<string, string>;
            for (const key of Object.keys(errors) as Array<
              keyof SignupSchema
            >) {
              const msg = String(errors[key as string] ?? "");
              // set field-level error if it matches one of our fields
              form.setError(key, { message: msg });
            }
            return;
          }

          if (data.message) {
            const msg = (data as { message?: unknown }).message;
            setServerError(String(msg ?? ""));
            return;
          }
        }

        setServerError(res.statusText || "Signup failed");
        return;
      }

      // success: automatically log the user in and transition the flow
      try {
        await auth.login(values.email, values.password);
        authFlow.setWelcomeStage("favorites");
        // redirect user to onboarding
        router.push("/onboard");
      } catch (loginErr: unknown) {
        const msg =
          loginErr && typeof loginErr === "object" && "message" in loginErr
            ? String((loginErr as { message?: unknown }).message ?? "")
            : String(loginErr ?? "Login failed");
        setServerError(msg);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: unknown }).message ?? "")
          : String(err ?? "Network error");
      setServerError(message);
    }
  };

  return (
    <Card className="w-full sm:w-[350px]">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => authFlow.setState("login")}>
            Log In
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {serverError && (
            <div className="text-sm text-red-600 mb-2">{serverError}</div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="attila@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          aria-busy={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};
