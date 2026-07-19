import mongoose, { Schema, Document } from 'mongoose';

export interface IToolSpend {
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface IAudit extends Document {
  tools: IToolSpend[];
  teamSize: number;
  primaryUseCase: 'Coding' | 'Writing' | 'Research' | 'Data' | 'Mixed';
  totalCurrentMonthlySpend: number;
  createdAt: Date;
}

const ToolSpendSchema = new Schema<IToolSpend>({
  toolName: { type: String, required: true },
  plan: { type: String, required: true },
  monthlySpend: { type: Number, required: true },
  seats: { type: Number, required: true },
});

const AuditSchema = new Schema<IAudit>({
  tools: [ToolSpendSchema],
  teamSize: { type: Number, required: true },
  primaryUseCase: {
    type: String,
    enum: ['Coding', 'Writing', 'Research', 'Data', 'Mixed'],
    required: true,
  },
  totalCurrentMonthlySpend: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Audit = mongoose.model<IAudit>('Audit', AuditSchema);
