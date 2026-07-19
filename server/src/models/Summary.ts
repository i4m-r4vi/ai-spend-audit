import mongoose, { Schema, Document } from 'mongoose';

export interface ISummary extends Document {
  auditId: mongoose.Types.ObjectId;
  content: string; // The 100-word Anthropic generated summary
  createdAt: Date;
}

const SummarySchema = new Schema<ISummary>({
  auditId: { type: Schema.Types.ObjectId, ref: 'Audit', required: true, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);
