import { analyzeSpend, AuditRequest } from './server/src/utils/auditEngine.ts';

const audit: AuditRequest = {
  teamSize: 2,
  primaryUseCase: 'Coding',
  tools: [
    { toolName: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 2 },
    { toolName: 'GitHub Copilot', plan: 'Individual', monthlySpend: 10, seats: 2 }
  ]
};

console.log(JSON.stringify(analyzeSpend(audit), null, 2));
