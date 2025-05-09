
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicQueryRoutingSchema, type DynamicQueryRoutingInput } from "@/lib/schemas";
import { routeQuery, type RouteQueryOutput } from "@/ai/flows/dynamic-query-routing";
import { recommendAiShortcuts, type RecommendAIShortcutsOutput, type RecommendAIShortcutsInput } from "@/ai/flows/recommend-ai-shortcuts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AIResponseCard } from "@/components/common/ai-response-card";
import { AIRecommendationCard } from "@/components/common/ai-recommendation-card";
import { Separator } from "@/components/ui/separator";

export function DynamicQueryRoutingForm() {
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);
  const [routingResult, setRoutingResult] = useState<RouteQueryOutput | null>(null);

  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [recommendationsResult, setRecommendationsResult] = useState<RecommendAIShortcutsOutput | null>(null);
  
  const [submittedQuery, setSubmittedQuery] = useState<string>("");

  const { toast } = useToast();

  const form = useForm<DynamicQueryRoutingInput>({
    resolver: zodResolver(DynamicQueryRoutingSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: DynamicQueryRoutingInput) {
    setSubmittedQuery(values.query);

    // Reset states
    setIsRoutingLoading(true);
    setRoutingError(null);
    setRoutingResult(null);

    setIsRecommendationsLoading(true);
    setRecommendationsError(null);
    setRecommendationsResult(null);

    try {
      // Perform Dynamic Query Routing
      const routingResponse = await routeQuery(values);
      setRoutingResult(routingResponse);
      toast({ title: "Query Routed Successfully", description: `Internal Model: ${routingResponse.model}` });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during query routing.";
      setRoutingError(errorMessage);
      toast({ title: "Routing Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsRoutingLoading(false);
    }

    try {
      // Perform AI Recommendations
      const recommendationsInput: RecommendAIShortcutsInput = { query: values.query };
      const recommendationsResponse = await recommendAiShortcuts(recommendationsInput);
      setRecommendationsResult(recommendationsResponse);
      if (recommendationsResponse.recommendations.length > 0) {
        toast({ title: "AI Recommendations Ready" });
      } else {
         toast({ title: "No Specific AI Recommendations", description: "No specific external AI tools were recommended for this query." });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred while fetching recommendations.";
      setRecommendationsError(errorMessage);
      toast({ title: "Recommendations Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsRecommendationsLoading(false);
    }
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Route Your Query & Get AI Tool Recommendations</CardTitle>
          <CardDescription>
            Submit a query to see which internal AI model is chosen and get recommendations for external AI tools.
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
                      <Input placeholder="e.g., Create an image of a cat astronaut" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isRoutingLoading || isRecommendationsLoading} className="w-full">
                {(isRoutingLoading || isRecommendationsLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Insights
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AIResponseCard
        title="Internal Query Routing Result"
        isLoading={isRoutingLoading}
        error={routingError}
        data={routingResult}
        renderData={(data) => (
          <>
            <p><strong>Selected Internal Model:</strong> <span className="font-mono p-1 bg-muted rounded-md">{data.model}</span></p>
            <p><strong>Reason:</strong> {data.reason}</p>
          </>
        )}
      />

      { (isRecommendationsLoading || recommendationsError || (recommendationsResult && recommendationsResult.recommendations.length > 0)) && <Separator className="my-8" /> }

      {isRecommendationsLoading && (
        <Card className="mt-6 shadow-lg">
          <CardHeader><CardTitle>Recommended AI Tools</CardTitle></CardHeader>
          <CardContent><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></CardContent>
        </Card>
      )}

      {recommendationsError && !isRecommendationsLoading && (
         <AIResponseCard
            title="Recommended AI Tools"
            isLoading={false}
            error={recommendationsError}
            data={null}
            renderData={() => null} // This won't be called
        />
      )}

      {recommendationsResult && !isRecommendationsLoading && !recommendationsError && recommendationsResult.recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Recommended AI Tools & Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendationsResult.recommendations.map((rec, index) => (
              <AIRecommendationCard key={index} recommendation={rec} originalQuery={submittedQuery} />
            ))}
          </div>
        </div>
      )}
       {recommendationsResult && !isRecommendationsLoading && !recommendationsError && recommendationsResult.recommendations.length === 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader><CardTitle>Recommended AI Tools</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No specific external AI tools were recommended for this query.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
