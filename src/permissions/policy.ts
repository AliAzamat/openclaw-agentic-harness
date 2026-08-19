import { Permission } from "../types";

// Who/how the agent is running. The same tool is riskier unattended.
export interface RunContext {
  surface: "cli" | "slack" | "cron";  // cron = nobody is watching
  user?: string;
}

// A policy maps (tool, context) -> effective permission. It can only make a tool
// SAFER than its default, never more permissive — a fail-closed rule.
export type Policy = (toolName: string, base: Permission, ctx: RunContext) => Permission;

const RANK: Record<Permission, number> = {
  "read-only": 0, "draft-only": 1, "approval-required": 2, "dangerous": 3, "forbidden": 4,
};

// Take the STRICTER of base and the override — policy can tighten, not loosen.
function stricter(a: Permission, b: Permission): Permission {
  return RANK[a] >= RANK[b] ? a : b;
}

export const defaultPolicy: Policy = (toolName, base, ctx) => {
  // Unattended runs: nobody can approve, so approval-required becomes forbidden.
  if (ctx.surface === "cron" && (base === "approval-required" || base === "dangerous")) {
    return stricter(base, "forbidden");
  }
  return base;
};
