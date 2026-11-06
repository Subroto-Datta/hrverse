'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif font-bold text-lg shadow-xs">
            H
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-foreground">
            HR Verse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/courses" className="transition-colors hover:text-foreground">
            Courses
          </Link>
          <Link href="/curriculum" className="transition-colors hover:text-foreground">
            Curriculum
          </Link>
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="gap-1.5 shadow-xs font-semibold hover:shadow-[0_0_16px_-3px_rgba(245,158,11,0.22)] transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block py-2 text-sm font-medium text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/courses"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            href="/curriculum"
            className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Curriculum
          </Link>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

