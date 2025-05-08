"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface AIResponseCardProps<T> {
  title: string;
  description?: string;
  isLoading: boolean;
  error: string | null;
  data: T | null;
  renderData: (data: T) => React.ReactNode;
}

export function AIResponseCard<T>({ title, description, isLoading, error, data, renderData }: AIResponseCardProps<T>) {
  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {data && !isLoading && !error && (
          <div className="space-y-4 text-sm">{renderData(data)}</div>
        )}
      </CardContent>
    </Card>
  );
}
