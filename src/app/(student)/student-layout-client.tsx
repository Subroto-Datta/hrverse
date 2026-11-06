'use client'

import { useState } from 'react'
import { StudentSidebar } from '@/components/layout/student-nav'
import { AIAssistantModal } from '@/components/layout/ai-assistant-modal'
import { Compass } from 'lucide-react'
import type { Profile } from '@/types'

export function StudentLayoutClient({
  profile,
  children,
}: {
  profile: Profile | null
  children: React.ReactNode
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background relative">
      <StudentSidebar profile={profile} onOpenAIChat={() => setAiModalOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Floating Advisor Button for quick reference in learning flow */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-xs shadow-md border border-primary/20 hover:scale-105 transition-all"
        aria-label="Open Faculty Advisor"
      >
        <Compass className="h-4 w-4" />
        <span>Faculty Advisor</span>
      </button>

      <AIAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  )
}
