'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Compass, Send, User, Loader2, BookOpen } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistantModal({
  isOpen,
  onClose,
  lessonTitle,
  lessonContent,
}: {
  isOpen: boolean
  onClose: () => void
  lessonTitle?: string
  lessonContent?: string
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Welcome to Faculty Office Hours. I am your HR Executive Advisor. How can I assist with your curriculum, statutory policies, or workplace case studies today?${
        lessonTitle ? ` I see you're currently reviewing "${lessonTitle}". Ask me about any complex frameworks or practical scenarios!` : ''
      }`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          lessonTitle,
          lessonContent,
          conversationHistory: updatedMessages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.reply || 'No response generated.' },
      ])
    } catch (err: unknown) {
      const error = err as Error
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: `⚠️ Notice: ${error.message || 'Unable to connect to the advisory desk. Please verify your connection.'}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-2xl h-[600px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                Faculty Office Hours & Case Advisor
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Advisory Desk
                </span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Executive HRM mentoring, statutory policy interpretations, and case guidance
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Compass className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-muted/80 text-foreground whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-muted-foreground text-xs">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <span>Advisor is reviewing...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-card flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about compliance, staffing ratios, or case rationale..."
            className="flex-1 text-sm"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="sm" className="gap-1.5">
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
