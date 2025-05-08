"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicQueryRoutingSchema, type DynamicQueryRoutingInput } from "@/lib/schemas";
import { routeQuery, type RouteQueryOutput } from "@/ai/flows/dynamic-query-routing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIResponseCard } from "@/components/common/ai-response-card";

export function DynamicQueryRoutingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteQueryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<DynamicQueryRoutingInput>({
    resolver: zodResolver(DynamicQueryRoutingSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: DynamicQueryRoutingInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await routeQuery(values);
      setResult(response);
      toast({ title: "Query Routed Successfully", description: `Model: ${response.model}` });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Route Your Query</CardTitle>
          <CardDescription>
            Submit a query to see which AI model is chosen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Query</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Write a short poem about stars" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Route Query
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AIResponseCard
        title="Routing Result"
        isLoading={isLoading}
        error={error}
        data={result}
        renderData={(data) => (
          <>
            <p><strong>Selected Model:</strong> <span className="font-mono p-1 bg-muted rounded-md">{data.model}</span></p>
            <p><strong>Reason:</strong> {data.reason}</p>
          </>
        )}
      />
    </>
  );
}
