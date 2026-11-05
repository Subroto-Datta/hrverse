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
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react'

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
      content: `Hello! I am your HR Verse AI Learning Mentor powered by Groq. How can I assist with your HRM studies today?${
        lessonTitle ? ` I see you're currently reviewing "${lessonTitle}". Ask me anything about it!` : ''
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
          content: `⚠️ Error: ${error.message || 'Could not connect to Groq AI. Please check your API key.'}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-2xl h-[600px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                HR Verse AI Learning Assistant
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  Groq LLM
                </span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Ask questions about HR concepts, case analyses, formulas, and rubrics.
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
                  <Bot className="h-4 w-4" />
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
              <span>HR Mentor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-border bg-card flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about compa-ratios, BARS, 360 feedback, ADDIE..."
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

