"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Database, Brain, Newspaper, Blocks, ShieldCheck, Sparkles, MoveRight } from 'lucide-react';
import Image from 'next/image';
import { BrandOntologyChart } from '@/components/BrandOntologyChart';
import { useRealtimeSync } from '@/hooks/use-realtime';
import { ConnectTool } from '@/components/ConnectTool';
import { BrandCheckConsole } from '@/components/BrandCheckConsole';
import { useState } from 'react';

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="mb-16 max-w-3xl">
    {subtitle && (
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-brand-gray mb-6 font-semibold">
        {subtitle}
      </h3>
    )}
    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
      {children}
    </h2>
  </div>
);

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const { status, events } = useRealtimeSync('sa-net-workspace');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <main ref={containerRef} className="min-h-screen bg-brand-dark overflow-hidden text-brand-light font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-brand-light/10 bg-brand-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-brand-dark rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">Brand.ai <span className="text-brand-gray font-normal">/ OS v4.0</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest text-brand-gray">
            <a href="#os" className="text-brand-light border-b border-brand-orange pb-1">Brand OS</a>
            <a href="#architecture" className="hover:text-brand-light transition-colors">Architecture</a>
            <a href="#philosophy" className="hover:text-brand-light transition-colors">Philosophy</a>
            <a href="#aeo" className="hover:text-brand-light transition-colors">AEO & GEO</a>
          </div>
          <div className="flex items-center gap-4">
            <div className={`hidden lg:flex items-center gap-2 text-[10px] uppercase px-3 py-1 rounded-full border ${status === 'ONLINE' ? 'bg-brand-green/20 text-brand-green border-brand-green/30' : 'bg-brand-orange/20 text-brand-orange border-brand-orange/30'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'ONLINE' ? 'bg-brand-green animate-pulse' : 'bg-brand-orange'}`}></div>
              System {status}
            </div>
            <button 
              onClick={() => setIsConsoleOpen(true)}
              className="bg-brand-light text-brand-dark px-5 py-2 text-xs font-bold uppercase rounded-sm hover:bg-brand-orange hover:text-white transition-colors"
            >
              Console
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/20 rounded-full blur-[100px] opacity-40 mix-blend-screen pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-light/5 border border-brand-light/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-brand-gray">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              Living Operating Systems
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
              Engineer <br className="hidden md:block"/>
              Your Identity.
            </h1>
            <p className="text-xl md:text-2xl text-brand-gray max-w-xl leading-relaxed mb-10">
              The paradigm shift from static PDFs to a Brand Operating System. Treat brand guidelines as an executable intelligence layer.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-brand-light text-brand-dark px-6 py-3 font-bold uppercase text-xs rounded-sm hover:bg-brand-orange hover:text-white flex items-center gap-2 group transition-colors">
                Explore Architecture
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 border border-brand-light/10 rounded-sm hover:bg-brand-light/5 font-bold uppercase text-xs text-brand-gray hover:text-brand-light transition-colors">
                Read the OS Docs
              </button>
            </div>
          </motion.div>
          
          {/* Abstract Glossy 3D Shape Representation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ y: yParallax }}
            className="relative h-[600px] w-full hidden md:block"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1b] to-brand-dark rounded-xl border border-brand-light/10 shadow-2xl overflow-hidden backdrop-blur-3xl flex items-center justify-center">
               <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-brand-light to-brand-gray/50 shadow-[inset_0_-20px_60px_rgba(0,0,0,0.5)] animate-pulse" style={{ animationDuration: '8s' }} />
               <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-brand-dark/60 backdrop-blur-md border border-brand-light/10">
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-brand-gray text-xs uppercase tracking-widest font-mono">Status</span>
                   <span className="text-brand-green text-xs font-mono">Active Sync</span>
                 </div>
                 <div className="h-2 bg-brand-gray/20 rounded-full overflow-hidden">
                   <div className="h-full w-2/3 bg-brand-orange rounded-full" />
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* The Crisis & The Solution */}
      <section id="os" className="py-32 px-6 border-t border-brand-light/10 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <p className="text-brand-orange font-mono text-sm mb-6 uppercase tracking-widest">01 / The Crisis</p>
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-6">Scale and Fragmentation.</h3>
              <p className="text-brand-gray text-lg leading-relaxed mb-6">
                41% of workers encounter AI-generated content requiring significant rework because it does not align with the brand&apos;s voice or visual language. This &quot;efficiency paradox&quot; erodes identity.
              </p>
              <p className="text-brand-gray text-lg leading-relaxed">
                Generic AI tools converge on a &quot;statistical center&quot;—visual elevator music that dilutes distinctiveness. High-profile missteps result in significant market value losses within hours.
              </p>
            </div>
            <div>
              <p className="text-brand-green font-mono text-sm mb-6 uppercase tracking-widest">02 / The Solution</p>
              <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-6">Brand Operating System.</h3>
              <p className="text-brand-gray text-lg leading-relaxed mb-6">
                brand.ai converts scattered knowledge into machine-readable rules. Every AI agent queries a &quot;living context layer&quot; rather than a static document.
              </p>
              <p className="text-brand-gray text-lg leading-relaxed">
                This transition from passive guidance to active specification preserves brand essence in a world where awareness scales instantly, but trust and meaning require deliberate engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section id="architecture" className="py-32 px-6 border-t border-brand-light/10 bg-gradient-to-br from-[#141413] to-[#1c1c1b] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle subtitle="Architecture">Four Intelligence Layers</SectionTitle>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                title: "Brand Foundation",
                desc: "Converts uploaded guidelines and strategy documents into structured, machine-readable rules. Eliminates version chaos and UI hallucinations.",
                color: "text-brand-orange",
                status: "Synced"
              },
              {
                icon: Brain,
                title: "Brand Ontology",
                desc: "Maps external perception across 150+ dimensions, analyzing media, conversations, and competitors to identify identity gaps.",
                color: "text-brand-green",
                status: "152 Dims"
              },
              {
                icon: Newspaper,
                title: "Newsroom",
                desc: "Monitors thousands of sources to auto-categorize daily intelligence into strategic themes and actionable content briefs.",
                color: "text-brand-light",
                status: "12 Themes"
              },
              {
                icon: Blocks,
                title: "Connected Apps",
                desc: "Secure OAuth 2.1 and MCP integrations with Figma, Notion, and Slack to create a continuous learning loop based on daily work.",
                color: "text-brand-gray",
                status: "MCP Active",
                action: <ConnectTool />
              }
            ].map((layer, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="group p-6 rounded bg-brand-light/5 border border-brand-light/10 hover:border-brand-orange cursor-pointer transition-colors flex flex-col"
              >
                 <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-brand-light">{layer.title}</span>
                  <span className={`text-[10px] ${layer.color}`}>{layer.status}</span>
                </div>
                <div className="mb-4">
                  <layer.icon className={`w-6 h-6 ${layer.color} opacity-80`} />
                </div>
                <p className="text-[11px] text-brand-gray leading-relaxed flex-grow">
                  {layer.desc}
                </p>
                {layer.action && layer.action}
              </motion.div>
            ))}
          </div>

          <div className="mt-20">
             <BrandOntologyChart />
          </div>
        </div>
      </section>

      {/* Philosophy: The Cybernetic Meadow */}
      <section id="philosophy" className="py-32 px-6 border-t border-brand-light/10 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square rounded-full border border-dashed border-brand-light/20 p-10 flex items-center justify-center group overflow-hidden">
               <div className="absolute inset-0 bg-brand-green/5 rounded-full blur-3xl mix-blend-screen scale-150" />
               <div className="w-full h-full rounded-full border border-brand-light/10 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                 <Image 
                   src="https://picsum.photos/seed/cybernetic/800/800" 
                   alt="Cybernetic Meadow" 
                   fill 
                   className="object-cover opacity-30 grayscale mix-blend-overlay group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-1000" 
                   referrerPolicy="no-referrer"
                 />
                 <div className="z-10 text-center relative pointer-events-none">
                    <Sparkles className="w-10 h-10 text-brand-green mx-auto mb-4" />
                    <span className="font-mono text-sm tracking-widest text-brand-light uppercase">The Invisible Seam</span>
                 </div>
               </div>
            </div>
            <div>
              <SectionTitle subtitle="Design Philosophy">The Cybernetic Meadow</SectionTitle>
              <div className="space-y-6 text-xl text-brand-gray leading-relaxed">
                <p>
                  Our philosophy is rooted in the &quot;invisible seam&quot;—AI should handle the analytical burden while preserving the human craft and judgment that makes a brand special.
                </p>
                <p>
                  Inspired by Richard Brautigan&apos;s vision where technology and human values exist in harmony. We don&apos;t automate creativity; we solve the systems problem of brand management.
                </p>
                <p className="pt-6 border-t border-brand-light/10">
                  <strong className="text-brand-light block mb-2">Visual DNA Tokens</strong>
                  Mechanization (control), magic (possibility), biomimicry (ease), and anthropomorphism (companionship). Raw, unproduced content acts as proof of humanity against generic AI generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AEO & GEO & RISE */}
      <section id="aeo" className="py-32 px-6 border-t border-brand-light/10 bg-brand-dark relative">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Optimization">AEO & GEO</SectionTitle>
          
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <div className="bg-brand-light/5 rounded-xl border border-brand-light/10 p-6 relative overflow-hidden group hover:border-brand-orange transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange blur-[100px] opacity-20 pointer-events-none" />
              <h4 className="text-sm font-semibold mb-6 flex items-center justify-between">
                Semantic Momentum
                <span className="text-[10px] font-mono text-brand-gray">GEO-RANK_v2</span>
              </h4>
              <p className="text-[11px] text-brand-gray mb-6 leading-relaxed">
                Visibility in AI systems compounds over time. When AI systems repeatedly associate a brand with an expertise, the association strengthens. This transforms AI into a digital gatekeeper, narrowing options for users.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-brand-orange bg-brand-orange/10 p-4 rounded border border-brand-orange/20">
                <span>Brand Web Mentions (0.664)</span>
                <MoveRight className="w-4 h-4" />
                <span>Primary Predictor</span>
              </div>
            </div>
            
            <div className="bg-brand-light/5 rounded-xl border border-brand-light/10 p-6 flex flex-col group hover:border-brand-orange transition-colors">
              <h4 className="text-sm font-semibold mb-6 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                Brand Check Live Feed
              </h4>
              <div className="text-[11px] text-brand-gray mb-6 leading-relaxed flex-1">
                {events.length > 0 ? (
                  <div className="space-y-3 font-mono">
                    {events.map((evt, i) => (
                      <div key={i} className="flex gap-4 p-2 border-b border-brand-light/5">
                        <span className="text-brand-green">[PASS]</span>
                        <span>{evt.type}...</span>
                        <span className="ml-auto opacity-50">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>A key feature calculating a &quot;Risk Score&quot; based on brand alignment. Click the top right &quot;Console&quot; button to simulate a live event stream validation.</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-brand-light/10 pt-20">
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-4">
                <h3 className="text-sm font-semibold mb-6">The RISE Framework</h3>
                <p className="text-[11px] text-brand-gray leading-relaxed">
                  Master the Brand Assistant with precise prompt engineering. A professional prompt is a compact creative brief that encodes audience, intent, brand identity, and channel.
                </p>
              </div>
              <div className="md:col-span-8">
                <div className="flex flex-col space-y-3 font-mono text-[10px] text-brand-gray overflow-hidden bg-brand-light/5 rounded-xl border border-brand-light/10 p-6">
                  {['Role & Objective', 'Identity & Tone', 'Structure & Formatting', 'Examples & Constraints'].map((letter, i) => (
                    <div key={i} className="flex gap-4 p-2 border-b border-brand-light/5 group">
                      <span className="text-brand-orange font-bold text-xs group-hover:scale-110 transition-transform">
                        {['[ R ]', '[ I ]', '[ S ]', '[ E ]'][i]}
                      </span>
                      <span>Extracted Framework Block: {letter}...</span>
                      <span className="ml-auto text-brand-light/50 group-hover:text-brand-light transition-colors">Rule Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action / CTA Section */}
      <section className="py-32 px-6 border-t border-brand-light/10 bg-brand-dark/50 text-center">
        <div className="max-w-3xl mx-auto">
          <SectionTitle subtitle="Initialize">Ready Space for Next-Gen Identity</SectionTitle>
          <p className="text-2xl text-brand-gray mb-10">
             The stakes of getting this right are immense. By mastering the invisible seam, organizations build brands that scale without losing their soul.
          </p>
          <button className="h-16 px-10 rounded-sm bg-brand-light text-brand-dark font-bold uppercase text-xs hover:bg-brand-orange hover:text-white transition-colors shadow-[0_0_40px_rgba(250,249,245,0.1)]">
            Deploy Your Brand OS
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-light/10 px-8 py-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-brand-gray font-mono tracking-widest gap-4">
        <div className="flex flex-wrap items-center gap-4 md:gap-8 uppercase justify-center">
          <span>Session: PRD-99823</span>
          <span className="hidden md:inline">Auth: OAuth 2.1 Verified</span>
          <span>Model: Claude-3-Ops-Optimized</span>
        </div>
        <div className="flex gap-4 items-center uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
            Brand-as-Code: Enabled
          </span>
        </div>
      </footer>
      
      <BrandCheckConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
    </main>
  );
}
