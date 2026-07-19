import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="relative overflow-hidden bg-white min-h-screen text-slate-900">

      {/* Background Glow */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[500px] bg-indigo-500/10 blur-[120px] rounded-[100%] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Zap className="text-indigo-600" />
          <span>AuditAI</span>
        </div>
        <Link to="/audit" className="text-sm font-medium hover:text-indigo-600 transition-colors">
          Start Free Audit
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 mb-8 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            Save up to 40% on AI SaaS
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
            Stop wasting money on <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              redundant AI tools.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Most teams overpay for AI. Get a free, deterministic audit of your stack (Cursor, Copilot, ChatGPT, Claude) and discover your hidden savings in under 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/audit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all"
              >
                Start Your Free Audit
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features / Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-200 pt-16"
        >
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center border border-slate-200">
              <CheckCircle2 className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Deterministic Rules</h3>
            <p className="text-slate-600">No hallucinated pricing. Our engine uses hard data from official vendor pricing pages.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center border border-slate-200">
              <CheckCircle2 className="text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tailored Alternatives</h3>
            <p className="text-slate-600">We analyze your primary use case (Coding vs Writing) to recommend the optimal stack.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center border border-slate-200">
              <CheckCircle2 className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Instant ROI</h3>
            <p className="text-slate-600">Discover team consolidations and seat optimizations that save thousands annually.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
