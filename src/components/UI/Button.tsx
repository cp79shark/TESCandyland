import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const VARIANTS = {
  primary: 'bg-green-500 hover:bg-green-400 border-green-700 text-white',
  secondary: 'bg-blue-500 hover:bg-blue-400 border-blue-700 text-white',
  danger: 'bg-red-500 hover:bg-red-400 border-red-700 text-white',
}

export default function Button({
  onClick,
  disabled,
  variant = 'primary',
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        font-candy font-bold px-6 py-3 rounded-xl border-b-4
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:border-b-2
        shadow-lg text-lg
        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
