import React from 'react'

export function AmbientGlow({
  className = '',
  variant = 'default',
  showGrid = true,
}: {
  className?: string
  variant?: 'default' | 'subtle' | 'hero' | 'corner'
  showGrid?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* Subtle Micro-dot Grid Layer */}
      {showGrid && (
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] opacity-60 dark:opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" />
      )}

      {variant === 'hero' && (
        <div className="absolute inset-x-0 -top-24 flex justify-center [mask-image:radial-gradient(ellipse_at_top,white_55%,transparent_85%)]">
          <div className="relative w-[60rem] h-[32rem]">
            {/* Luminous Warm Amber Atmosphere */}
            <div className="absolute top-0 left-1/4 h-80 w-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-400/15 to-orange-500/10 blur-[110px] animate-pulse-subtle dark:from-amber-400/15 dark:via-amber-500/10 dark:to-transparent" />
            <div className="absolute top-8 right-1/4 h-72 w-96 rounded-full bg-gradient-to-bl from-orange-400/15 via-amber-300/12 to-yellow-500/8 blur-[120px] animate-float-slow dark:from-orange-500/12 dark:to-transparent" />
          </div>
        </div>
      )}

      {variant === 'corner' && (
        <div className="absolute -top-24 -right-24 h-[26rem] w-[26rem] rounded-full bg-gradient-to-bl from-amber-500/12 via-orange-500/6 to-transparent blur-[120px] dark:from-amber-400/10 dark:via-orange-500/5 animate-pulse-subtle" />
      )}

      {variant === 'subtle' && (
        <div className="absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-amber-500/8 blur-[90px] dark:bg-amber-400/6" />
      )}

      {variant === 'default' && (
        <div className="[mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_80%)]">
          <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] animate-float-slow dark:from-amber-500/8 dark:to-transparent" />
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-orange-500/8 blur-[130px] animate-pulse-subtle dark:from-orange-400/6 dark:to-transparent" />
        </div>
      )}
    </div>
  )
}

