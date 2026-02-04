
import React, { useState } from 'react';
import { Branch, SkillLevel, UserPreferences } from '../types.ts';
import Button from './Button.tsx';

interface ProjectFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const DOMAINS = [
  "Web Development",
  "Mobile App Development",
  "Artificial Intelligence / Machine Learning",
  "Internet of Things (IoT)",
  "Cybersecurity",
  "Data Science & Analytics",
  "Blockchain Technology",
  "Cloud Computing",
  "Embedded Systems",
  "Robotics & Automation",
  "AR / VR Development",
  "Game Development",
  "Networking & Systems",
  "Renewable Energy Systems",
  "Structural Engineering Designs"
];

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserPreferences>({
    semester: '6',
    branch: Branch.COMPUTER,
    domain: DOMAINS[0],
    skillLevel: SkillLevel.BEGINNER
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyles = "w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-[#ff5c00] transition-all outline-none text-white font-bold text-base appearance-none hover:bg-white/[0.08] cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-left">
        <div className="relative">
          <label className="block text-[11px] font-black text-slate-500 mb-5 uppercase tracking-[0.35em] ml-1">Current Semester</label>
          <div className="relative">
            <select name="semester" value={formData.semester} onChange={handleChange} className={inputStyles}>
              {[3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem} className="bg-[#0f0f0f]">{sem}th Semester</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-black text-slate-500 mb-5 uppercase tracking-[0.35em] ml-1">Engineering Branch</label>
          <div className="relative">
            <select name="branch" value={formData.branch} onChange={handleChange} className={inputStyles}>
              {Object.values(Branch).map(branch => (
                <option key={branch} value={branch} className="bg-[#0f0f0f]">{branch}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-slate-500 mb-5 uppercase tracking-[0.35em] ml-1">Project Domain</label>
          <div className="relative">
            <select name="domain" value={formData.domain} onChange={handleChange} className={inputStyles}>
              {DOMAINS.map(domain => (
                <option key={domain} value={domain} className="bg-[#0f0f0f]">{domain}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-black text-slate-500 mb-5 uppercase tracking-[0.35em] ml-1">Skill Experience</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(SkillLevel).map(level => (
              <label key={level} className="cursor-pointer group">
                <input 
                  type="radio" 
                  name="skillLevel" 
                  value={level} 
                  checked={formData.skillLevel === level}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="px-4 py-5 text-center rounded-2xl border border-white/10 text-slate-500 peer-checked:border-[#ff5c00] peer-checked:bg-orange-500/10 peer-checked:text-white transition-all font-black text-[10px] uppercase tracking-[0.25em] bg-white/5 group-hover:bg-white/10 shadow-sm flex items-center justify-center h-full">
                  {level}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-10">
        <Button type="submit" loading={isLoading} className="w-full text-lg py-7 rounded-[2rem] shadow-[0_25px_60px_rgba(255,92,0,0.4)] hover:shadow-[0_30px_70px_rgba(255,92,0,0.5)] transform hover:-translate-y-1 transition-all">
          GET PROJECTS
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
