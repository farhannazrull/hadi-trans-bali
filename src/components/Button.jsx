'use client';

import { Link } from '@/lib/router';
import { motion } from 'framer-motion';

// Create motion components outside of render to avoid re-creating on each render
const MotionAnchor = motion.create ? motion.create('a') : motion.a;
const MotionButton = motion.create ? motion.create('button') : motion.button;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  to, 
  onClick, 
  className = '',
  external = false,
  icon,
  ...props 
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 overflow-hidden group';
  
  const variants = {
    primary: 'bg-[#1a4d3e] text-white hover:bg-[#143d31]',
    secondary: 'bg-[#f3ede6] text-gray-900 hover:bg-[#e6d0b8]',
    outline: 'border-2 border-[#1a4d3e] text-[#1a4d3e] hover:bg-[#1a4d3e] hover:text-white',
    outlineLight: 'border-2 border-white text-white hover:bg-white hover:text-gray-900',
    golden: 'bg-[#c4935f] text-white hover:bg-[#b8824d]',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20bd5a]',
    dark: 'bg-gray-900 text-white hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
      </span>
    </>
  );

  if (href && external) {
    return (
      <MotionAnchor
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </MotionAnchor>
    );
  }

  if (href) {
    return (
      <MotionAnchor href={href} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props}>
        {content}
      </MotionAnchor>
    );
  }

  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link to={to} className={classes} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <MotionButton onClick={onClick} className={classes} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props}>
      {content}
    </MotionButton>
  );
};

export default Button;
