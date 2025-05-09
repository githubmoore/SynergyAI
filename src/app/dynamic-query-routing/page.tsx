
import MainLayout from "@/components/layout/main-layout";
import { DynamicQueryRoutingForm } from "@/components/sections/dynamic-query-routing-form";

export default function DynamicQueryRoutingPage() {
  return (
    <MainLayout pageTitle="Dynamic Query Routing & AI Shortcuts" pageIconName="Route">
      <div className="max-w-4xl mx-auto"> {/* Increased max-width for more space */}
        <p className="mb-6 text-muted-foreground">
          Enter a query and the system will dynamically route it to the most suitable internal open-source AI model.
          Additionally, it will suggest external AI tools that might be helpful for your task, along with direct links and a copy-to-clipboard feature for your prompt.
        </p>
        <DynamicQueryRoutingForm />
      </div>
    </MainLayout>
  );
}
