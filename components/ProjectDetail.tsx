
import React, { useState, useEffect, useRef } from 'react';
import { ProjectDeepDive } from '../types.ts';
import Card from './Card.tsx';
import Button from './Button.tsx';

interface ProjectDetailProps {
  data: ProjectDeepDive;
  onBack: () => void;
}

const TimelineItem: React.FC<{
  step: { week: string; task: string; details: string[] };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ step, index, isExpanded, onToggle }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative pl-12 md:pl-20 pb-12 transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Timeline Connector Line */}
      <div className="absolute left-[15px] md:left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/50 to-transparent"></div>

      {/* Timeline Node */}
      <div 
        className={`absolute left-0 top-0 w-8 h-8 md:w-14 md:h-14 rounded-full border-2 transition-all duration-500 flex items-center justify-center z-10 ${
          isExpanded 
            ? 'bg-[#ff5c00] border-[#ff5c00] shadow-[0_0_30px_rgba(255,92,0,0.6)]' 
            : 'bg-[#0a0a0a] border-white/20 shadow-none'
        }`}
      >
        <span className={`text-[10px] md:text-xs font-black transition-colors ${isExpanded ? 'text-white' : 'text-slate-500'}`}>
          {index + 1}
        </span>
      </div>

      {/* Content Card */}
      <div 
        onClick={onToggle}
        className={`cursor-pointer group relative overflow-hidden transition-all duration-500 border rounded-[2rem] p-6 md:p-10 ${
          isExpanded 
            ? 'bg-orange-500/[0.05] border-orange-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.4)]' 
            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2 block">
              {step.week}
            </span>
            <h3 className={`text-xl md:text-2xl font-black tracking-tight transition-colors ${isExpanded ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
              {step.task}
            </h3>
          </div>
          <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <svg className="w-6 h-6 text-slate-500 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expandable Details */}
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-6 border-t border-white/10">
              <ul className="space-y-4">
                {step.details?.map((detail, i) => (
                  <li key={i} className="text-base text-slate-400 flex items-start font-medium animate-in slide-in-from-left-4 fade-in duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-4 mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(255,92,0,0.8)]"></span> 
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ data, onBack }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!data) return null;

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-6xl mx-auto pb-32 relative z-10">
      <div className="flex justify-start">
        <button onClick={onBack} className="group flex items-center text-slate-400 font-black uppercase tracking-widest text-[10px] px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Hub
        </button>
      </div>

      <div className="text-center space-y-8">
        <div className="inline-block px-5 py-2 bg-orange-500/10 text-[#ff5c00] text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-orange-500/20">
          Architecture Protocol
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-tight max-w-4xl mx-auto">
          {data.title}
        </h1>
        <p className="text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-medium italic">
          "{data.intro}"
        </p>
      </div>

      {/* Description & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card title="Module Objective" className="h-full border-none bg-white/[0.02] p-12">
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">{data.fullDescription}</p>
          </Card>
        </div>
        <div>
          <Card title="Integration Stack" className="h-full border-orange-500/20 bg-orange-500/[0.03] p-12">
            <div className="space-y-10">
              {data.techStack?.map((stack, idx) => (
                <div key={idx}>
                  <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-4">{stack.category}</h4>
                  <div className="flex flex-wrap gap-3">
                    {stack.items?.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-black rounded-xl tracking-wider">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )) || <p className="text-slate-500 text-xs">No stack defined.</p>}
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline Roadmap */}
      <section className="relative">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Execution Timeline</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Click steps to expand protocols</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative px-4">
          {data.roadmap?.map((step, idx) => (
            <TimelineItem 
              key={idx} 
              step={step} 
              index={idx} 
              isExpanded={expandedIndex === idx}
              onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            />
          )) || <p className="text-slate-500 text-center">Roadmap not available.</p>}
        </div>
      </section>

      {/* Viva Prep */}
      <section className="bg-black rounded-[4rem] p-16 text-white border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-10"></div>
        
        <h2 className="text-4xl font-black mb-16 flex items-center relative">
          <div className="w-14 h-14 rounded-3xl bg-orange-500 text-white flex items-center justify-center mr-6 shadow-2xl shadow-orange-500/20">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <span className="tracking-tight">Viva Strategy Protocol</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative">
          <div className="space-y-12">
            <div>
              <h4 className="text-orange-400 font-black mb-6 uppercase tracking-[0.3em] text-[10px]">Interrogation Scenarios</h4>
              <ul className="space-y-5">
                {data.vivaPrep?.questions?.map((q, i) => (
                  <li key={i} className="text-base text-slate-400 leading-relaxed pl-6 border-l border-orange-500/30 font-medium italic">{q}</li>
                )) || <li className="text-slate-500 text-sm">No scenarios listed.</li>}
              </ul>
            </div>
            <div>
              <h4 className="text-slate-500 font-black mb-6 uppercase tracking-[0.3em] text-[10px]">Conceptual Anchors</h4>
              <div className="flex flex-wrap gap-3">
                {data.vivaPrep?.concepts?.map((c, i) => (
                  <span key={i} className="bg-white/5 px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-200 border border-white/10 hover:border-orange-500/40 transition-all uppercase tracking-widest">
                    {c}
                  </span>
                )) || <span className="text-slate-500 text-xs">No anchors defined.</span>}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-rose-400 font-black mb-6 uppercase tracking-[0.3em] text-[10px]">Critical Failure Modes</h4>
              <ul className="space-y-4">
                {data.vivaPrep?.mistakes?.map((m, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start bg-white/5 p-4 rounded-3xl border border-white/5 font-medium">
                    <span className="text-rose-500 mr-4 font-black">✕</span> {m}
                  </li>
                )) || <li className="text-slate-500 text-sm">No data.</li>}
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
              <h4 className="text-orange-500 font-black mb-6 uppercase tracking-[0.3em] text-[10px]">Evaluator KPI</h4>
              <ul className="space-y-4">
                {data.vivaPrep?.evaluatorExpectations?.map((e, i) => (
                  <li key={i} className="text-sm text-slate-200 flex items-center font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5c00] mr-4 shadow-[0_0_15px_rgba(255,92,0,0.6)]"></div>
                    {e}
                  </li>
                )) || <li className="text-slate-500 text-sm">No data.</li>}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Resources & Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card title="Knowledge Assets" className="rounded-[3rem] p-12 border-none bg-white/[0.02]">
          <div className="space-y-4">
            {data.resources?.map((res, i) => (
              <div key={i} className="group/res flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-orange-500/10 transition-all cursor-pointer border border-white/5 hover:border-orange-500/20">
                <div>
                  <h4 className="font-black text-slate-200 text-sm group-hover/res:text-white transition-colors">{res.title}</h4>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{res.type}</span>
                </div>
                <div className="text-slate-600 group-hover/res:text-orange-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </div>
            )) || <p className="text-slate-500 text-sm italic py-4">Prioritize vendor-specific official documentation.</p>}
          </div>
        </Card>
        <Card title="Presentation Strategy" className="bg-white/[0.02] border-white/5 p-12 rounded-[3rem] text-white">
          <ul className="space-y-5">
            {data.presentationTips?.map((tip, i) => (
              <li key={i} className="flex items-start text-base text-slate-300 font-semibold leading-relaxed">
                <span className="mr-4 text-orange-500 text-xl">⚡</span> {tip}
              </li>
            )) || <li className="text-slate-500 text-sm italic">Focus on clear visuals and functional demos.</li>}
          </ul>
        </Card>
      </div>

      {/* Closing */}
      <div className="text-center pt-10">
        <div className="inline-block relative group">
          <div className="absolute inset-0 bg-[#ff5c00] rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative px-20 py-16 bg-[#0a0a0a] text-white rounded-[3rem] shadow-2xl border border-orange-500/20">
            <p className="text-4xl font-black mb-6 tracking-tight">Initiate Construction</p>
            <p className="text-orange-400 font-bold text-xl italic opacity-90 leading-relaxed max-w-2xl mx-auto">"{data.closing || 'Your roadmap is set. Proceed with confidence.'}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
