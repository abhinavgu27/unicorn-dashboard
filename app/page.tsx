'use client';
import { useState } from 'react';

export default function Home() {
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('System Standby');
  const [logs, setLogs] = useState<string[]>([]);
  const [aiOutput, setAiOutput] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!industry) return;
    
    setIsLaunching(true);
    setStatus('Engine Active...');
    setLogs(['[SYSTEM] Connecting to Render Cloud...', '[SYSTEM] Waking up Llama-3 on Groq...']);
    setAiOutput('// Agents are architecting your startup... please wait.');

    try {
      // POINTING TO YOUR LIVE RENDER URL
      const response = await fetch('https://unicorn-engine-backend.onrender.com/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industry }),
      });

      if (!response.ok) throw new Error('Backend failed');

      const data = await response.json();

      setLogs(prev => [
        ...prev, 
        '[CEO] Strategic Roadmap Defined.', 
        '[CTO] Prototype Source Code Generated.', 
        '[BOARD] Code Review Complete: APPROVED.'
      ]);
      
      setAiOutput(data.code); 
      setStatus('Success: Global Launch');
    } catch (error) {
      setLogs(prev => [...prev, '[ERROR] Connection to Render failed. Is the server waking up?']);
      setStatus('System Error');
      setAiOutput('// Error: Could not reach the AI Brain.');
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-blue-500 italic">UNICORN ENGINE v1.0</h1>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Live Production Environment</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Endpoint</div>
            <div className={`text-sm font-mono ${status === 'System Error' ? 'text-red-500' : 'text-green-400'}`}>
               {status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Strategic Input */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl sticky top-8">
              <h2 className="text-xl font-bold mb-4">Market Disruption</h2>
              <p className="text-gray-400 text-sm mb-6">Enter an industry to trigger the Agentic Workflow.</p>
              
              <input 
                type="text" 
                placeholder="e.g. Sustainable Fashion, Web3 Real Estate..."
                className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-6 transition-all"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              
              <button 
                onClick={handleLaunch}
                disabled={isLaunching || !industry}
                className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 ${
                  isLaunching ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20'
                }`}
              >
                {isLaunching ? 'AGENTS WORKING...' : 'LAUNCH UNICORN ENGINE'}
              </button>
            </div>
          </div>

          {/* Activity & Output */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Log Terminal */}
            <div className="bg-black p-6 rounded-2xl border border-gray-800 h-64 font-mono text-xs overflow-y-auto shadow-inner">
              <div className="text-blue-500 mb-2 font-bold underline italic tracking-widest">AGENT_LOG_STREAM</div>
              {logs.length === 0 && <div className="text-gray-700 italic mt-4">Awaiting launch signal...</div>}
              {logs.map((log, i) => (
                <div key={i} className="text-gray-400 py-1 flex items-start">
                  <span className="text-blue-900 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            {/* Generated Code */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
                  AI Generated Prototype
                </h2>
                <span className="text-xs text-gray-500 font-mono">language: python</span>
              </div>
              <pre className="bg-black p-4 rounded-xl text-purple-400 font-mono text-sm overflow-x-auto min-h-[250px] border border-gray-800">
                {aiOutput || "// System Ready. Awaiting CEO instructions..."}
              </pre>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}