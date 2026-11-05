export const siteConfig = {
  name: 'HR Verse',
  description: 'AI-Powered Human Resource Management Learning Management System',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  author: 'HR Verse Team',
  links: {
    github: 'https://github.com/Subroto-Datta/hrverse',
  },
  navItems: {
    marketing: [
      { title: 'Home', href: '/' },
      { title: 'About', href: '/about' },
      { title: 'Courses', href: '/courses' },
      { title: 'Curriculum', href: '/curriculum' },
    ],
    student: [
      { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { title: 'Roadmap', href: '/roadmap', icon: 'Map' },
      { title: 'Learn', href: '/learn', icon: 'BookOpen' },
      { title: 'Quizzes', href: '/quizzes', icon: 'HelpCircle' },
      { title: 'Assessments', href: '/assessments', icon: 'ClipboardCheck' },
      { title: 'Projects', href: '/projects', icon: 'FolderKanban' },
      { title: 'Analytics', href: '/analytics', icon: 'BarChart3' },
      { title: 'Settings', href: '/settings', icon: 'Settings' },
    ],
    admin: [
      { title: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
      { title: 'Students', href: '/admin/students', icon: 'Users' },
      { title: 'Courses', href: '/admin/courses', icon: 'GraduationCap' },
      { title: 'Modules', href: '/admin/modules', icon: 'Layers' },
      { title: 'Lessons', href: '/admin/lessons', icon: 'FileText' },
      { title: 'Quizzes', href: '/admin/quizzes', icon: 'HelpCircle' },
      { title: 'Assessments', href: '/admin/assessments', icon: 'ClipboardCheck' },
      { title: 'Submissions', href: '/admin/submissions', icon: 'Inbox' },
      { title: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
      { title: 'Settings', href: '/admin/settings', icon: 'Settings' },
    ],
  },
}
