
export const PageIconNames = [
  "LayoutDashboard",
  "Route",
  "Sparkles",
  "Zap",
  "UsersRound",
  "AppWindow", // Added for AI Tools page
  "Lightbulb", // Added for AI Recommender page
] as const;
export type PageIconName = typeof PageIconNames[number];
