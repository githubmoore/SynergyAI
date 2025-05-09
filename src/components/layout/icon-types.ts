
export const PageIconNames = [
  "LayoutDashboard",
  "Route",
  "Sparkles",
  "Zap",
  "UsersRound",
  "AppWindow", // Added for AI Tools page
] as const;
export type PageIconName = typeof PageIconNames[number];
