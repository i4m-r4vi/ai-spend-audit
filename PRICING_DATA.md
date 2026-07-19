# AI Tool Pricing Data

This document serves as the ground truth for the deterministic pricing algorithms used in the Audit Engine.

*Note: Pricing is approximate based on standard monthly plans as of 2026.*

## Coding & Development
| Tool | Plan | Monthly Price per Seat | Notes |
|------|------|------------------------|-------|
| Cursor | Pro | $20 | Highly recommended for coding use-cases |
| GitHub Copilot | Individual | $10 | Standard autocompletion |
| GitHub Copilot | Business | $19 | For teams |
| Windsurf | Pro | $15 | Alternative AI IDE |

## General Chat & Writing
| Tool | Plan | Monthly Price per Seat | Notes |
|------|------|------------------------|-------|
| ChatGPT | Plus | $20 | Individual |
| ChatGPT | Team | $30 | Minimum 2 seats required |
| Claude | Pro | $20 | Individual |
| Claude | Team | $30 | Minimum 5 seats required |
| Gemini | Advanced | $20 | Part of Google One |

## APIs (Variable usage, estimated baseline)
| Tool | Plan | Monthly Price per Seat | Notes |
|------|------|------------------------|-------|
| OpenAI API | Pay-as-you-go | Variable | (Assume baseline $50/mo for heavy dev use) |
| Anthropic API| Pay-as-you-go | Variable | (Assume baseline $50/mo for heavy dev use) |

## Optimization Rules
1. **Team Consolidation:** If a team has >= 5 seats on ChatGPT Plus ($20 * 5 = $100), recommend ChatGPT Team ($30 * 5 = $150). *Wait, Team is more expensive. But we recommend it for centralized billing/privacy. Actually, for savings, we might recommend switching from Team to Individual if they don't care about privacy, but usually, companies want privacy. Let's focus on savings: if they use multiple $20 chat tools (ChatGPT + Claude), recommend consolidating to just one.*
2. **Coding Specificity:** If the primary use case is "Coding" and they are paying for ChatGPT Plus ($20) + GitHub Copilot ($10) = $30/mo, recommend switching to Cursor Pro ($20/mo) for a savings of $10/mo per seat.
3. **General Redundancy:** If they pay for both Claude Pro and ChatGPT Plus, advise dropping one to save $20/mo per seat.
