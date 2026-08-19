import { Tool } from "./registry";

export const listFiles: Tool = {
  spec: { name: "list_files", description: "List files in the project.", inputSchema: { type: "object", properties: {} } },
  permission: "read-only",
  handler: async () => ["README.md", "bug_report.txt", "owner.txt"],
};

export const sendEmail: Tool = {
  spec: {
    name: "send_email",
    description: "Send an email to a recipient.",
    inputSchema: { type: "object", properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } }, required: ["to", "subject", "body"] },
  },
  permission: "approval-required",       // irreversible-ish: a human approves first
  handler: async (a) => `[SIMULATED SEND] to=${a.to} subject=${a.subject}`,
};

export const deleteRepo: Tool = {
  spec: { name: "delete_repo", description: "Delete a repository.", inputSchema: { type: "object", properties: { repo: { type: "string" } }, required: ["repo"] } },
  permission: "dangerous",               // destructive: extra confirmation
  handler: async (a) => `[SIMULATED DELETE] repo=${a.repo}`,
};
