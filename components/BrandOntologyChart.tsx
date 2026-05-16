"use client";

import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ontologyData = [
  { 
    subject: 'Innovation', 
    intended: 95, 
    perceived: 70, 
    fullMark: 100,
    details: "The brand is seen as a follower rather than an innovator based on recent product launch sentiment."
  },
  { 
    subject: 'Reliability', 
    intended: 90, 
    perceived: 85, 
    fullMark: 100,
    details: "Strong alignment. Customer reviews consistently highlight uptime and support."
  },
  { 
    subject: 'Sustainability', 
    intended: 80, 
    perceived: 50, 
    fullMark: 100,
    details: "Significant gap. ESG messaging has not penetrated mainstream media coverage."
  },
  { 
    subject: 'Premium Feel', 
    intended: 85, 
    perceived: 80, 
    fullMark: 100,
    details: "Aesthetic changes have landed well, though pricing perception lags slightly."
  },
  { 
    subject: 'Customer Centric', 
    intended: 95, 
    perceived: 65, 
    fullMark: 100,
    details: "Social listening indicates friction in the onboarding process offsetting positive support interactions."
  },
  { 
    subject: 'Ethical', 
    intended: 90, 
    perceived: 85, 
    fullMark: 100,
    details: "General positive sentiment, aligned with core brand values."
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const gap = dataPoint.intended - dataPoint.perceived;
    
    return (
      <div className="bg-[#141413] border border-[#faf9f5]/10 p-4 rounded-sm shadow-xl max-w-xs">
        <h4 className="text-[#faf9f5] font-bold mb-2 uppercase tracking-widest text-xs border-b border-[#faf9f5]/10 pb-2">{dataPoint.subject}</h4>
        
        <div className="space-y-2 mb-3 mt-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#d97757] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d97757]"></span>
              Intended
            </span>
            <span className="font-mono text-[#faf9f5]">{dataPoint.intended}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#788c5d] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#788c5d]"></span>
              Perceived
            </span>
            <span className="font-mono text-[#faf9f5]">{dataPoint.perceived}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-[#faf9f5]/5">
            <span className="text-[#b0aea5]">Delta (Gap)</span>
            <span className="font-mono text-[#faf9f5]">{gap > 0 ? `-${gap}` : `+${Math.abs(gap)}`}</span>
          </div>
        </div>
        
        <p className="text-[10px] text-[#b0aea5] leading-relaxed italic">
          {dataPoint.details}
        </p>
      </div>
    );
  }

  return null;
};

export function BrandOntologyChart() {
  const [activeDimension, setActiveDimension] = useState<string | null>(null);

  const handleEntityClick = (data: any) => {
    // If a user clicks on the chart labels or areas, we could set the active dimension
    if (data && data.activePayload && data.activePayload.length > 0) {
      setActiveDimension(data.activePayload[0].payload.subject);
    }
  };

  return (
    <div className="w-full flex-col md:flex-row flex gap-8 items-center bg-[#faf9f5]/5 rounded-xl border border-[#faf9f5]/10 p-8 group hover:border-[#d97757] transition-colors relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#788c5d] blur-[120px] opacity-10 pointer-events-none -translate-y-1/2"></div>
      
      <div className="w-full md:w-2/3 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={ontologyData} onClick={handleEntityClick}>
            <PolarGrid stroke="#faf9f5" strokeOpacity={0.1} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#b0aea5', fontSize: 10, fontFamily: 'monospace' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#b0aea5', fontSize: 10 }} tickCount={6} strokeOpacity={0.2} />
            <Radar name="Intended Positioning" dataKey="intended" stroke="#d97757" fill="#d97757" fillOpacity={0.2} />
            <Radar name="Market Perception" dataKey="perceived" stroke="#788c5d" fill="#788c5d" fillOpacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
               wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '20px' }} 
               iconType="circle"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/3 flex flex-col gap-6 relative z-10">
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-3">
             Ontology Visualization
          </h4>
          <p className="text-[11px] text-[#b0aea5] leading-relaxed">
            Identify identity gaps between how a brand positions itself and how it is actually perceived by the market across 150+ monitored dimensions.
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#141413]/50 border border-[#faf9f5]/10 rounded-sm">
             <div className="text-[10px] text-[#d97757] font-bold uppercase tracking-widest mb-1">Largest Gap</div>
             <div className="text-[#faf9f5] font-semibold text-sm mb-1">Sustainability (-30 pts)</div>
             <p className="text-[10px] text-[#b0aea5]">Requires immediate synthesis of environmental messaging across Tier 1 media.</p>
          </div>
          <div className="p-4 bg-[#141413]/50 border border-[#faf9f5]/10 rounded-sm">
             <div className="text-[10px] text-[#788c5d] font-bold uppercase tracking-widest mb-1">Strongest Alignment</div>
             <div className="text-[#faf9f5] font-semibold text-sm mb-1">Ethical (-5 pts)</div>
             <p className="text-[10px] text-[#b0aea5]">Core brand values successfully transmitted to target demographics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
