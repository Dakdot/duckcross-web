"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAuthFlowStore } from "@/store/useAuthFlowStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
export const FavoriteStationsCard = () => {
  const authFlow = useAuthFlowStore();
  const auth = useAuthStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type FormValues = z.infer<typeof loginSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      await auth.login(values.email, values.password);
      router.push("/dash");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Saving failed";
      setError(message || "Saving failed");
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full sm:w-[450px]">
      <CardHeader>
        <CardTitle>Let&apos;s get you set up</CardTitle>
        <CardDescription>
          Select which stations and lines you are interested in getting
          notifications for.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {error ? (
              <div className="rounded-md bg-red-50 p-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="attila@example.com"
                        type="email"
                        id="email"
                        {...field}
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
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-4">
            <div className="w-full flex gap-2">
              <Button
                variant={"ghost"}
                className="flex-1"
                onClick={() => router.push("/dash")}
              >
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
