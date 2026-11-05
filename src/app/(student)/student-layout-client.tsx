'use client'

import { useState } from 'react'
import { StudentSidebar } from '@/components/layout/student-nav'
import { AIAssistantModal } from '@/components/layout/ai-assistant-modal'
import { Sparkles } from 'lucide-react'
import type { Profile } from '@/types'
import { AmbientGlow } from '@/components/ui/ambient-glow'

export function StudentLayoutClient({
  profile,
  children,
}: {
  profile: Profile | null
  children: React.ReactNode
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <AmbientGlow variant="corner" showGrid={true} />
      <StudentSidebar profile={profile} onOpenAIChat={() => setAiModalOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Floating AI Button for quick access anywhere in learning flow */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold text-sm shadow-lg shadow-amber-500/20 border border-amber-300/30 hover:shadow-amber-500/30 hover:scale-105 transition-all"
        aria-label="Open AI Learning Assistant"
      >
        <Sparkles className="h-4 w-4 text-slate-900" />
        <span>Ask AI Mentor</span>
      </button>

      <AIAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  )
}

