
import MainLayout from "@/components/layout/main-layout";
import { SelfPromptingOptimizationForm } from "@/components/sections/self-prompting-optimization-form";

export default function SelfPromptingOptimizationPage() {
  return (
    <MainLayout pageTitle="Self-Prompting Optimization" pageIconName="Sparkles">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-muted-foreground">
          Provide an initial prompt and let AI models iteratively improve it based on mutual feedback.
        </p>
        <SelfPromptingOptimizationForm />
      </div>
    </MainLayout>
  );
}
