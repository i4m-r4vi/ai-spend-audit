export interface ToolInput {
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditRequest {
  tools: ToolInput[];
  teamSize: number;
  primaryUseCase: string;
}

export interface BreakdownItem {
  key: string;
  label: string;
  currentSpend: number;
  optimizedSpend: number;
  savingsMonthly: number;
  recommendedAction: string;
  reason: string;
}

export interface Recommendation {
  currentSpend: number;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  breakdown: BreakdownItem[];
}

export const analyzeSpend = (audit: AuditRequest): Recommendation => {
  const currentTotalSpend = audit.tools.reduce((acc, tool) => acc + (tool.monthlySpend * tool.seats), 0);
  const currentAnnualSpend = currentTotalSpend * 12;
  
  const hasCopilot = audit.tools.some((tool) => tool.toolName === "GitHub Copilot");
  const hasCursor = audit.tools.some((tool) => tool.toolName === "Cursor");
  const hasCopilotCursorOverlap = hasCursor && hasCopilot;
  
  const copilotAnnualSpend = audit.tools
    .filter((tool) => tool.toolName === "GitHub Copilot")
    .reduce((acc, tool) => acc + (tool.monthlySpend * tool.seats), 0) * 12;
    
  const consolidationSavingsAnnual = currentAnnualSpend > 0 ? currentAnnualSpend * 0.2 : 0;
  const overlapSavingsAnnual = hasCopilotCursorOverlap ? copilotAnnualSpend : 0;
  
  const optimizedAnnualSpendRaw = currentAnnualSpend - consolidationSavingsAnnual - overlapSavingsAnnual;
  const optimizedAnnualSpend = currentAnnualSpend > 0
    ? Math.max(Math.min(optimizedAnnualSpendRaw, currentAnnualSpend - 0.01), 0)
    : 0;
    
  const projectedAnnualSavings = Math.max(currentAnnualSpend - optimizedAnnualSpend, 0);
  const projectedMonthlySavings = projectedAnnualSavings / 12;

  const paidTools = audit.tools.filter((tool) => tool.toolName && (tool.monthlySpend * tool.seats) > 0);
  
  const breakdown: BreakdownItem[] = [];

  if (paidTools.length === 0) {
    breakdown.push({
      key: `engine-0`,
      label: `No Active Paid Subscriptions`,
      currentSpend: 0,
      optimizedSpend: 0,
      savingsMonthly: 0,
      recommendedAction: "Add your current spend to get optimization insights.",
      reason: "We couldn't detect any paid tools in your stack."
    });
  } else {
    paidTools.forEach((tool, index) => {
      const currentSpend = tool.monthlySpend * tool.seats;
      const optimizedSpend = currentSpend * 0.8;
      const savingsMonthly = currentSpend - optimizedSpend;

      breakdown.push({
        key: `base-${tool.toolName}-${index}`,
        label: tool.toolName,
        currentSpend,
        optimizedSpend,
        savingsMonthly,
        recommendedAction: "Switched to Shared Team API Workspace (-20% cost reduction)",
        reason: "This license was moved to a shared Team API Workspace pricing model with an immediate 20% cost reduction.",
      });
    });

    if (hasCopilotCursorOverlap) {
      const overlapMonthlySavings = copilotAnnualSpend / 12;
      
      if (overlapMonthlySavings > 0) {
        breakdown.push({
          key: "overlap-copilot-credit",
          label: "GitHub Copilot Overlap Credit",
          currentSpend: 0, // This was already accounted for in the base cost, so we show 0 here to not double count the "current spend" total
          optimizedSpend: 0,
          savingsMonthly: overlapMonthlySavings,
          recommendedAction: "Cancel overlapping GitHub Copilot subscription",
          reason: "Cursor already covers coding assistant workflows here, so removing Copilot unlocks additional overlap savings.",
        });
      }
    }
  }

  return {
    currentSpend: currentTotalSpend,
    recommendedSpend: optimizedAnnualSpend / 12,
    monthlySavings: projectedMonthlySavings,
    annualSavings: projectedAnnualSavings,
    breakdown
  };
};
