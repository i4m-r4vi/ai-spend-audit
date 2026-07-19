import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  email: string;
  company: string;
  role: string;
  teamSize: number;
  auditId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>({
  email: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  teamSize: { type: Number, required: true },
  auditId: { type: Schema.Types.ObjectId, ref: 'Audit', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
