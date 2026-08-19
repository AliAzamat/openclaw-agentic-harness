# Agentic Harness — A Model-Agnostic Agent Runtime

An advanced capstone that turns a tool-using agent into a governed runtime — the OpenClaw-style harness. You wrap every model behind one adapter so the loop never cares which model runs; turn each integration into a permissioned tool with a name, schema, and handler; run the plan→act→observe loop with a step/cost ceiling; classify every tool call through a permission engine (read-only, draft-only, approval-required, dangerous, forbidden); pause at a human-approval queue before any irreversible action; and keep an audit trail of every decision. The result is a runtime that can power a CLI, a Slack bot, or a scheduled automation — powerful, but never reckless.

## Stack
- TypeScript
- Node
