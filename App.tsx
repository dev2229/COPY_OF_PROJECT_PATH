import React, { useState } from 'react';
import ProjectForm from './components/ProjectForm.tsx';
import ProjectList from './components/ProjectList.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import { UserPreferences, ProjectSummary, ProjectDeepDive } from './types.ts';
import { generateProjectSummaries, generateProjectDeepDive } from './services/geminiService.ts';

enum AppView {
  FORM,
  LIST,
  DETAIL
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [summaries, setSummaries] = useState<ProjectSummary[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<ProjectDeepDive | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (newPrefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      setPrefs(newPrefs);
      const projectList = await generateProjectSummaries(newPrefs);
      setSummaries(projectList);
      setView(AppView.LIST);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection disrupted. Unable to retrieve project blueprints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = async (summary: ProjectSummary) => {
    if (!prefs) return;
    setIsLoadingDetail(true);
    setError(null);
    try {
      const detail = await generateProjectDeepDive(summary, prefs);
      setSelectedDetail(detail);
      setView(AppView.DETAIL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Initialization failed. Malformed project architectural data.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleBackToList = () => {
    setView(AppView.LIST);
    setSelectedDetail(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setView(AppView.FORM);
    setSummaries([]);
    setSelectedDetail(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="premium-bg selection:bg-orange-500/30 selection:text-white flex flex-col min-h-screen">
      <div className="grid-pattern"></div>
      <div className="horizon-glow"></div>
      <div className="horizon-line"></div>
      
      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navigation Bar Branding */}
        <nav className="flex items-center justify-center px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
          <div 
            className="text-4xl md:text-5xl font-black tracking-tighter text-white cursor-pointer select-none transition-transform hover:scale-105" 
            onClick={handleBackToForm}
          >
            Project<span className="text-[#ff5c00]">Path</span>
          </div>
        </nav>

        {/* Header Section */}
        <header className="pt-4 pb-16 px-6 text-center shrink-0">
          <div className="inline-flex items-center px-5 py-2 bg-orange-500/10 border border-orange-500/20 text-[#ff5c00] text-[11px] font-black uppercase tracking-[0.4em] rounded-full mb-10 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#ff5c00] mr-3 animate-pulse"></span>
            Strategic Engineering Guidance
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.82] drop-shadow-2xl max-w-5xl mx-auto uppercase">
            Build projects with clarity,<br/>
            not <span className="text-[#ff5c00]">confusion</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mt-4">
            Architect your academic journey with precision. 
            AI-powered roadmaps for the next generation of engineers.
          </p>
        </header>

        <main className="container mx-auto px-6 pb-40 flex-grow">
          {/* Global Error Notification */}
          {error && (
            <div className="max-w-4xl mx-auto mb-16 p-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-center font-bold animate-in slide-in-from-top-4 sticky top-4 z-50 backdrop-blur-md">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error}
                </div>
                <button onClick={() => setError(null)} className="ml-4 text-rose-300/50 hover:text-rose-300 transition-colors">✕</button>
              </div>
            </div>
          )}

          {view === AppView.FORM && (
            <div id="project-form-container" className="max-w-4xl mx-auto bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-10 sm:p-14 md:p-20 border border-white/10 animate-in zoom-in-95 duration-700">
              <div className="mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Project Configuration</h2>
                <p className="text-slate-400 font-medium text-lg">Input your parameters to generate 4 actionable engineering solutions.</p>
              </div>
              
              <ProjectForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          )}

          {view === AppView.LIST && (
            <ProjectList 
              summaries={summaries} 
              onSelect={handleProjectSelect} 
              onBack={handleBackToForm}
              isLoadingDetail={isLoadingDetail}
            />
          )}

          {view === AppView.DETAIL && selectedDetail && (
            <ProjectDetail 
              data={selectedDetail} 
              onBack={handleBackToList} 
            />
          )}
        </main>

        {/* Global Project Initialization Overlay */}
        {isLoadingDetail && (
          <div className="fixed inset-0 bg-black z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-[#0a0a0a] rounded-[3rem] p-16 text-center max-w-md w-full shadow-[0_0_100px_rgba(255,92,0,0.2)] border border-white/10 animate-in zoom-in-95">
              <div className="relative mb-10">
                <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,92,0,0.5)]">
                  <svg className="w-10 h-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase tracking-wider">Initializing</h3>
              <p className="text-slate-500 font-semibold text-lg leading-relaxed">Processing architectural roadmap and viva protocols...</p>
            </div>
          </div>
        )}

        <footer className="pt-24 pb-16 border-t border-white/5 bg-[#050505] relative z-20">
          <div className="container mx-auto px-8 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-24">
              <div className="space-y-8 text-center sm:text-left">
                <div className="text-4xl font-black tracking-tighter text-white">
                  Project<span className="text-[#ff5c00]">Path</span>
                </div>
                <p className="text-slate-400 font-medium text-base leading-relaxed max-w-xs mx-auto sm:mx-0">
                  Precision-engineered roadmaps for the builders of tomorrow. Reduce chaos, increase clarity.
                </p>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-black uppercase tracking-[0.25em] text-[11px] mb-10 opacity-60">System</h4>
                <ul className="space-y-6">
                  <li><button onClick={handleBackToForm} className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Project Generator</button></li>
                  <li><a href="#" className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Tech Library</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Viva Protocol</a></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-black uppercase tracking-[0.25em] text-[11px] mb-10 opacity-60">Resources</h4>
                <ul className="space-y-6">
                  <li><a href="#" className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Student Hub</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-[#ff5c00] transition-colors text-sm font-bold">Academic Guidelines</a></li>
                </ul>
              </div>

              <div className="text-center sm:text-left">
                <h4 className="text-white font-black uppercase tracking-[0.25em] text-[11px] mb-10 opacity-60">Connect</h4>
                <div className="flex items-center justify-center sm:justify-start space-x-5 mb-8">
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#ff5c00]/20 hover:text-[#ff5c00] transition-all border border-white/5 group">
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#ff5c00]/20 hover:text-[#ff5c00] transition-all border border-white/5 group">
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                  <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#ff5c00]/20 hover:text-[#ff5c00] transition-all border border-white/5 group">
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
                <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest text-center sm:text-left">Strategic Center • Silicon Valley</p>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <p className="text-slate-500 font-bold text-[11px] tracking-[0.4em] uppercase">
                  PROJECTPATH © 2024
                </p>
                <div className="hidden md:block w-px h-4 bg-white/10"></div>
                <div className="flex gap-8">
                  <a href="#" className="text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Privacy</a>
                  <a href="#" className="text-slate-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Terms</a>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-slate-600 font-bold text-[10px] tracking-[0.2em] uppercase">
                  Designed for the Engineering Elite
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;