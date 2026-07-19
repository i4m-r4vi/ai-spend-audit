import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Controller } from 'react-hook-form';

const formSchema = z.object({
  teamSize: z.number().min(1, 'Required'),
  primaryUseCase: z.enum(['Coding', 'Writing', 'Research', 'Data', 'Mixed']),
  tools: z.array(
    z.object({
      toolName: z.string().min(1, 'Required'),
      plan: z.string().min(1, 'Required'),
      monthlySpend: z.number().min(0, 'Required'),
      seats: z.number().min(1, 'Required'),
    })
  ).min(1, 'Add at least one tool'),
});

type FormValues = z.infer<typeof formSchema>;

const STORAGE_KEY = 'auditFormState';

const TOOL_OPTIONS: string[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
];

const PLAN_OPTIONS_BY_TOOL: Record<string, string[]> = {
  "Cursor": ["Free", "Pro", "Business", "Enterprise"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  "Claude": ["Free", "Pro", "Team", "Enterprise"],
  "ChatGPT": ["Free", "Plus", "Team", "Enterprise"],
  "Anthropic API": ["Free Trial", "Pay As You Go", "Enterprise Contract"],
  "OpenAI API": ["Free Trial", "Pay As You Go", "Enterprise Contract"],
  "Gemini": ["Free", "Advanced", "Business", "Enterprise"],
  "Windsurf": ["Free", "Pro", "Teams", "Enterprise"],
};

export const AuditFormPage = () => {
  const navigate = useNavigate();

  const { register, control, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: 1,
      primaryUseCase: 'Coding',
      tools: [{ toolName: '', plan: '', monthlySpend: 0, seats: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: 'tools',
    control
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved form state');
      }
    }
  }, [reset]);

  // Save to localStorage continuously
  const currentValues = watch();
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentValues));
  }, [currentValues]);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/audit`, data);
      // Clear localStorage on success
      localStorage.removeItem(STORAGE_KEY);
      navigate(`/share/${response.data.auditId}`);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit audit. Ensure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-24 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Build Your AI Stack Profile</h1>
          <p className="text-slate-500">Tell us what you use, and we'll tell you what you can save.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-500 mb-2">Team Size</label>
                <Input
                  type="number"
                  {...register('teamSize', { valueAsNumber: true })}
                  className="bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 h-12"
                />
                {errors.teamSize && <span className="text-red-500 text-sm mt-1">{errors.teamSize.message}</span>}
              </div>

              <div>
                <label className="block text-sm text-slate-500 mb-2">Primary Use Case</label>
                <Controller
                  name="primaryUseCase"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-12 focus:ring-indigo-500">
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Coding">Coding / Engineering</SelectItem>
                        <SelectItem value="Writing">Writing / Content</SelectItem>
                        <SelectItem value="Research">Research / Strategy</SelectItem>
                        <SelectItem value="Data">Data Analysis</SelectItem>
                        <SelectItem value="Mixed">Mixed / General</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Current Tools</h2>
              <button
                type="button"
                onClick={() => append({ toolName: '', plan: '', monthlySpend: 0, seats: 1 })}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Tool
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-500 mb-1">Tool Name</label>
                    <Controller
                      name={`tools.${index}.toolName` as const}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-10 focus:ring-indigo-500">
                            <SelectValue placeholder="Select tool..." />
                          </SelectTrigger>
                          <SelectContent>
                            {TOOL_OPTIONS.map(tool => (
                              <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-slate-500 mb-1">Plan Name</label>
                    <Controller
                      name={`tools.${index}.plan` as const}
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-10 focus:ring-indigo-500">
                            <SelectValue placeholder="Select plan..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(PLAN_OPTIONS_BY_TOOL[currentValues.tools?.[index]?.toolName] || []).map(plan => (
                              <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Cost/Mo ($)</label>
                    <Input
                      type="number"
                      {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                      className="bg-white border-slate-200 text-slate-900 h-10 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Seats</label>
                    <Input
                      type="number"
                      {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                      className="bg-white border-slate-200 text-slate-900 h-10 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-5">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500/70 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {errors.tools && <span className="text-red-500 text-sm block mt-2">You must add at least one valid tool.</span>}
            </div>
          </motion.div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Analyzing...' : 'Generate Audit Report'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
