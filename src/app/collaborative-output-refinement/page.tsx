
import MainLayout from "@/components/layout/main-layout";
import { CollaborativeOutputRefinementForm } from "@/components/sections/collaborative-output-refinement-form";

export default function CollaborativeOutputRefinementPage() {
  return (
    <MainLayout pageTitle="Collaborative Output Refinement" pageIconName="UsersRound">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-muted-foreground">
          Submit a query and models to see how they collaboratively review and refine each other's outputs for a better final result.
        </p>
        <CollaborativeOutputRefinementForm />
      </div>
    </MainLayout>
  );
}
