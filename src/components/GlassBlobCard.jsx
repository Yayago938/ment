import React from 'react'

export default function GlassBlobCard({
  children,
  className = '',
  interactive = false,
  as: Component = 'div',
  ...props
}) {
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_22px_48px_rgba(85,69,206,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'
    : ''

  return (
    <Component
      className={`premium-card group relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_16px_40px_rgba(85,69,206,0.08)] backdrop-blur-xl ${interactiveClasses} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#feadc8]/28 blur-2xl transition-transform duration-700 ease-out group-hover:scale-110" />
      <span className="pointer-events-none absolute -bottom-12 left-6 h-32 w-32 rounded-full bg-[#5545ce]/14 blur-2xl transition-transform duration-700 ease-out group-hover:translate-x-2" />
      <div className="relative z-10">{children}</div>
    </Component>
  )
}
