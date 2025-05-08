"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollaborativeOutputRefinementSchema, type CollaborativeOutputRefinementInput as FormInput } from "@/lib/schemas";
import { collaborativeOutputRefinement, type CollaborativeOutputRefinementOutput, type CollaborativeOutputRefinementInput } from "@/ai/flows/collaborative-output-refinement";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIResponseCard } from "@/components/common/ai-response-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CollaborativeOutputRefinementForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CollaborativeOutputRefinementOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormInput>({
    resolver: zodResolver(CollaborativeOutputRefinementSchema),
    defaultValues: {
      query: "",
      modelNames: "creativeModel,generalModel,mathematicalModel",
    },
  });

  async function onSubmit(values: FormInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const aiInput: CollaborativeOutputRefinementInput = {
        ...values,
        modelNames: values.modelNames.split(",").map(name => name.trim()).filter(name => name),
      };
      const response = await collaborativeOutputRefinement(aiInput);
      setResult(response);
      toast({ title: "Output Refined Successfully" });
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
          <CardTitle>Refine Output Collaboratively</CardTitle>
          <CardDescription>
            Input query and models for collaborative refinement.
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
                    <FormLabel>Query</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Explain quantum entanglement simply" {...field} />
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
                      <Input placeholder="e.g., modelA,modelB,modelC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refine Output
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AIResponseCard
        title="Refinement Result"
        isLoading={isLoading}
        error={error}
        data={result}
        renderData={(data) => (
          <>
            <div className="mb-4">
              <h4 className="font-semibold text-md mb-1">Refined Output:</h4>
              <p className="p-3 bg-muted rounded-md whitespace-pre-wrap">{data.refinedOutput}</p>
            </div>
            <div>
              <h4 className="font-semibold text-md mb-2">Intermediate Outputs:</h4>
              <Accordion type="single" collapsible className="w-full">
                {data.intermediateOutputs.map((output, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Intermediate Output {index + 1}</AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap p-2 bg-secondary rounded-sm text-xs">
                      {output}
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
