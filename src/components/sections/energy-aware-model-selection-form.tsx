"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnergyAwareModelSelectionSchema, type EnergyAwareModelSelectionInput as FormInput } from "@/lib/schemas";
import { energyAwareModelSelection, type EnergyAwareModelSelectionOutput, type EnergyAwareModelSelectionInput } from "@/ai/flows/energy-aware-model-selection";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIResponseCard } from "@/components/common/ai-response-card";

export function EnergyAwareModelSelectionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnergyAwareModelSelectionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormInput>({
    resolver: zodResolver(EnergyAwareModelSelectionSchema),
    defaultValues: {
      taskDescription: "",
      availableModels: "modelA,modelB,modelC",
    },
  });

  async function onSubmit(values: FormInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const aiInput: EnergyAwareModelSelectionInput = {
        ...values,
        availableModels: values.availableModels.split(",").map(name => name.trim()).filter(name => name),
      };
      const response = await energyAwareModelSelection(aiInput);
      setResult(response);
      toast({ title: "Model Selected Successfully", description: `Selected: ${response.selectedModel}` });
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
          <CardTitle>Select Energy-Efficient Model</CardTitle>
          <CardDescription>
            Input task details to find the most resource-optimal model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Summarize a long document" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableModels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Models (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., modelX,modelY,modelZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Select Model
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AIResponseCard
        title="Model Selection Result"
        isLoading={isLoading}
        error={error}
        data={result}
        renderData={(data) => (
          <>
            <p><strong>Selected Model:</strong> <span className="font-mono p-1 bg-muted rounded-md">{data.selectedModel}</span></p>
            <p><strong>Reason:</strong> {data.reason}</p>
          </>
        )}
      />
    </>
  );
}
