
"use client";

import Image from "next/image";
import type { AIRecommendation } from "@/ai/flows/recommend-ai-shortcuts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  originalQuery: string;
}

export function AIRecommendationCard({ recommendation, originalQuery }: AIRecommendationCardProps) {
  const { toast } = useToast();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(originalQuery)
      .then(() => {
        toast({
          title: "Prompt Copied!",
          description: `The query for "${recommendation.name}" has been copied to your clipboard.`,
        });
      })
      .catch(err => {
        toast({
          title: "Copy Failed",
          description: "Could not copy the prompt to your clipboard.",
          variant: "destructive",
        });
        console.error('Failed to copy prompt: ', err);
      });
  };

  const categoryKeyword = recommendation.taskCategory.split(' ')[0].toLowerCase() || 'ai tool';


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          src={recommendation.logoUrl}
          alt={`${recommendation.name} Logo`}
          width={50}
          height={50}
          className="rounded-md border"
          data-ai-hint={categoryKeyword}
        />
        <div>
          <CardTitle className="text-lg">{recommendation.name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Category: {recommendation.taskCategory}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{recommendation.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center pt-4">
        <Button onClick={handleCopyPrompt} variant="outline" className="w-full sm:w-auto flex-grow">
          <Copy className="mr-2 h-4 w-4" /> Copy Prompt
        </Button>
        <Button asChild variant="default" className="w-full sm:w-auto flex-grow">
          <a href={recommendation.websiteUrl} target="_blank" rel="noopener noreferrer">
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
