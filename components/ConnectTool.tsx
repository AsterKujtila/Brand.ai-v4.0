"use client";

import React, { useState } from 'react';

const tools = [
  { id: 'figma', name: 'Figma', url: 'https://www.figma.com/oauth' },
  { id: 'notion', name: 'Notion', url: 'https://api.notion.com/v1/oauth/authorize' },
  { id: 'slack', name: 'Slack', url: 'https://slack.com/oauth/v2/authorize' },
];

export function ConnectTool() {
  const [selectedTool, setSelectedTool] = useState(tools[0].id);

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering parent clicks
    const tool = tools.find((t) => t.id === selectedTool);
    if (!tool) return;
    
    const tenantId = 'sa-net-workspace';
    const targetScope = 'read';
    
    const params = new URLSearchParams({
      providerUrl: tool.url,
      targetScope: targetScope,
      tenantId: tenantId
    });
    
    window.location.href = `/api/integrations/connect?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
      <select 
        className="bg-[#141413] border border-[#faf9f5]/10 text-[#faf9f5] text-[10px] rounded-sm px-2 py-1 outline-none focus:border-[#d97757] uppercase font-mono cursor-pointer"
        value={selectedTool}
        onChange={(e) => setSelectedTool(e.target.value)}
      >
        {tools.map(t => (
           <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button 
        onClick={handleConnect}
        className="bg-[#faf9f5]/10 hover:bg-[#faf9f5]/20 text-[#faf9f5] px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-colors border border-[#faf9f5]/10 whitespace-nowrap"
      >
        Connect
      </button>
    </div>
  );
}
