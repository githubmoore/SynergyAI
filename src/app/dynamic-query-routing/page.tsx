
import MainLayout from "@/components/layout/main-layout";
import { DynamicQueryRoutingForm } from "@/components/sections/dynamic-query-routing-form";

export default function DynamicQueryRoutingPage() {
  return (
    <MainLayout pageTitle="Dynamic Query Routing" pageIconName="Route">
      <div className="max-w-2xl mx-auto">
        <p className="mb-6 text-muted-foreground">
          Enter a query and the system will dynamically route it to the most suitable open-source AI model based on its capabilities.
        </p>
        <DynamicQueryRoutingForm />
      </div>
    </MainLayout>
  );
}
