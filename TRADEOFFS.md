# What this harness covers — and what it doesn't

## Holds up
- **Model-agnostic**: one adapter interface; swapping models doesn't touch the
  loop, registry, permissions, or approvals.
- **Permissioned by construction**: every call is schema-validated and routed
  through the five-level engine before it can run.
- **Human in control**: irreversible actions pause for approval; dangerous ones
  require type-to-confirm; denials feed back and the agent revises.
- **Auditable**: every call and decision is recorded.

## Not built here (the prereqs and the next rungs)
- **Memory** (session / project / long-term in Postgres + pgvector) — the agent
  here is stateless across runs. That's its own project.
- **Connectors** (real OAuth apps, databases, browser automation, MCP servers) —
  the tools here are local stubs; wiring real integrations is the connector layer.
- **Sandboxed execution** — shell/code/browser tasks must run in isolated
  containers with timeouts and secret isolation. Not in this core.
- **Eval harness** — tool-choice accuracy, hallucinated actions, permission
  violations, cost/latency. Without evals you're vibes-testing the agent.
- **Interfaces** — CLI here; the same runtime should power Slack, web, API,
  webhooks, and a scheduler.

## The honest summary
adapter → registry → loop → permission engine → human approval → audit. That's
the governed CORE of an OpenClaw-style runtime: any model can plan and use tools,
but it reads freely, drafts safely, and asks before anything irreversible. Memory,
connectors, the sandbox, evals, and interfaces build on this core.
