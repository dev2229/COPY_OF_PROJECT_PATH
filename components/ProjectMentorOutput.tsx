
import React from 'react';
import { MentorOutput } from '../types.ts';
import Card from './Card.tsx';

interface ProjectMentorOutputProps {
  data: MentorOutput;
  onReset: () => void;
}

const ProjectMentorOutput: React.FC<ProjectMentorOutputProps> = ({ data, onReset }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
      {/* Intro */}
      <div className="text-center space-y-4">
        <p className="text-xl text-slate-600 font-medium leading-relaxed italic">
          "{data.intro}"
        </p>
        <button 
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline underline-offset-4"
        >
          Modify preferences
        </button>
      </div>

      {/* Project Ideas */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-lg">1</span>
          Tailored Project Ideas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.projectIdeas.map((idea, idx) => (
            <Card key={idx} className="flex flex-col h-full border-t-4 border-t-indigo-500">
              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  idea.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {idea.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{idea.title}</h3>
              <p className="text-sm text-slate-600 mb-4 flex-grow">{idea.description}</p>
              <div className="mt-auto pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Why this semester?</p>
                <p className="text-sm text-slate-700 italic">{idea.suitability}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-lg">2</span>
          Recommended Tech Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.techStack.map((stack, idx) => (
            <Card key={idx} className="bg-slate-50 border-none">
              <h4 className="font-bold text-indigo-700 text-sm mb-3 uppercase tracking-wide">{stack.category}</h4>
              <ul className="space-y-2">
                {stack.items.map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-lg">3</span>
          Week-wise Execution Roadmap
        </h2>
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pl-8">
          {data.roadmap.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-500"></div>
              <div>
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{step.week}</span>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{step.task}</h4>
                <ul className="list-disc list-inside space-y-1">
                  {step.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-600">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Viva Prep */}
      <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center mr-3 text-lg">4</span>
          Viva & Evaluation Readiness
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-emerald-400 font-bold mb-3 flex items-center">
                <span className="mr-2">❓</span> Common Viva Questions
              </h4>
              <ul className="space-y-2">
                {data.vivaPrep.questions.map((q, i) => (
                  <li key={i} className="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-4">{q}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-blue-400 font-bold mb-3 flex items-center">
                <span className="mr-2">🧠</span> Core Concepts to Master
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.vivaPrep.concepts.map((c, i) => (
                  <span key={i} className="bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-blue-200 border border-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-rose-400 font-bold mb-3 flex items-center">
                <span className="mr-2">⚠️</span> Common Mistakes to Avoid
              </h4>
              <ul className="space-y-2">
                {data.vivaPrep.mistakes.map((m, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start">
                    <span className="text-rose-500 mr-2">•</span> {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-indigo-400 font-bold mb-3 flex items-center">
                <span className="mr-2">🎯</span> Evaluator's Checklist
              </h4>
              <ul className="space-y-2">
                {data.vivaPrep.evaluatorExpectations.map((e, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-center">
                    <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <div className="text-center pt-8">
        <div className="inline-block px-8 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-lg text-indigo-900 font-bold mb-2">🚀 One last thing...</p>
          <p className="text-indigo-700 font-medium">"{data.closing}"</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectMentorOutput;
