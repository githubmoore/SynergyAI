
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AIRecommendationsQuerySchema, type AIRecommendationsQueryInput } from "@/lib/schemas";
import { recommendAiShortcuts, type RecommendAIShortcutsOutput, type RecommendAIShortcutsInput } from "@/ai/flows/recommend-ai-shortcuts";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIRecommendationCard } from "@/components/common/ai-recommendation-card";

export function AIToolRecommenderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendationsResult, setRecommendationsResult] = useState<RecommendAIShortcutsOutput | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string>("");

  const { toast } = useToast();

  const form = useForm<AIRecommendationsQueryInput>({
    resolver: zodResolver(AIRecommendationsQuerySchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: AIRecommendationsQueryInput) {
    setSubmittedQuery(values.query);
    setIsLoading(true);
    setError(null);
    setRecommendationsResult(null);

    try {
      const recommendationsInput: RecommendAIShortcutsInput = { query: values.query };
      const recommendationsResponse = await recommendAiShortcuts(recommendationsInput);
      setRecommendationsResult(recommendationsResponse);
      if (recommendationsResponse.recommendations.length > 0) {
        toast({ title: "AI Recommendations Ready" });
      } else {
        toast({ title: "No AI Recommendations", description: "No specific AI tools were recommended for this query." });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while fetching recommendations.";
      setError(errorMessage);
      toast({ title: "Recommendations Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Get AI Tool Recommendations</CardTitle>
          <CardDescription>
            Describe your task or paste your prompt below.
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
                    <FormLabel>Your Prompt or Need</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Create a logo for a coffee shop', 'Help me debug this Python code', 'Summarize this article about climate change'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Recommend AI Tools
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-6 shadow-lg">
          <CardHeader><CardTitle>Fetching Recommendations...</CardTitle></CardHeader>
          <CardContent className="flex justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
         <Card className="mt-6 shadow-lg border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error Fetching Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground">{error}</p>
            </CardContent>
         </Card>
      )}

      {recommendationsResult && !isLoading && !error && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Recommended AI Tools</h3>
          {recommendationsResult.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationsResult.recommendations.map((rec, index) => (
                <AIRecommendationCard key={index} recommendation={rec} originalQuery={submittedQuery} />
              ))}
            </div>
          ) : (
            <Card className="mt-6 shadow-md">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No specific AI tools were recommended for your query. Try rephrasing or providing more detail.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
