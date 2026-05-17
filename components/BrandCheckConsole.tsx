"use client";

import React, { useState } from 'react';
import { ShieldCheck, X, Upload, Loader2, Link as LinkIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Finding {
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  metric: string;
}

interface AnalysisResult {
  riskScore: number;
  complianceScore: number;
  findings: Finding[];
}

export function BrandCheckConsole({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>('');

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    const steps = [
      'Establishing secure engine connection...',
      'Parsing input semantic structure...',
      'Mapping against Brand OS Ontology...',
      'Evaluating compliance checkpoints...',
      'Finalizing risk matrix...'
    ];
    let stepIndex = 0;
    setProgressMsg(steps[stepIndex]);
    
    const intervalMs = activeTab === 'image' ? 1200 : 800;
    const progressInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setProgressMsg(steps[stepIndex]);
      }
    }, intervalMs);

    try {
      const response = await fetch('/api/brand-check-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, content }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}: AI engine failed to analyze content.`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Brand check error:', err);
      setError(err.message || 'An unexpected error occurred during brand analysis.');
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setProgressMsg('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0a09]/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[500px] bg-[#141413] border-l border-[#faf9f5]/10 shadow-2xl z-50 flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#faf9f5]/10 bg-[#1c1c1b]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#faf9f5]/5 flex items-center justify-center border border-[#faf9f5]/10">
                  <ShieldCheck className="w-4 h-4 text-[#788c5d]" />
                </div>
                <div>
                  <h2 className="text-[#faf9f5] font-bold text-sm uppercase tracking-widest">Brand Check Console</h2>
                  <p className="text-[#b0aea5] text-[10px] uppercase font-mono">Automated Engine Validation v4.0</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#faf9f5]/5 flex items-center justify-center border border-[#faf9f5]/10 text-[#b0aea5] hover:text-[#faf9f5] hover:bg-[#faf9f5]/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="text-[11px] text-[#b0aea5] leading-relaxed border border-[#faf9f5]/10 bg-[#faf9f5]/5 p-4 rounded-sm">
                <strong>System Criteria:</strong> Analyzes submitted assets against Brand OS Ontology. Enforces dark minimalist aesthetics (#141413 / #faf9f5), Swiss typography, soft lighting, and objective/trustworthy verbal identity. Checks out-of-bounds claims and cultural sensitivity.
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-[#1c1c1b] rounded-sm border border-[#faf9f5]/10">
                <button
                  disabled={isAnalyzing}
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase rounded-sm transition-colors ${activeTab === 'text' ? 'bg-[#faf9f5] text-[#141413]' : 'text-[#b0aea5] hover:text-[#faf9f5]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Copy / Text
                </button>
                <button
                  disabled={isAnalyzing}
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase rounded-sm transition-colors ${activeTab === 'image' ? 'bg-[#faf9f5] text-[#141413]' : 'text-[#b0aea5] hover:text-[#faf9f5]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Image URL
                </button>
              </div>

              {/* Input Area */}
              <div>
                {activeTab === 'text' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter copy, social post, or marketing claims to evaluate..."
                    className="w-full h-32 bg-[#1c1c1b] border border-[#faf9f5]/20 rounded-sm p-4 text-[11px] text-[#faf9f5] placeholder-[#b0aea5]/50 focus:outline-none focus:border-[#d97757] resize-none font-mono"
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="https://example.com/asset.jpg"
                      className="w-full bg-[#1c1c1b] border border-[#faf9f5]/20 rounded-sm p-3 text-[11px] text-[#faf9f5] placeholder-[#b0aea5]/50 focus:outline-none focus:border-[#d97757] font-mono"
                    />
                    {content && (
                      <div className="mt-2 text-center text-[10px] text-[#b0aea5] bg-[#faf9f5]/5 p-2 rounded-sm border border-[#faf9f5]/10">
                        Image will be fetched & evaluated on-server via Vision pipeline
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!content.trim() || isAnalyzing}
                  className="w-full flex-col mt-4 flex items-center justify-center gap-2 bg-[#d97757] text-[#141413] font-bold uppercase text-xs py-3 rounded-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing Asset...
                      </div>
                      {progressMsg && (
                        <div className="text-[9px] opacity-80 font-mono text-[#141413]">{progressMsg}</div>
                      )}
                    </>
                  ) : (
                    'Run Brand Check Evaluation'
                  )}
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-sm"
                    >
                      <p className="text-[11px] text-red-400 font-mono leading-relaxed">
                        <strong className="block text-red-500 mb-1">E_ENGINE_FAILURE</strong>
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results Area */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex flex-col gap-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1c1c1b] border border-[#faf9f5]/10 p-4 rounded-sm flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#b0aea5] uppercase tracking-widest font-mono mb-2">Compliance</span>
                      <span className={`text-4xl font-light tracking-tighter ${result.complianceScore >= 80 ? 'text-[#788c5d]' : result.complianceScore >= 50 ? 'text-[#d97757]' : 'text-red-500'}`}>
                        {result.complianceScore}
                      </span>
                    </div>
                    <div className="bg-[#1c1c1b] border border-[#faf9f5]/10 p-4 rounded-sm flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#b0aea5] uppercase tracking-widest font-mono mb-2">Risk Score</span>
                      <span className={`text-4xl font-light tracking-tighter ${result.riskScore <= 20 ? 'text-[#788c5d]' : result.riskScore <= 50 ? 'text-[#d97757]' : 'text-red-500'}`}>
                        {result.riskScore}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#faf9f5] mb-3">Diagnostic Findings</h3>
                    <div className="space-y-2 font-mono text-[10px]">
                      {result.findings.map((finding, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-[#1c1c1b] border border-[#faf9f5]/10 rounded-sm items-start">
                          <span className={`${finding.status === 'PASS' ? 'text-[#788c5d]' : finding.status === 'WARN' ? 'text-yellow-500' : 'text-[#d97757]'} font-bold`}>
                            [{finding.status}]
                          </span>
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-[#faf9f5]">{finding.message}</span>
                            <span className="text-[#b0aea5] opacity-50">Metric: {finding.metric}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
