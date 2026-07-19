import { describe, it, expect } from 'vitest';
import { analyzeSpend, type AuditRequest } from '../src/utils/auditEngine.js';

describe('Audit Engine', () => {
  it('should calculate 20% consolidation savings for standard tools', () => {
    const request: AuditRequest = {
      teamSize: 5,
      primaryUseCase: 'Writing',
      tools: [
        { toolName: 'ChatGPT', plan: 'Plus', monthlySpend: 20, seats: 5 },
      ],
    };

    const result = analyzeSpend(request);

    // Current spend: (20 * 5) = 100
    expect(result.currentSpend).toBe(100);
    // Consolidation savings: 20% of 100 = 20
    // Recommended spend: 100 - 20 = 80
    expect(result.recommendedSpend).toBe(80);
    expect(result.monthlySavings).toBe(20);
    expect(result.annualSavings).toBe(240);
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0]!.savingsMonthly).toBe(20);
  });

  it('should calculate overlap savings when Cursor and Copilot are both used', () => {
    const request: AuditRequest = {
      teamSize: 5,
      primaryUseCase: 'Coding',
      tools: [
        { toolName: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 5 },
        { toolName: 'GitHub Copilot', plan: 'Business', monthlySpend: 19, seats: 5 },
      ],
    };

    const result = analyzeSpend(request);

    // Current spend: (20 * 5) + (19 * 5) = 100 + 95 = 195
    expect(result.currentSpend).toBe(195);
    // Consolidation savings: 20% of 195 = 39
    // Overlap savings (all of Copilot): 95
    // Total savings: 39 + 95 = 134
    // Recommended spend: 195 - 134 = 61
    expect(result.monthlySavings).toBe(134);
    expect(result.recommendedSpend).toBe(61);
    expect(result.annualSavings).toBe(134 * 12);

    // Should have 2 base items + 1 overlap credit item
    expect(result.breakdown).toHaveLength(3);
    const overlapItem = result.breakdown.find(b => b.key === 'overlap-copilot-credit');
    expect(overlapItem).toBeDefined();
    expect(overlapItem?.savingsMonthly).toBe(95);
  });

  it('should return zero metrics when there are no paid tools', () => {
    const request: AuditRequest = {
      teamSize: 3,
      primaryUseCase: 'Design',
      tools: [
        { toolName: 'Claude', plan: 'Free', monthlySpend: 0, seats: 3 },
      ],
    };

    const result = analyzeSpend(request);

    expect(result.currentSpend).toBe(0);
    expect(result.recommendedSpend).toBe(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.breakdown).toHaveLength(1);
    expect(result.breakdown[0]!.key).toBe('engine-0');
    expect(result.breakdown[0]!.label).toBe('No Active Paid Subscriptions');
  });
});
