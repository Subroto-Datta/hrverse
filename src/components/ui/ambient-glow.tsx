import React from 'react'

export function AmbientGlow({
  className = '',
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'subtle' | 'hero' | 'corner'
}) {
  if (variant === 'hero') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center overflow-hidden [mask-image:radial-gradient(ellipse_at_top,white_40%,transparent_80%)] ${className}`}
      >
        <div className="relative w-[56rem] h-[28rem] -translate-y-12">
          {/* Primary Amber Blob */}
          <div className="absolute top-0 left-1/4 h-72 w-80 rounded-full bg-gradient-to-tr from-amber-500/25 to-orange-400/20 blur-[90px] animate-pulse-subtle" />
          {/* Warm Secondary Orange Blob */}
          <div className="absolute top-10 right-1/4 h-64 w-80 rounded-full bg-gradient-to-bl from-amber-400/20 to-yellow-500/15 blur-[100px] animate-float-slow" />
        </div>
      </div>
    )
  }

  if (variant === 'corner') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 right-0 -z-10 overflow-hidden ${className}`}
      >
        <div className="h-80 w-80 rounded-full bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent blur-[110px]" />
      </div>
    )
  }

  if (variant === 'subtle') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -z-10 overflow-hidden ${className}`}
      >
        <div className="h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_75%)] ${className}`}
    >
      <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px] animate-float-slow" />
      <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-orange-500/10 blur-[110px] animate-pulse-subtle" />
    </div>
  )
}
