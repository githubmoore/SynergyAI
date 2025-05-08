"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelfPromptingOptimizationSchema, type SelfPromptingOptimizationInput as FormInput } from "@/lib/schemas";
import { selfPromptingOptimization, type SelfPromptingOptimizationOutput, type SelfPromptingOptimizationInput } from "@/ai/flows/self-prompting-optimization";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIResponseCard } from "@/components/common/ai-response-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function SelfPromptingOptimizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SelfPromptingOptimizationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormInput>({
    resolver: zodResolver(SelfPromptingOptimizationSchema),
    defaultValues: {
      initialPrompt: "",
      modelNames: "creativeModel,generalModel",
      optimizationRounds: 3,
    },
  });

  async function onSubmit(values: FormInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const aiInput: SelfPromptingOptimizationInput = {
        ...values,
        modelNames: values.modelNames.split(",").map(name => name.trim()).filter(name => name),
      };
      const response = await selfPromptingOptimization(aiInput);
      setResult(response);
      toast({ title: "Prompt Optimized Successfully" });
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
          <CardTitle>Optimize Your Prompt</CardTitle>
          <CardDescription>
            Define an initial prompt, models, and rounds for optimization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="initialPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Prompt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Tell me about black holes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Names (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., creativeModel,generalModel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimizationRounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optimization Rounds</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Optimize Prompt
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AIResponseCard
        title="Optimization Result"
        isLoading={isLoading}
        error={error}
        data={result}
        renderData={(data) => (
          <>
            <div className="mb-4">
              <h4 className="font-semibold text-md mb-1">Optimized Prompt:</h4>
              <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{data.optimizedPrompt}</p>
            </div>
            <div>
              <h4 className="font-semibold text-md mb-2">Optimization History:</h4>
              <Accordion type="single" collapsible className="w-full">
                {data.optimizationHistory.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Round {item.round}</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p><strong>Initial Prompt for this round:</strong> <span className="font-mono p-1 bg-secondary rounded-sm text-xs">{item.prompt}</span></p>
                      <p><strong>Feedback:</strong> {item.feedback}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </>
        )}
      />
    </>
  );
}
