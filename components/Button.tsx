
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-4 rounded-xl font-black transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs';
  
  const variants = {
    primary: 'bg-[#ff5c00] text-white hover:bg-[#e65200] shadow-[0_10px_30px_rgba(255,92,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,92,0,0.4)]',
    secondary: 'bg-white text-black hover:bg-slate-200 shadow-xl',
    outline: 'border-2 border-white/10 text-white hover:bg-white/5'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-3 text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
