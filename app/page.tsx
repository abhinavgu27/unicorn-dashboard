'use client';
import { useState } from 'react';

export default function Home() {
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('System Standby');
  const [logs, setLogs] = useState<string[]>([]);
  const [aiOutput, setAiOutput] = useState('');
  const [brandingUrl, setBrandingUrl] = useState(''); // NEW: Holds the image URL
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!industry) return;
    setIsLaunching(true);
    setStatus('Engine Active...');
    setLogs(['[SYSTEM] Connecting to Render Cloud...', '[SYSTEM] Waking up Llama-3 & FLUX...']);
    setAiOutput('// Agents are architecting your startup... please wait.');
    setBrandingUrl(''); // Reset the image

    try {
      // POINTING TO YOUR LIVE RENDER URL
      const response = await fetch('https://unicorn-engine-backend.onrender.com/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industry }),
      });

      const data = await response.json();
      
      setLogs(prev => [
        ...prev, 
        '[CEO] Strategic Roadmap Defined.', 
        '[DESIGNER] Brand Identity Generated.',
        '[CTO] Prototype Source Code Generated.'
      ]);
      
      setAiOutput(data.codebase_status || '// Error: Could not reach the AI Brain.');
      
      // If the backend sent an image URL, display it!
      if (data.branding_url && data.branding_url.startsWith('http')) {
          setBrandingUrl(data.branding_url);
      }
      
      setStatus('Success: Global Launch');
    } catch (error) {
      setStatus('System Error');
      setLogs(prev => [...prev, '[ERROR] Connection to Render failed.']);
    }
    setIsLaunching(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <header className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic text-blue-500 tracking-tighter">UNICORN ENGINE v2.0</h1>
          <p className="text-gray-400 text-sm tracking-widest mt-1">MULTIMODAL PRODUCTION ENVIRONMENT</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 tracking-widest">ENDPOINT</p>
          <p className={`text-sm ${status.includes('Error') ? 'text-red-500' : status.includes('Success') ? 'text-green-500' : 'text-blue-400'}`}>{status}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Inputs & Visuals */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2">Market Disruption</h2>
            <p className="text-gray-400 text-sm mb-6">Enter an industry to trigger the Agentic Workflow.</p>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. fashion, space travel" 
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white mb-6 focus:border-blue-500 focus:outline-none"
            />
            <button 
              onClick={handleLaunch}
              disabled={isLaunching}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              {isLaunching ? 'AGENTS WORKING...' : 'LAUNCH UNICORN ENGINE'}
            </button>
          </div>

          {/* BRAND IDENTITY CARD (Appears when image is ready) */}
          {brandingUrl && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl animate-fade-in">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-pink-500"></span> Brand Identity
               </h2>
               <img src={brandingUrl} alt="Generated Startup Logo" className="w-full rounded-lg shadow-lg border border-gray-800" />
            </div>
          )}
        </div>

        {/* Right Column - Outputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black border border-gray-800 rounded-xl p-6 font-mono text-sm shadow-2xl h-64 overflow-y-auto">
            <p className="text-blue-500 font-bold mb-4 italic tracking-widest">AGENT_LOG_STREAM</p>
            {logs.map((log, i) => (
              <p key={i} className="text-gray-300 mb-2">{log}</p>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> AI Generated Prototype
              </h2>
              <span className="text-xs text-gray-400 font-mono">language: python</span>
            </div>
            <div className="p-6 bg-[#0d1117] overflow-x-auto">
              <pre className="text-pink-400 font-mono text-sm whitespace-pre-wrap">{aiOutput}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}