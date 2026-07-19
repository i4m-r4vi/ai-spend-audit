import { Router } from 'express';
import { createAudit, getAudit } from '../controllers/auditController.js';
import { generateSummary } from '../controllers/summaryController.js';
import { captureLead } from '../controllers/leadController.js';

const router = Router();

// POST /api/audit - Create a new audit
router.post('/audit', createAudit);

// GET /api/audit/:id - Retrieve audit (also used for share)
router.get('/audit/:id', getAudit);
router.get('/share/:id', getAudit); // Alias for shareable URLs

// POST /api/summary - Generate Anthropic summary
router.post('/summary', generateSummary);

// POST /api/lead - Capture lead and send email
router.post('/lead', captureLead);

export default router;
