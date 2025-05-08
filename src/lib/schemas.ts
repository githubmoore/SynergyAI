
import { z } from "zod";

export const DynamicQueryRoutingSchema = z.object({
  query: z.string().min(1, "Query is required."),
});
export type DynamicQueryRoutingInput = z.infer<typeof DynamicQueryRoutingSchema>;

export const SelfPromptingOptimizationSchema = z.object({
  initialPrompt: z.string().min(1, "Initial prompt is required."),
  modelNames: z.string().min(1, "Model names are required (comma-separated)."),
  optimizationRounds: z.coerce.number().int().positive("Optimization rounds must be a positive integer.").min(1).max(10),
});
export type SelfPromptingOptimizationInput = z.infer<typeof SelfPromptingOptimizationSchema>;

export const EnergyAwareModelSelectionSchema = z.object({
  taskDescription: z.string().min(1, "Task description is required."),
  availableModels: z.string().min(1, "Available models are required (comma-separated)."),
});
export type EnergyAwareModelSelectionInput = z.infer<typeof EnergyAwareModelSelectionSchema>;

export const CollaborativeOutputRefinementSchema = z.object({
  query: z.string().min(1, "Query is required."),
  modelNames: z.string().min(1, "Model names are required (comma-separated)."),
});
export type CollaborativeOutputRefinementInput = z.infer<typeof CollaborativeOutputRefinementSchema>;
