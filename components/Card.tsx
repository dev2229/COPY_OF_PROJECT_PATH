
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, onClick }) => {
  return (
    <div 
      className={`bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all duration-300 ${onClick ? 'cursor-pointer hover:bg-white/[0.06] hover:border-orange-500/30' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-xl font-black text-white mb-6 tracking-tight uppercase tracking-wider text-sm text-slate-400 border-b border-white/5 pb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
