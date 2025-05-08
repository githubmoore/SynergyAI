
import MainLayout from "@/components/layout/main-layout";
import { EnergyAwareModelSelectionForm } from "@/components/sections/energy-aware-model-selection-form";

export default function EnergyAwareModelSelectionPage() {
  return (
    <MainLayout pageTitle="Energy-Aware Model Selection" pageIconName="Zap">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-muted-foreground">
          Describe a task and provide available models. The system will select the most energy-efficient option.
          It aims to measure "computational cost" and "precision gain" to make informed decisions.
        </p>
        <EnergyAwareModelSelectionForm />
      </div>
    </MainLayout>
  );
}
