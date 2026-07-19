import { type Request, type Response } from 'express';
import { Audit } from '../models/Audit.js';
import { Summary } from '../models/Summary.js';
import { analyzeSpend } from '../utils/auditEngine.js';
import { auditRequestSchema } from '../validators/auditValidator.js';

export const createAudit = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const parsedBody = auditRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.format() });
    }

    const { tools, teamSize, primaryUseCase } = parsedBody.data;

    // 2. Run deterministic business logic
    const recommendation = analyzeSpend({ tools, teamSize, primaryUseCase });

    // 3. Save to database
    const newAudit = await Audit.create({
      tools,
      teamSize,
      primaryUseCase,
      totalCurrentMonthlySpend: recommendation.currentSpend,
    });

    // 4. Return the audit ID along with the calculation results
    return res.status(201).json({
      auditId: newAudit._id,
      recommendation
    });
  } catch (error) {
    console.error('Create Audit Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAudit = async (req: Request, res: Response) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Audit not found' });

    // Recalculate recommendation (or we could store it in the DB)
    const recommendation = analyzeSpend({
      tools: audit.tools,
      teamSize: audit.teamSize,
      primaryUseCase: audit.primaryUseCase as any
    });

    // Check if a summary exists for this audit
    const summaryDoc = await Summary.findOne({ auditId: audit._id });

    return res.json({
      audit,
      recommendation,
      summary: summaryDoc ? summaryDoc.content : null
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
