"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Users, Cpu, Leaf, Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import Image from "next/image";

const mockChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "High-Performance Model",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Energy-Efficient Model",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DashboardContent() {
  const metrics = [
    { title: "Total Queries Processed", value: "1,234", icon: Activity, color: "text-primary" },
    { title: "Active AI Models", value: "8", icon: Users, color: "text-accent" },
    { title: "Avg. Energy Saved", value: "15%", icon: Leaf, color: "text-green-500" },
    { title: "Avg. Precision Gain", value: "+7%", icon: Cpu, color: "text-blue-500" },
  ];

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                Based on system activity
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Model Usage Distribution
            </CardTitle>
            <CardDescription>Monthly usage comparison of model types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={mockChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Image src="https://picsum.photos/40/40" alt="SynergyAI Concept" width={40} height={40} className="rounded-md" data-ai-hint="abstract technology" />
              SynergyAI Core Concepts
            </CardTitle>
             <CardDescription>Visualizing the flow of AI collaboration.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Image 
              src="https://picsum.photos/600/300" 
              alt="AI Collaboration Diagram" 
              width={600} 
              height={300}
              className="rounded-lg object-cover"
              data-ai-hint="neural network"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
