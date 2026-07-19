import { type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Summary } from '../models/Summary.js';
import { Audit } from '../models/Audit.js';

// We will initialize the client dynamically inside the request handler
// to prevent the SDK from crashing if the key is missing on startup.

export const generateSummary = async (req: Request, res: Response) => {
  try {
    const { auditId } = req.body;

    if (!auditId) {
      return res.status(400).json({ message: 'Audit ID is required' });
    }

    const audit = await Audit.findById(auditId);
    if (!audit) {
      return res.status(404).json({ message: 'Audit not found' });
    }

    // Check if we already generated a summary for this audit
    const existingSummary = await Summary.findOne({ auditId });
    if (existingSummary) {
      return res.status(200).json({ summary: existingSummary.content });
    }

    let summaryText = '';

    try {
      // Check if key exists AND is not empty
      if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `You are a Senior SaaS Financial Auditor. 
      Review this AI spend data: 
      Current Spend: $${audit.totalCurrentMonthlySpend}/mo.
      Use Case: ${audit.primaryUseCase}.
      Tools: ${JSON.stringify(audit.tools)}.
      
      Write a professional 3-sentence executive summary identifying the biggest source of waste and the recommended action.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        summaryText = response.text || '';
      } else {
        throw new Error('Missing API Key');
      }
    } catch (apiError) {
      console.warn('Gemini API failed or missing, using fallback template.', apiError);
      summaryText = `Based on our analysis of your ${audit.teamSize}-person team focusing on ${audit.primaryUseCase}, we recommend consolidating redundant AI subscriptions. By streamlining your toolstack, you can ensure security compliance, simplified billing, and immediate cost savings without compromising on your team's productivity.`;
    }

    const newSummary = await Summary.create({
      auditId,
      content: summaryText,
    });

    return res.status(201).json({ summary: newSummary.content });
  } catch (error) {
    console.error('Generate Summary Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
