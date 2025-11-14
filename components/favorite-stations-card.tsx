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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/store/useDataStore";
import useProfileStore from "@/store/useProfileStore";

type FormValues = {
  stations: string[];
};

const schema = z.object({
  stations: z.array(z.string()).min(1, "Select at least one station"),
});

export const FavoriteStationsCard = () => {
  const router = useRouter();
  const { data: stations, fetchData, fetched } = useDataStore();
  const { profile, saveProfile, loadProfile } = useProfileStore();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Ensure stations are loaded
  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Ensure profile is loaded to preselect existing favorites
  useEffect(() => {
    if (typeof profile === "undefined") {
      void loadProfile();
    }
  }, [profile, loadProfile]);

  const defaultStations = useMemo(
    () => profile?.favoriteStations ?? [],
    [profile?.favoriteStations]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stations: defaultStations },
  });

  // Keep form in sync when profile favorites load later
  useEffect(() => {
    form.reset({ stations: defaultStations });
  }, [defaultStations, form]);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setIsSaving(true);
    try {
      await saveProfile({ favoriteStations: values.stations });
      router.push("/dash");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Saving failed";
      setSubmitError(msg);
      console.error("Save favorite stations failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const sortedStations = useMemo(() => {
    return [...stations].sort((a, b) => a.name.localeCompare(b.name));
  }, [stations]);

  return (
    <Card className="w-full sm:w-[600px]">
      <CardHeader>
        <CardTitle>Let&apos;s get you set up</CardTitle>
        <CardDescription>
          Choose the PATH stations you care about. We&apos;ll notify you about
          delays and alerts.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {submitError ? (
              <div className="rounded-md bg-red-50 p-2 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}

            <FormField
              control={form.control}
              name="stations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred stations</FormLabel>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sortedStations.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        {fetched === 0 ? "Loading..." : "No stations found"}
                      </div>
                    ) : (
                      sortedStations.map((st) => {
                        const checked = field.value?.includes(st.id) ?? false;
                        return (
                          <div
                            key={st.id}
                            className="flex items-center gap-3 rounded-md border p-2 hover:bg-accent"
                          >
                            <input
                              id={`station-${st.id}`}
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([
                                    ...(field.value ?? []),
                                    st.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value ?? []).filter(
                                      (id) => id !== st.id
                                    )
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={`station-${st.id}`}
                              className="cursor-pointer select-none"
                            >
                              {st.name}
                            </Label>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col gap-2 mt-4">
            <div className="w-full flex gap-2">
              <Button
                type="button"
                variant={"ghost"}
                className="flex-1"
                onClick={() => router.push("/dash")}
              >
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
