import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingDown, Wand2, Mail } from 'lucide-react';
import { Input } from '../components/ui/input';

export const ResultsPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState<string | null>(null);

  // Fetch Audit Data
  const { data, isLoading, error } = useQuery({
    queryKey: ['audit', id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/audit/${id}`);
      if (res.data.summary) {
        setSummary(res.data.summary);
      }
      return res.data;
    }
  });

  // Generate AI Summary Mutation
  const summaryMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/summary`, { auditId: id });
      return res.data;
    },
    onSuccess: (data) => setSummary(data.summary)
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNotify = () => {
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lead`, {
        auditId: id,
        email: emailInput,
        company: "Self Employed",
        role: "User",
        teamSize: 1
      });
      setIsSuccess(true);
      setEmailInput('');
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultation = () => {
    window.location.href = "mailto:ayswarym04@gmail.com?subject=AI%20Spend%20Audit%20Consultation";
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">Loading your audit...</div>;
  if (error || !data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-600">Error loading audit results.</div>;

  const rec = data.recommendation;
  const isHighSavings = rec.monthlySavings > 500;
  const isLowSavings = rec.monthlySavings < 100;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Your Audit is Complete</h1>
          <p className="text-slate-600 text-lg">Here is your tailored AI spend optimization report.</p>
        </div>

        {/* Big Numbers */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <TrendingDown className="text-emerald-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium mb-2">Total Monthly Savings</p>
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-cyan-500">
              ${rec.monthlySavings.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <p className="text-slate-500 font-medium mb-2">Total Annual Savings</p>
            <h2 className="text-5xl font-extrabold text-slate-900">
              ${rec.annualSavings.toLocaleString()}
            </h2>
          </div>
        </motion.div>

        {/* Recommendation Text */}
        {(rec.recommendationText || (rec.alternativeTools && rec.alternativeTools.length > 0)) && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-indigo-50 border border-indigo-200 rounded-2xl p-8">
            {rec.recommendationText && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Our Recommendation</h3>
                <p className="text-lg leading-relaxed text-slate-800">{rec.recommendationText}</p>
              </>
            )}

            {rec.alternativeTools && rec.alternativeTools.length > 0 && (
              <div className="mt-6 pt-6 border-t border-indigo-200">
                <span className="text-sm text-indigo-600 uppercase tracking-wider font-semibold">Suggested Alternatives:</span>
                <ul className="mt-3 flex gap-3 flex-wrap">
                  {rec.alternativeTools.map((tool: string, i: number) => (
                    <li key={i} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-sm font-medium">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* AI Summary */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-indigo-500" /> Executive Summary</h3>
            {!summary && (
              <button
                onClick={() => summaryMutation.mutate()}
                disabled={summaryMutation.isPending}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {summaryMutation.isPending ? 'Generating...' : 'Generate AI Summary'}
              </button>
            )}
          </div>

          {summary ? (
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200">{summary}</p>
            </div>
          ) : (
            <p className="text-slate-500 italic text-center py-8">Click generate to receive a Gemini-powered executive summary of your audit.</p>
          )}
        </motion.div>

        {/* Tool-by-Tool Breakdown */}
        {rec.breakdown && rec.breakdown.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 text-slate-900 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl" />
            <h2 className="text-2xl font-semibold mb-6">Tool-by-Tool Breakdown</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 relative z-10">
              {rec.breakdown.map((item: any) => (
                <article key={item.key} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-lg font-bold text-emerald-600">
                      +${item.savingsMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
                    </p>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    ${item.currentSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} &rarr; ${item.optimizedSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="mt-2 text-sm font-medium text-indigo-600">{item.recommendedAction}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                </article>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conditional CTA */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center pt-8">
          {isHighSavings ? (
            <button onClick={handleConsultation} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all">
              <Mail size={20} /> Book TechVruk Consultation
            </button>
          ) : isLowSavings ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center max-w-lg shadow-sm">
              <p className="text-lg font-semibold text-emerald-800 mb-4">
                You're spending well. Your stack is already optimal!
              </p>
              <button onClick={handleNotify} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-medium border border-slate-200 shadow-sm transition-all mx-auto">
                <Mail size={18} /> Notify me when new optimizations apply
              </button>
            </div>
          ) : (
            <button onClick={handleNotify} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-xl font-bold border border-slate-200 shadow-sm transition-all">
              <Mail size={20} /> Notify me about future savings
            </button>
          )}
        </motion.div>

      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            {isSuccess ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">You're on the list!</h3>
                <p className="text-slate-600 mb-6">
                  We've successfully added you to the waitlist.
                  <br /><br />
                  <span className="text-indigo-600 font-medium">Important:</span> An email has been sent to your inbox. Please check your <strong>spam folder</strong> if you don't see it!
                </p>
                <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-lg font-medium transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Join the Waitlist</h3>
                <p className="text-slate-600 mb-6">Enter your email to get notified when we find new ways for you to save on AI tools.</p>
                <form onSubmit={submitLead} className="space-y-4">
                  <Input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="h-12 bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500"
                  />
                  <div className="flex gap-3 justify-end pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Submitting...' : 'Notify Me'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
