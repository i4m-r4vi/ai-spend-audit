import { type Request, type Response } from 'express';
import { Resend } from 'resend';
import { Lead } from '../models/Lead.js';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

const leadSchema = z.object({
  auditId: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  role: z.string().min(1),
  teamSize: z.number().min(1),
});

export const captureLead = async (req: Request, res: Response) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    const { email, company, role, teamSize, auditId } = parsed.data;

    const newLead = await Lead.create({
      email,
      company,
      role,
      teamSize,
      auditId,
    });

    // Send confirmation email asynchronously (do not await)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '') {
      const resendClient = new Resend(process.env.RESEND_API_KEY);
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 24px;">Your AI Spend Audit is Ready! 🚀</h2>
          <p style="color: #334155; font-size: 16px; line-height: 1.6;">
            Hi there,<br><br>
            Thank you for submitting your current AI tooling stack. We've successfully analyzed your usage and identified your exact optimization opportunities.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="http://localhost:5173/share/${auditId}" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1);">
              View Your Full Report
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="http://localhost:5173/share/${auditId}" style="color: #3b82f6;">http://localhost:5173/share/${auditId}</a>
            <br><br>
            Best regards,<br>
            <strong>The AI Audit Team</strong>
          </p>
        </div>
      `;

      resendClient.emails.send({
        from: 'AI Audit <support@ravishankarsportfolio.xyz>',
        to: email,
        subject: 'Your AI Spend Audit Report is Ready',
        html: emailHtml,
      }).catch(err => console.error('Email sending failed:', err));
    }

    console.log('🎉 New Lead Captured:', { email, company, role, teamSize });

    return res.status(201).json({ message: 'Lead captured successfully', leadId: newLead._id });
  } catch (error) {
    console.error('Capture Lead Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
