import { z } from 'zod';

export const toolSpendSchema = z.object({
  toolName: z.string().min(1, 'Tool name is required'),
  plan: z.string().min(1, 'Plan is required'),
  monthlySpend: z.number().min(0, 'Spend must be positive'),
  seats: z.number().min(1, 'Seats must be at least 1'),
});

export const auditRequestSchema = z.object({
  tools: z.array(toolSpendSchema).min(1, 'At least one tool is required'),
  teamSize: z.number().min(1, 'Team size must be at least 1'),
  primaryUseCase: z.enum(['Coding', 'Writing', 'Research', 'Data', 'Mixed']),
});
