import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, FileText, HelpCircle, Layers } from 'lucide-react'

const curriculumWeeks = [
  {
    week: 'Week 1',
    title: 'Strategic HRM, Workforce Planning & Talent Sourcing',
    hours: '10-12 hours',
    topics: [
      'Evolution of HRM: From Personnel Admin to Strategic Business Partner (SHRM)',
      'Job Analysis Techniques: TDRs vs. KSAOs, O*NET, and Functional Job Analysis',
      'Quantitative Workforce Demand Forecasting (Ratio & Regression Models)',
      'Multi-Channel Inbound & Outbound Sourcing (EVP, ERP, Talent Communities)',
      'Predictive Selection Validity (Schmidt & Hunter, Work Samples, STAR Interviews)',
    ],
    deliverables: 'Week 1 Comprehensive Quiz (20 questions, 70% passing threshold)',
  },
  {
    week: 'Week 2',
    title: 'Total Rewards, Performance Architecture & Instructional Design',
    hours: '12-14 hours',
    topics: [
      'The WorldatWork Total Rewards Model (Internal Equity vs External Competitiveness)',
      'Point-Factor Job Evaluation & Salary Structure Design (Range Spread & Compa-Ratios)',
      'Agile Performance Management: OKRs, Cascading Goals, and 360-Degree Feedback',
      'Behaviorally Anchored Rating Scales (BARS) & Calibration Bias Mitigation',
      'Instructional Design: ADDIE Framework & Knowles Adult Learning (Andragogy)',
    ],
    deliverables: 'Week 2 Comprehensive Quiz (20 questions) & Assessment 1 Scenario Brief',
  },
  {
    week: 'Week 3',
    title: 'Employee Relations, Labor Law & Psychological Safety',
    hours: '10 hours',
    topics: [
      'Statutory Compliance: FLSA, EEO-1, Title VII, FMLA, and ADA Regulations',
      'The 4/5ths Rule Adverse Impact Testing & Disparate Impact Auditing',
      'Union Organizing Processes, Collective Bargaining, and NLRB Guidelines',
      'Workplace Investigation Protocols and Progressive Discipline Defensibility',
    ],
    deliverables: 'Case Study: The Labor Organizing Petition at Regional Health',
  },
  {
    week: 'Week 4',
    title: 'Strategic Compensation & Executive Long-Term Incentives',
    hours: '12 hours',
    topics: [
      'Executive Compensation: Short-Term Incentives (STI) and Long-Term Incentives (LTI)',
      'Restricted Stock Units (RSUs), ISO/NSO Stock Options, and Vesting Cliffs',
      'Equal Pay Regressions and Pay Equity Transparency Auditing',
      'Benefits Modernization: HSA/FSA Cafeteria Plans (Section 125)',
    ],
    deliverables: 'Assessment 1 Submission: ApexLogix 12-Month HR Roadmap',
  },
  {
    week: 'Week 5',
    title: 'High-Performance Culture & Leadership Pipelines',
    hours: '10 hours',
    topics: [
      '9-Box Succession Planning (Performance vs. Potential Mapping)',
      'The Center for Creative Leadership 70-20-10 Capability Architecture',
      'Designing and Facilitating Executive Coaching Checkpoints',
      'Remediation Management: Legally Defensible Performance Improvement Plans (PIPs)',
    ],
    deliverables: 'Executive 9-Box Calibration Simulation',
  },
  {
    week: 'Week 6',
    title: 'Instructional Evaluation & Human Capital ROI',
    hours: '10 hours',
    topics: [
      'Kirkpatrick Four-Level Evaluation (Reaction, Learning, Behavior, Results)',
      'Jack Phillips Level 5 Return on Investment (ROI) Calculations',
      'Microlearning, xAPI, and Asynchronous LMS Deployments',
      'Building Continuous Mentorship Networks and Communities of Practice',
    ],
    deliverables: 'Assessment 2 Submission: NovaHealth Case Turnaround Report',
  },
  {
    week: 'Week 7',
    title: 'People Analytics, Flight Risk & Workforce Simulations',
    hours: '14 hours',
    topics: [
      'Talent Analytics Architecture: Quality of Hire (QoH), Time to Fill (TTF), and Cost per Hire (CPH)',
      'Predictive Attrition & Retention Logistic Regression Modeling',
      'Organizational Network Analysis (ONA) and Collaboration Health',
      'Ethical AI Governance in Talent Acquisition and Automated Screening',
    ],
    deliverables: 'Capstone Project 1: Comprehensive Organizational HR Audit',
  },
  {
    week: 'Week 8',
    title: 'Digital HR Transformation & Executive Capstone Defense',
    hours: '16 hours',
    topics: [
      'The Ulrich Modern HR Operating Model (HRBPs, COEs, Shared Services)',
      'Enterprise HRIS Ecosystem Selection and Cloud Architecture (Workday, ATS, LMS)',
      'Change Management Playbooks (Prosci ADKAR & Kotter 8-Step Model)',
      'Final Executive Capstone Presentation and Boardroom Defense',
    ],
    deliverables: 'Capstone Project 2: Digital HR Transformation Blueprint & Final Certification Defense',
  },
]

export default function CurriculumPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-2">Official Program Roadmap</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          8-Week Executive Curriculum
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Structured week-by-week learning journey engineered to build comprehensive, data-driven HR leadership capabilities.
        </p>
      </div>

      <div className="space-y-6">
        {curriculumWeeks.map((item, index) => (
          <Card key={index} className="border border-border/70 hover:border-primary/40 transition-all shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-foreground">
                    {item.week}: {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{item.hours}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Core Topics Covered:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {item.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 p-3 rounded-lg border border-primary/10">
                <FileText className="h-4 w-4 shrink-0" />
                <span>Deliverables: {item.deliverables}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
