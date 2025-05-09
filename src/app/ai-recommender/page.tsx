
import MainLayout from "@/components/layout/main-layout";
import { AIToolRecommenderForm } from "@/components/sections/ai-tool-recommender-form";

export default function AIToolRecommenderPage() {
  return (
    <MainLayout pageTitle="AI Tool Recommender" pageIconName="Lightbulb">
      <div className="max-w-4xl mx-auto">
        <p className="mb-6 text-muted-foreground">
          Enter a prompt or describe your need, and the system will recommend relevant AI tools.
          Each recommendation includes a logo, description, a button to copy your prompt, and a link to the AI tool.
        </p>
        <AIToolRecommenderForm />
      </div>
    </MainLayout>
  );
}
