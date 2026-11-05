-- HR VERSE DATABASE SEED SCRIPT
-- Seeds Initial Course, Modules, Lessons, Quizzes, Assessments & Demo Profiles

-- 1. Create Default Course
INSERT INTO public.courses (id, title, slug, description, thumbnail_url, is_published, duration_weeks, difficulty_level)
VALUES (
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Certified Human Resource Management Professional (CHRMP)',
  'chrmp-certification',
  'A masterclass in modern Human Resource Management covering Strategic Workforce Planning, Talent Acquisition, Total Rewards, Performance Systems, Learning & Development, and People Analytics.',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  true,
  8,
  'intermediate'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Create Modules
INSERT INTO public.modules (id, course_id, title, description, order_index, is_published)
VALUES 
(
  'b1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Week 1: Strategic Foundations & HR Planning',
  'Foundations of human resource management, workforce planning, and talent acquisition architectures.',
  1,
  true
),
(
  'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Week 2: Total Rewards, Performance & Talent Development',
  'Compensation engineering, BARS/OKR performance systems, and adult instructional design (ADDIE).',
  2,
  true
) ON CONFLICT DO NOTHING;

-- 3. Create Parts
INSERT INTO public.parts (id, module_id, title, description, order_index, is_published)
VALUES
(
  'c1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'Part 1: Strategic HRM & Workforce Architecture',
  'History, evolution, and strategic integration of people management.',
  1,
  true
),
(
  'c1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'Part 2: Talent Acquisition & Selection Systems',
  'Modern sourcing, predictive interviewing, and onboarding.',
  2,
  true
),
(
  'c1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'Part 3: Compensation & Total Rewards',
  'Job evaluation, salary structure design, and fringe benefits.',
  1,
  true
),
(
  'c1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'Part 4: Performance & Learning Systems',
  'Continuous appraisal, OKRs, and ADDIE instructional framework.',
  2,
  true
) ON CONFLICT DO NOTHING;

-- 4. Create Lessons
INSERT INTO public.lessons (id, part_id, title, slug, content, summary, order_index, is_published, estimated_minutes, completion_type)
VALUES
(
  'd1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 1: Introduction to Strategic HRM',
  'intro-to-strategic-hrm',
  '{"blocks":[{"type":"header","data":{"text":"Introduction to Strategic HRM","level":1}},{"type":"paragraph","data":{"text":"Human Resource Management (HRM) is the strategic, comprehensive approach to managing an enterprise people, workplace culture, and environment."}},{"type":"callout","data":{"type":"info","title":"Key Principle","text":"Human capital is the premier driver of durable competitive advantage in modern enterprise."}}]}',
  'Comprehensive exploration of the evolution of HRM from personnel administration to strategic enterprise driver.',
  1,
  true,
  25,
  'read'
),
(
  'd1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 2: Strategic Workforce Planning & Job Analysis',
  'workforce-planning-job-analysis',
  '{"blocks":[{"type":"header","data":{"text":"Strategic Workforce Planning & Job Analysis","level":1}},{"type":"paragraph","data":{"text":"Workforce planning systematically assesses current capability and forecasts future staffing requirements to achieve business goals."}}]}',
  'Job analysis methods, Job Descriptions (TDRs), Job Specifications (KSAOs), and quantitative demand forecasting.',
  2,
  true,
  30,
  'read'
),
(
  'd1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 3: Talent Acquisition & Predictive Selection',
  'talent-acquisition-predictive-selection',
  '{"blocks":[{"type":"header","data":{"text":"Talent Acquisition & Predictive Selection","level":1}},{"type":"paragraph","data":{"text":"Structured behavioral interviewing (STAR) and work-sample assessments provide the highest predictive validity in candidate evaluation."}}]}',
  'Multi-channel candidate sourcing, behavioral interviews, psychometric evaluations, and structured 30-60-90 onboarding.',
  1,
  true,
  35,
  'read'
),
(
  'd1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 4: Compensation Architecture & Total Rewards',
  'compensation-total-rewards',
  '{"blocks":[{"type":"header","data":{"text":"Compensation Architecture & Total Rewards","level":1}},{"type":"paragraph","data":{"text":"Balancing internal equity through Point-Factor job evaluation with external market competitiveness using salary surveys."}}]}',
  'Pay grades, range spread, compa-ratios, short-term variable bonuses, and equity compensation structures.',
  1,
  true,
  30,
  'read'
),
(
  'd1b2c3d4-0005-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 5: Performance Management & Appraisal Systems',
  'performance-mgmt-appraisal-systems',
  '{"blocks":[{"type":"header","data":{"text":"Performance Management & Appraisal Systems","level":1}},{"type":"paragraph","data":{"text":"Transitioning from annual reviews to continuous coaching, SMART goals, OKRs, and Behaviorally Anchored Rating Scales (BARS)."}}]}',
  'Continuous coaching cycles, multi-rater 360 evaluations, rating calibration panels, and structured PIPs.',
  1,
  true,
  30,
  'read'
),
(
  'd1b2c3d4-0006-7a8b-9c0d-1e2f3a4b5c6d',
  'c1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d',
  'Module 6: Learning, Development & ADDIE Architecture',
  'learning-development-addie',
  '{"blocks":[{"type":"header","data":{"text":"Learning, Development & ADDIE Architecture","level":1}},{"type":"paragraph","data":{"text":"Adult learning theory (Andragogy) and the 5-phase ADDIE framework for instructional design and capability building."}}]}',
  'Knowles adult learning principles, 3-level needs analysis, Kirkpatrick Level 1-4 evaluation, and Phillips ROI.',
  2,
  true,
  35,
  'read'
) ON CONFLICT DO NOTHING;

-- 5. Create Quizzes
INSERT INTO public.quizzes (id, module_id, title, description, passing_score, time_limit_minutes, max_attempts, is_published)
VALUES
(
  'e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'Week 1 Comprehensive Quiz: HRM Foundations & Talent Acquisition',
  '20 questions testing your knowledge of Strategic HRM, Job Analysis, Workforce Planning, and Selection Validity.',
  70,
  30,
  3,
  true
),
(
  'e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'Week 2 Comprehensive Quiz: Total Rewards, Performance & ADDIE',
  '20 questions covering Compa-Ratios, BARS, OKRs, Adult Learning, and Kirkpatrick ROI evaluation.',
  70,
  30,
  3,
  true
) ON CONFLICT DO NOTHING;

-- 6. Create Assessments
INSERT INTO public.assessments (id, course_id, title, description, instructions, rubric, max_score, is_published)
VALUES
(
  'f1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Assessment 1: Strategic HR Roadmap for ApexLogix Technologies',
  'Develop a comprehensive 12-month Strategic People Roadmap for a high-growth Series C SaaS enterprise.',
  'Analyze the ApexLogix case scenario and prepare an executive report addressing Talent Acquisition, Total Rewards, Performance, and Culture. Maximum 2,500 words.',
  '[{"criterion":"Strategic Alignment","description":"Linkage to business goals and IPO readiness","max_points":25},{"criterion":"Technical Rigor","description":"Point-factor evaluation, compa-ratios, BARS rubrics","max_points":25},{"criterion":"Implementation Plan","description":"Phased 12-month change management roadmap","max_points":25},{"criterion":"KPI Scorecard","description":"Metrics dashboard and tracking metrics","max_points":15},{"criterion":"Presentation","description":"Structure, clarity, and executive professionalism","max_points":10}]',
  100,
  true
),
(
  'f1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Assessment 2: Case Study Analysis - The Talent Crisis at NovaHealth',
  'Conduct a comprehensive diagnostic and turnaround strategy for a 2,400-employee healthcare network facing high clinical turnover.',
  'Analyze root causes of nurse attrition, labor relations risks, agency spend abatement, and design a retention architecture.',
  '[{"criterion":"Root Cause Analysis","description":"Ishikawa / 5-Whys diagnostic depth","max_points":25},{"criterion":"Solution Architecture","description":"Actionable, multifaceted interventions","max_points":25},{"criterion":"Financial Viability","description":"Agency spend abatement and ROI model","max_points":20},{"criterion":"Compliance & Ethics","description":"Labor relations and worker rights","max_points":15},{"criterion":"Executive Clarity","description":"Cohesive report synthesis and recommendations","max_points":15}]',
  100,
  true
) ON CONFLICT DO NOTHING;

-- 7. Create Capstone Projects
INSERT INTO public.projects (id, course_id, title, description, instructions, rubric, max_score, is_published)
VALUES
(
  '91b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Capstone Project 1: Comprehensive Organizational HR Audit',
  'Conduct an end-to-end compliance, compensation, and operational audit of an enterprise people function.',
  'Execute a structured audit covering legal compliance, adverse impact (4/5ths rule), equal pay regression, and risk prioritization matrix.',
  '[{"criterion":"Audit Thoroughness","description":"Comprehensive evaluation across 5 domains","max_points":30},{"criterion":"Statistical Analysis","description":"Equal pay and adverse impact calculations","max_points":25},{"criterion":"Regulatory Accuracy","description":"FLSA, EEO, and labor standard compliance","max_points":20},{"criterion":"Remediation Roadmap","description":"30-60-90 day prioritized action matrix","max_points":15},{"criterion":"Report Quality","description":"Executive formatting and clarity","max_points":10}]',
  100,
  true
),
(
  '91b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Capstone Project 2: Digital HR Transformation & People Analytics Blueprint',
  'Architect the modern AI-enabled HR Operating Model and People Analytics dashboard for a multinational enterprise.',
  'Design the target Ulrich operating model, AI ethics charter, system integration blueprint, and executive analytics prototype.',
  '[{"criterion":"Transformation Vision","description":"Modern operating model and system blueprint","max_points":30},{"criterion":"AI & Tech Integration","description":"Ethical governance and automation architecture","max_points":25},{"criterion":"Analytics Sophistication","description":"Flight risk and predictive capability models","max_points":20},{"criterion":"Change Management","description":"ADKAR/Kotter model and business case ROI","max_points":15},{"criterion":"Deliverable Polish","description":"Comprehensive presentation and documentation","max_points":10}]',
  100,
  true
) ON CONFLICT DO NOTHING;


-- 8. SEED ALL 40 QUIZ QUESTIONS FOR WEEK 1 AND WEEK 2
INSERT INTO public.quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
VALUES
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'Which perspective views human capital not as an operational expenditure to be minimized, but as a primary competitive advantage?', 'multiple_choice', '[{"id":"A","text":"Classical Scientific Management","is_correct":false},{"id":"B","text":"Strategic Human Resource Management (SHRM)","is_correct":true},{"id":"C","text":"Bureaucratic Organization Theory","is_correct":false},{"id":"D","text":"Industrial Taylorism","is_correct":false}]'::jsonb, 'B', 'Strategic Human Resource Management (SHRM) links people management practices directly with long-term strategic enterprise objectives, viewing human capital as a core value driver.', 1, 1),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is the fundamental distinction between a Job Description and a Job Specification?', 'multiple_choice', '[{"id":"A","text":"Job descriptions detail salary bands; job specifications define reporting hierarchies.","is_correct":false},{"id":"B","text":"Job descriptions define tasks, duties, and responsibilities (TDRs); job specifications define Knowledge, Skills, Abilities, and Other characteristics (KSAOs).","is_correct":true},{"id":"C","text":"Job descriptions are public; job specifications are internal secrets.","is_correct":false},{"id":"D","text":"Job descriptions are updated annually; job specifications never change.","is_correct":false}]'::jsonb, 'B', 'Job descriptions capture the observable work and responsibilities (TDRs), while job specifications state the human competencies and credentials required (KSAOs).', 1, 2),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'In quantitative workforce planning, which technique establishes statistical relationships between organizational volume (e.g., sales revenue) and required headcount?', 'multiple_choice', '[{"id":"A","text":"Delphi Method","is_correct":false},{"id":"B","text":"Trend / Ratio Regression Analysis","is_correct":true},{"id":"C","text":"Nominal Group Technique","is_correct":false},{"id":"D","text":"Succession Scenario Planning","is_correct":false}]'::jsonb, 'B', 'Ratio analysis and regression modeling correlate operational volume indicators (e.g., units produced, revenue) with staffing requirements.', 1, 3),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is the main threat to validity when conducting an unstructured interview?', 'multiple_choice', '[{"id":"A","text":"Overly rigid scoring criteria","is_correct":false},{"id":"B","text":"Cognitive bias, halo/horns effects, and inconsistent questioning across candidates","is_correct":true},{"id":"C","text":"Excessive predictive accuracy","is_correct":false},{"id":"D","text":"High statistical reliability","is_correct":false}]'::jsonb, 'B', 'Unstructured interviews lack standard questions and evaluation rubrics, making them highly susceptible to interviewer bias, intuition errors, and poor predictive validity.', 1, 4),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'Which selection tool consistently exhibits the highest predictive validity in employment testing literature?', 'multiple_choice', '[{"id":"A","text":"Standalone Myers-Briggs personality indicator","is_correct":false},{"id":"B","text":"Work sample tests and structured behavioral interviews","is_correct":true},{"id":"C","text":"Reference checks from past colleagues","is_correct":false},{"id":"D","text":"Analysis of personal handwriting (graphology)","is_correct":false}]'::jsonb, 'B', 'Schmidt & Hunter meta-analyses demonstrate that work sample tests (~0.54) and structured behavioral interviews (~0.51) offer the highest predictive validities for job performance.', 1, 5),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'In the STAR interview technique, what does the acronym represent?', 'multiple_choice', '[{"id":"A","text":"Strategy, Timing, Action, Reward","is_correct":false},{"id":"B","text":"Situation, Task, Action, Result","is_correct":true},{"id":"C","text":"Standards, Technique, Attitude, Reliability","is_correct":false},{"id":"D","text":"System, Target, Alignment, Review","is_correct":false}]'::jsonb, 'B', 'STAR stands for Situation, Task, Action, Result—a structured framework for eliciting and evaluating behavioral examples.', 1, 6),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What does the "4/5ths Rule" (or 80% Rule) measure in employment selection?', 'multiple_choice', '[{"id":"A","text":"Whether a recruitment test takes less than 80 minutes to finish","is_correct":false},{"id":"B","text":"Potential adverse impact against a protected class in hiring selection ratios","is_correct":true},{"id":"C","text":"The percentage of employees who pass annual probation","is_correct":false},{"id":"D","text":"The required offer acceptance rate for campus hiring","is_correct":false}]'::jsonb, 'B', 'Under EEOC guidelines, if the selection rate for a protected group is less than four-fifths (80%) of the rate for the group with the highest rate, adverse impact is indicated.', 1, 7),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'Which talent metric measures the total duration from job opening requisition approval to the day the final candidate accepts the written offer?', 'multiple_choice', '[{"id":"A","text":"Time to Productivity","is_correct":false},{"id":"B","text":"Time to Fill","is_correct":true},{"id":"C","text":"Time to Interview","is_correct":false},{"id":"D","text":"Sourcing Cycle Speed","is_correct":false}]'::jsonb, 'B', 'Time to Fill calculates the total calendar days from formal requisition approval until candidate offer acceptance.', 1, 8),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'In the Delphi technique for HR demand forecasting, what is the key characteristic of the panel?', 'multiple_choice', '[{"id":"A","text":"Experts meet face-to-face and debate loudly until consensus","is_correct":false},{"id":"B","text":"Independent, iterative anonymous questionnaires with aggregated feedback","is_correct":true},{"id":"C","text":"Algorithmic machine learning models replace human opinions entirely","is_correct":false},{"id":"D","text":"Decisions are made solely by the Chief Human Resources Officer","is_correct":false}]'::jsonb, 'B', 'The Delphi method relies on an iterative, anonymous survey of subject-matter experts to eliminate peer pressure and groupthink.', 1, 9),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is an internal talent marketplace?', 'multiple_choice', '[{"id":"A","text":"A public website where contractors sell services","is_correct":false},{"id":"B","text":"A platform allowing existing employees to discover gigs, project assignments, and transfers across the enterprise","is_correct":true},{"id":"C","text":"An auction platform for employee overtime shifts","is_correct":false},{"id":"D","text":"A procurement software for hiring temporary agency staff","is_correct":false}]'::jsonb, 'B', 'An internal talent marketplace matches existing organizational talent with internal opportunities, cross-functional projects, and role transitions.', 1, 10),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'Which document establishes the foundational rights of workers globally through international labor standards?', 'multiple_choice', '[{"id":"A","text":"The Sarbanes-Oxley Act","is_correct":false},{"id":"B","text":"The International Labour Organization (ILO) Conventions","is_correct":true},{"id":"C","text":"The Dodd-Frank Declaration","is_correct":false},{"id":"D","text":"The General Data Protection Regulation (GDPR)","is_correct":false}]'::jsonb, 'B', 'The ILO (a specialized agency of the UN) develops international labor conventions addressing fundamental rights at work.', 1, 11),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is the "Silver Medalist" candidate strategy in Talent Acquisition?', 'multiple_choice', '[{"id":"A","text":"Offering second-tier compensation packages to entry-level hires","is_correct":false},{"id":"B","text":"Proactively nurturing and reconsidering highly rated runner-up candidates from previous searches","is_correct":true},{"id":"C","text":"Hiring competitors'' second-in-command executives only","is_correct":false},{"id":"D","text":"Rewarding hiring managers who finish recruiting under budget","is_correct":false}]'::jsonb, 'B', 'Silver medalists are vetted, qualified finalists who were not selected for a specific role but remain exceptional prospects for future openings.', 1, 12),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'In workforce succession planning, what is the primary purpose of a 9-Box Grid?', 'multiple_choice', '[{"id":"A","text":"Allocating workspace seating arrangements","is_correct":false},{"id":"B","text":"Evaluating employees simultaneously on Performance (past delivery) and Potential (future growth capacity)","is_correct":true},{"id":"C","text":"Tracking weekly hours worked across nine job grades","is_correct":false},{"id":"D","text":"Designing nine tiers of healthcare benefits","is_correct":false}]'::jsonb, 'B', 'The 9-Box Grid plots employees on two axes: current performance and future leadership/growth potential.', 1, 13),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'How is Cost per Hire (CPH) calculated according to ISO and SHRM standards?', 'multiple_choice', '[{"id":"A","text":"Base Salary of Hire divided by 12 months","is_correct":false},{"id":"B","text":"(Sum of Internal Recruiting Costs + Sum of External Recruiting Costs) divided by Total Number of Hires","is_correct":true},{"id":"C","text":"Total HR Department Budget divided by Total Company Headcount","is_correct":false},{"id":"D","text":"Agency commission percentage multiplied by gross revenue","is_correct":false}]'::jsonb, 'B', 'CPH = (Internal Recruiting Costs + External Recruiting Costs) / Total Hires made within the period.', 1, 14),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'In modern structured onboarding, what is the primary focus of the first 30 days?', 'multiple_choice', '[{"id":"A","text":"Executing multi-million dollar strategy decisions without supervision","is_correct":false},{"id":"B","text":"Cultural immersion, role expectations alignment, compliance, and foundational tool access","is_correct":true},{"id":"C","text":"Conducting annual performance reviews","is_correct":false},{"id":"D","text":"Taking over organizational restructuring","is_correct":false}]'::jsonb, 'B', 'The first 30 days are designed for orientation, psychological safety, understanding team context, and mastering tools.', 1, 15),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is the "Halo Effect" in candidate evaluation?', 'multiple_choice', '[{"id":"A","text":"Scoring a candidate poorly due to a single perceived flaw","is_correct":false},{"id":"B","text":"Allowing one positive candidate trait (e.g., charisma, alma mater) to positively bias judgment across all competencies","is_correct":true},{"id":"C","text":"Systematically hiring only candidates who attended religious universities","is_correct":false},{"id":"D","text":"Giving every candidate the exact same high score","is_correct":false}]'::jsonb, 'B', 'The Halo Effect occurs when one striking positive characteristic blinds the evaluator to other weaknesses.', 1, 16),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'Which sourcing channel typically demonstrates the highest 1-year retention and fastest time-to-hire?', 'multiple_choice', '[{"id":"A","text":"Blind cold postal outreach","is_correct":false},{"id":"B","text":"Employee Referral Programs","is_correct":true},{"id":"C","text":"Generalist internet pop-up ads","is_correct":false},{"id":"D","text":"Unverified resume scraper databases","is_correct":false}]'::jsonb, 'B', 'Employee referrals consistently deliver higher cultural alignment, faster onboarding, and significantly higher 1-year retention rates.', 1, 17),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is the fundamental goal of Job Enrichment according to Herzberg''s Motivator-Hygiene Theory?', 'multiple_choice', '[{"id":"A","text":"Adding more mundane, repetitive tasks to a worker''s shift (Job Enlargement)","is_correct":false},{"id":"B","text":"Increasing autonomy, responsibility, depth, and opportunities for personal achievement in the job role","is_correct":true},{"id":"C","text":"Installing air conditioning and clean water fountains","is_correct":false},{"id":"D","text":"Eliminating all performance reviews","is_correct":false}]'::jsonb, 'B', 'Job Enrichment involves vertical loading of a role, granting greater discretion, responsibility, and cognitive engagement.', 1, 18),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What does the term "Offer Acceptance Rate" (OAR) gauge?', 'multiple_choice', '[{"id":"A","text":"The percentage of applied candidates who receive job offers","is_correct":false},{"id":"B","text":"The percentage of candidates extended a formal written offer who sign and accept","is_correct":true},{"id":"C","text":"The percentage of new hires who pass probation","is_correct":false},{"id":"D","text":"The ratio of job applicants to open requisitions","is_correct":false}]'::jsonb, 'B', 'OAR = (Accepted Job Offers / Total Offers Extended) * 100%, indicating competitiveness of offers and brand appeal.', 1, 19),
('e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', 'What is an Assessment Center in modern employee selection?', 'multiple_choice', '[{"id":"A","text":"A physical medical clinic for health checks","is_correct":false},{"id":"B","text":"A standardized multi-exercise evaluation featuring role-plays, in-basket exercises, and simulations evaluated by multiple trained observers","is_correct":true},{"id":"C","text":"An online typing speed test platform","is_correct":false},{"id":"D","text":"A payroll processing office","is_correct":false}]'::jsonb, 'B', 'An Assessment Center utilizes standardized behavioral simulations, presentations, and group exercises scored by calibrated assessors.', 1, 20),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In the WorldatWork Total Rewards Model, what are the five key foundational components?', 'multiple_choice', '[{"id":"A","text":"Rent, Utilities, Equipment, Hardware, Software","is_correct":false},{"id":"B","text":"Compensation, Benefits, Work-Life Well-being, Recognition, and Development/Career Opportunities","is_correct":true},{"id":"C","text":"Hiring, Onboarding, Probation, Dismissal, Severance","is_correct":false},{"id":"D","text":"Stocks, Bonds, Mutual Funds, Commodities, Crypto","is_correct":false}]'::jsonb, 'B', 'The WorldatWork framework identifies Compensation, Benefits, Work-Life, Recognition, and Development/Career Opportunities as total rewards.', 1, 1),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'If an employee earns an annual salary of $85,000 and the salary grade midpoint is $100,000, what is the employee''s compa-ratio?', 'multiple_choice', '[{"id":"A","text":"1.15","is_correct":false},{"id":"B","text":"0.85","is_correct":true},{"id":"C","text":"0.72","is_correct":false},{"id":"D","text":"1.00","is_correct":false}]'::jsonb, 'B', 'Compa-Ratio = Actual Salary / Range Midpoint = 85,000 / 100,000 = 0.85 (or 85%).', 1, 2),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What does a "Red-Circle Rate" represent in compensation management?', 'multiple_choice', '[{"id":"A","text":"An employee earning below the pay range minimum","is_correct":false},{"id":"B","text":"An employee whose current pay rate exceeds the maximum salary of their assigned pay grade","is_correct":true},{"id":"C","text":"An employee working for an unprofitable startup","is_correct":false},{"id":"D","text":"An employee due for a mandatory demotion","is_correct":false}]'::jsonb, 'B', 'A red-circle rate occurs when an employee''s pay is above the maximum established salary band for their position.', 1, 3),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What is the primary advantage of a Behaviorally Anchored Rating Scale (BARS) over standard graphic rating scales?', 'multiple_choice', '[{"id":"A","text":"BARS requires zero effort or training to build","is_correct":false},{"id":"B","text":"BARS anchors each rating point to observable, concrete behavioral examples, reducing supervisor subjectivity","is_correct":true},{"id":"C","text":"BARS automatically gives everyone top ratings","is_correct":false},{"id":"D","text":"BARS is strictly used for firing underperforming staff","is_correct":false}]'::jsonb, 'B', 'BARS pairs numerical scales with explicit behavioral descriptions of critical incidents, providing clear objective benchmarks.', 1, 4),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In goal-setting methodology, what does the ''M'' in SMART represent?', 'multiple_choice', '[{"id":"A","text":"Mandatory","is_correct":false},{"id":"B","text":"Measurable","is_correct":true},{"id":"C","text":"Motivational","is_correct":false},{"id":"D","text":"Multi-tiered","is_correct":false}]'::jsonb, 'B', 'SMART stands for Specific, Measurable, Achievable, Relevant, and Time-bound.', 1, 5),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In OKR methodology, what is considered an ideal average target achievement score on a 0.0 to 1.0 scale?', 'multiple_choice', '[{"id":"A","text":"Exactly 0.2","is_correct":false},{"id":"B","text":"Approximately 0.6 to 0.7","is_correct":true},{"id":"C","text":"Exactly 1.0 (100% every single time)","is_correct":false},{"id":"D","text":"Over 1.5","is_correct":false}]'::jsonb, 'B', 'In OKR frameworks, a score between 0.6 and 0.7 reflects an ambitious stretch target; consistently hitting 1.0 implies goals are insufficiently challenging.', 1, 6),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What cognitive evaluation error occurs when an appraiser rates an employee poorly on all competencies because of a single negative incident?', 'multiple_choice', '[{"id":"A","text":"Halo Effect","is_correct":false},{"id":"B","text":"Horns Effect","is_correct":true},{"id":"C","text":"Leniency Bias","is_correct":false},{"id":"D","text":"Central Tendency","is_correct":false}]'::jsonb, 'B', 'The Horns Effect is a cognitive bias where one perceived flaw or mistake negatively colors the evaluator''s entire judgment of the individual.', 1, 7),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In Kirkpatrick''s Four-Level Training Evaluation Model, what does Level 3 evaluate?', 'multiple_choice', '[{"id":"A","text":"Learner reaction and satisfaction with the coffee and room temperature","is_correct":false},{"id":"B","text":"Classroom knowledge retention via multiple choice quiz","is_correct":false},{"id":"C","text":"Behavior change and on-the-job transfer of learned skills","is_correct":true},{"id":"D","text":"Total corporate stock valuation increase","is_correct":false}]'::jsonb, 'C', 'Level 3 measures Behavior—specifically whether learners apply what they learned when returning to their actual work environment.', 1, 8),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What are the five phases of the ADDIE instructional design framework?', 'multiple_choice', '[{"id":"A","text":"Align, Determine, Direct, Inspect, Execute","is_correct":false},{"id":"B","text":"Analysis, Design, Development, Implementation, Evaluation","is_correct":true},{"id":"C","text":"Acquire, Define, Distribute, Instruct, Examine","is_correct":false},{"id":"D","text":"Assess, Draft, Demonstrate, Integrate, Evolve","is_correct":false}]'::jsonb, 'B', 'ADDIE stands for Analysis, Design, Development, Implementation, and Evaluation.', 1, 9),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'According to Malcolm Knowles'' Andragogy theory, which assumption is true regarding adult learners?', 'multiple_choice', '[{"id":"A","text":"Adults are strictly dependent learners who require rigid authoritarian direction","is_correct":false},{"id":"B","text":"Adults learn best when content is problem-centered and has immediate relevance to their job or life","is_correct":true},{"id":"C","text":"Adults have no prior experiences that can be used in the learning process","is_correct":false},{"id":"D","text":"Adults are purely motivated by external threats of punishment","is_correct":false}]'::jsonb, 'B', 'Adult learning theory posits that adults are self-directed, bring rich experience, and prefer problem-centered learning with immediate practical utility.', 1, 10),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'According to the 70-20-10 learning model, where does the majority (70%) of workplace capability development occur?', 'multiple_choice', '[{"id":"A","text":"In university lecture halls","is_correct":false},{"id":"B","text":"On-the-job experiential challenges and stretch assignments","is_correct":true},{"id":"C","text":"Through formal corporate compliance videos","is_correct":false},{"id":"D","text":"Reading trade textbooks at home","is_correct":false}]'::jsonb, 'B', '70% of learning occurs experientially through real job challenges; 20% through relationships and mentoring; 10% through formal courses.', 1, 11),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What does a "Green-Circle Rate" signify?', 'multiple_choice', '[{"id":"A","text":"An employee dedicated to environmental sustainability","is_correct":false},{"id":"B","text":"An employee whose compensation falls below the minimum established pay band for their grade","is_correct":true},{"id":"C","text":"An employee earning higher equity than base cash","is_correct":false},{"id":"D","text":"An employee who just completed a green belt certification","is_correct":false}]'::jsonb, 'B', 'A green-circle rate indicates an employee paid below the salary range minimum, requiring an upward adjustment to maintain internal equity.', 1, 12),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In 360-degree feedback systems, what is the best recommended application of the survey results?', 'multiple_choice', '[{"id":"A","text":"Sole criteria for determining immediate termination","is_correct":false},{"id":"B","text":"Professional development, self-awareness, and leadership coaching","is_correct":true},{"id":"C","text":"Calculating the exact annual bonus percentage down to the penny","is_correct":false},{"id":"D","text":"Publicly posting results on the company bulletin board","is_correct":false}]'::jsonb, 'B', '360-degree feedback is most effective for developmental growth, identifying blind spots, and coaching, rather than high-stakes compensation decisions.', 1, 13),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'How is the Phillips ROI of a training initiative calculated?', 'multiple_choice', '[{"id":"A","text":"(Total Training Days / Total Number of Attendees) * 100","is_correct":false},{"id":"B","text":"[(Net Financial Benefits - Total Program Costs) / Total Program Costs] * 100%","is_correct":true},{"id":"C","text":"Total Tuition Fees paid / Current Annual Revenue","is_correct":false},{"id":"D","text":"Number of Slides Created / Number of Quizzes Passed","is_correct":false}]'::jsonb, 'B', 'Phillips Level 5 ROI = [(Net Benefits - Costs) / Costs] * 100%, expressing the monetary return generated per dollar invested.', 1, 14),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What is the primary purpose of a Performance Calibration session?', 'multiple_choice', '[{"id":"A","text":"Deciding on office furniture allocations","is_correct":false},{"id":"B","text":"Harmonizing rating distributions across departments to ensure fairness, eliminate grading bias, and establish common standards","is_correct":true},{"id":"C","text":"Calculating individual hourly overtime rates","is_correct":false},{"id":"D","text":"Administering personality test re-takes","is_correct":false}]'::jsonb, 'B', 'Calibration brings managers together to discuss and normalize proposed ratings, ensuring equal standards across teams.', 1, 15),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What is the typical vesting schedule structure for corporate Restricted Stock Units (RSUs)?', 'multiple_choice', '[{"id":"A","text":"100% vesting on Day 1 of employment","is_correct":false},{"id":"B","text":"4-year vesting schedule with a 1-year cliff (25% after year 1, remainder vesting monthly or quarterly over years 2-4)","is_correct":true},{"id":"C","text":"RSUs never vest until the company dissolves","is_correct":false},{"id":"D","text":"RSUs vest only upon the CEO''s retirement","is_correct":false}]'::jsonb, 'B', 'The standard corporate equity schedule is a 4-year vesting timeline with a 12-month cliff for the initial 25%.', 1, 16),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'In the Point-Factor Method of job evaluation, what is a "Compensable Factor"?', 'multiple_choice', '[{"id":"A","text":"A variable that increases employee healthcare premiums","is_correct":false},{"id":"B","text":"A specific job dimension (e.g., skill, effort, responsibility, working conditions) for which an employer is willing to pay","is_correct":true},{"id":"C","text":"A tax deduction claimed by corporate finance","is_correct":false},{"id":"D","text":"A disciplinary penalty deduction","is_correct":false}]'::jsonb, 'B', 'Compensable factors are fundamental dimensions (skills, responsibilities, effort) that an organization values and compensates.', 1, 17),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What is a "Cafeteria Plan" (IRS Section 125) in employee benefits administration?', 'multiple_choice', '[{"id":"A","text":"A mandatory lunch buffet provided in the company cafeteria","is_correct":false},{"id":"B","text":"A flexible benefit plan allowing employees to choose between taxable cash and a menu of pre-tax qualified benefits","is_correct":true},{"id":"C","text":"A catering discount program for sales meetings","is_correct":false},{"id":"D","text":"A culinary training program for hospitality workers","is_correct":false}]'::jsonb, 'B', 'Section 125 cafeteria plans permit employees to pick tailored pre-tax benefits (healthcare, dependent care FSAs) from a qualified menu.', 1, 18),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What should be the first step when designing a workplace training initiative in the ADDIE model?', 'multiple_choice', '[{"id":"A","text":"Purchasing expensive VR headsets","is_correct":false},{"id":"B","text":"Conducting a Training Needs Assessment (Organizational, Task, and Person Analysis)","is_correct":true},{"id":"C","text":"Writing the final multiple-choice exam","is_correct":false},{"id":"D","text":"Booking an offsite conference venue","is_correct":false}]'::jsonb, 'B', 'The Analysis phase of ADDIE requires diagnosing the root cause of the performance issue via a thorough Needs Assessment before designing content.', 1, 19),
('e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', 'What is the key legal and management requirement when administering a Performance Improvement Plan (PIP)?', 'multiple_choice', '[{"id":"A","text":"PIPs must always be completely verbal with no written records","is_correct":false},{"id":"B","text":"PIPs must document clear performance shortfalls, quantifiable goals, support resources, timelines, and consequences of non-completion","is_correct":true},{"id":"C","text":"PIPs must never exceed 48 hours in duration","is_correct":false},{"id":"D","text":"Managers must not provide feedback during the PIP period","is_correct":false}]'::jsonb, 'B', 'Legally defensible and effective PIPs provide concrete documentation of deficits, explicit goals, employer support, clear review intervals, and transparent outcomes.', 1, 20) ON CONFLICT DO NOTHING;
