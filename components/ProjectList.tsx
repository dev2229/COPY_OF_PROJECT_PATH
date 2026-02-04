
import React from 'react';
import { ProjectSummary } from '../types.ts';
import Card from './Card.tsx';
import Button from './Button.tsx';

interface ProjectListProps {
  summaries: ProjectSummary[];
  onSelect: (summary: ProjectSummary) => void;
  onBack: () => void;
  isLoadingDetail: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ summaries, onSelect, onBack, isLoadingDetail }) => {
  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-7xl mx-auto pb-24 relative z-10">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-black text-white tracking-tighter">Exploration Results</h2>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">4 specialized engineering modules identified for your criteria.</p>
        <button onClick={onBack} className="text-[#ff5c00] font-black uppercase tracking-widest text-xs hover:text-white transition-all flex items-center mx-auto group">
          <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to home page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {(summaries || []).map((project, idx) => (
          <Card 
            key={project.id || idx} 
            className="group flex flex-col h-full bg-[#0a0a0a]/40 border border-white/5 hover:border-orange-500/30 transition-all duration-500 rounded-[2rem] p-8 overflow-hidden relative shadow-2xl cursor-pointer"
            onClick={() => onSelect(project)}
          >
            {/* Transparent click target to ensure the entire card is clickable */}
            <div className="absolute inset-0 z-20 cursor-pointer" aria-hidden="true"></div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-all duration-700"></div>

            <div className="mb-6 flex justify-between items-start relative z-10">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                project.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                project.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {project.difficulty}
              </span>
              <div className="text-slate-600 group-hover:text-[#ff5c00] transition-colors">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-white mb-4 group-hover:text-[#ff5c00] transition-colors leading-tight relative z-10">
              {project.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow relative z-10 font-medium">
              {project.shortDescription}
            </p>
            
            <div className="pt-6 border-t border-white/5 relative z-10">
              <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mb-2">
                <span className="w-4 h-[1px] bg-orange-500/50 mr-2"></span>
                Suitability Vector
              </div>
              <p className="text-xs text-slate-300 italic font-bold leading-relaxed">
                "{project.suitability}"
              </p>
            </div>
            
            <div className="mt-8 relative z-10">
              <Button variant="outline" className="w-full text-[10px] py-3.5 rounded-2xl group-hover:bg-[#ff5c00] group-hover:border-[#ff5c00] group-hover:text-white transition-all">
                Access Data
              </Button>
            </div>
          </Card>
        ))}
        {(!summaries || summaries.length === 0) && !isLoadingDetail && (
           <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-sm">
             No project blueprints detected.
           </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
