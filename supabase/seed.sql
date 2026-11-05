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
