import type { LanguageModelUsage } from "ai";
// import type { UsageData } from "tokenlens/helpers";

// Server-merged usage: base usage + optional modelId
export type AppUsage = LanguageModelUsage & { modelId?: string };
