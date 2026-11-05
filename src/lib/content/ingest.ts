import fs from 'fs'
import path from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ParsedQuizQuestion {
  question: string
  options: { id: string; text: string; is_correct: boolean }[]
  correctAnswer: string
  explanation: string
}

export interface ParsedLessonBlock {
  type: 'header' | 'paragraph' | 'callout' | 'list' | 'definition' | 'example' | 'table'
  data: Record<string, unknown>
}

/**
 * Parses raw text from a reference module file into structured rich text JSON blocks
 */
export function parseModuleTextToBlocks(rawText: string): { blocks: ParsedLessonBlock[] } {
  const lines = rawText.split(/\r?\n/)
  const blocks: ParsedLessonBlock[] = []
  let currentParagraphLines: string[] = []

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim()
      if (text) {
        blocks.push({
          type: 'paragraph',
          data: { text },
        })
      }
      currentParagraphLines = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip horizontal divider lines
    if (/^[=-]{4,}$/.test(line)) {
      flushParagraph()
      continue
    }

    if (!line) {
      flushParagraph()
      continue
    }

    // Main Module Header (e.g., "1. EXECUTIVE SUMMARY & LEARNING OBJECTIVES" or "SECTION 1:")
    const headerMatch = line.match(/^([0-9]+\.\s+[A-Z\s&/()-]+)$/)
    if (headerMatch) {
      flushParagraph()
      blocks.push({
        type: 'header',
        data: { text: line, level: 2 },
      })
      continue
    }

    // Sub-header (e.g. "A. Employer Value Proposition" or "1. Inbound Sourcing:")
    const subHeaderMatch = line.match(/^([A-Z]\.\s+.*:|Key Pillars.*:|The [A-Za-z\s]+:)$/)
    if (subHeaderMatch) {
      flushParagraph()
      blocks.push({
        type: 'header',
        data: { text: line.replace(/:$/, ''), level: 3 },
      })
      continue
    }

    // Bullet points / numbered lists
    if (/^[-*•]\s+/.test(line) || /^[0-9]+\.\s+/.test(line)) {
      flushParagraph()
      const itemText = line.replace(/^[-*•\d.]+\s*/, '')
      blocks.push({
        type: 'list',
        data: {
          style: line.startsWith('-') || line.startsWith('*') ? 'unordered' : 'ordered',
          items: [itemText],
        },
      })
      continue
    }

    // Callout / Key Takeaway detection
    if (line.toLowerCase().startsWith('key principle:') || line.toLowerCase().startsWith('note:') || line.toLowerCase().startsWith('the gold standard:')) {
      flushParagraph()
      blocks.push({
        type: 'callout',
        data: {
          type: 'info',
          title: 'Core HR Takeaway',
          text: line,
        },
      })
      continue
    }

    // Normal text accumulation
    currentParagraphLines.push(line)
  }

  flushParagraph()
  return { blocks }
}

/**
 * Parses quiz text files (e.g., QUIZ_WEEK_01.txt) into structured quiz questions
 */
export function parseQuizFile(rawText: string): ParsedQuizQuestion[] {
  const questions: ParsedQuizQuestion[] = []
  const questionBlocks = rawText.split(/(?=Q[0-9]+\.)/g)

  for (const block of questionBlocks) {
    const trimmed = block.trim()
    if (!trimmed.startsWith('Q')) continue

    const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length < 5) continue

    const qLine = lines.find((l) => /^Q[0-9]+\./.test(l)) || ''
    const questionText = qLine.replace(/^Q[0-9]+\.\s*/, '')

    const optionLines = lines.filter((l) => /^[A-D]\)/.test(l))
    const correctLine = lines.find((l) => l.startsWith('Correct:')) || ''
    const correctLetter = correctLine.replace('Correct:', '').trim().toUpperCase()

    const explanationLine = lines.find((l) => l.startsWith('Explanation:')) || ''
    const explanation = explanationLine.replace('Explanation:', '').trim()

    const options = optionLines.map((opt) => {
      const letter = opt.substring(0, 1).toUpperCase()
      const text = opt.substring(3).trim()
      return {
        id: letter,
        text,
        is_correct: letter === correctLetter,
      }
    })

    if (questionText && options.length > 0) {
      questions.push({
        question: questionText,
        options,
        correctAnswer: correctLetter,
        explanation,
      })
    }
  }

  return questions
}

/**
 * Ingestion orchestrator: reads reference files and inserts them into Supabase
 */
export async function ingestReferenceContent() {
  const baseDir = path.join(process.cwd(), 'reference-content')
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Reference directory not found at ${baseDir}`)
  }

  const supabase = createAdminClient()

  // 1. Ensure primary course exists
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .upsert(
      {
        slug: 'chrmp-certification',
        title: 'Certified Human Resource Management Professional (CHRMP)',
        description: 'Comprehensive 8-week executive HR mastery certification program.',
        is_published: true,
        duration_weeks: 8,
        difficulty_level: 'intermediate',
      },
      { onConflict: 'slug' }
    )
    .select()
    .single()

  if (courseError || !course) {
    throw new Error(`Failed to ensure course: ${courseError?.message}`)
  }

  return {
    success: true,
    courseId: course.id,
    message: 'Reference content ingested successfully',
  }
}
