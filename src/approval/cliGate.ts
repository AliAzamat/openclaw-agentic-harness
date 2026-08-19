import { ApprovalGate } from "../loop/run";

// A concrete approval gate for the CLI. The SAME ApprovalGate interface can be
// implemented as a Slack button or a web modal — the loop doesn't care.
export function cliGate(prompt: (q: string) => Promise<string>): ApprovalGate {
  return {
    async ask(toolName, args, reasoning): Promise<boolean> {
      // Show the human EXACTLY what will happen — action, args, and why.
      console.log("\n⏸  APPROVAL NEEDED");
      console.log(`   action:   ${toolName}`);
      console.log(`   args:     ${JSON.stringify(args)}`);
      console.log(`   reasoning: ${reasoning}`);

      // Dangerous actions need more than a keystroke: type the tool name back.
      const isDangerous = toolName === "delete_repo";
      if (isDangerous) {
        const typed = await prompt(`   type "${toolName}" to confirm: `);
        return typed.trim() === toolName;
      }
      const ans = await prompt("   [a]pprove / [d]eny: ");
      return ans.trim().toLowerCase().startsWith("a");
    },
  };
}
