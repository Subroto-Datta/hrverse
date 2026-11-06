const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'], {
  auth: { autoRefreshToken: false, persistSession: false },
});

// =========================================================================
// VISUAL COURSEWORK BUILDERS
// =========================================================================

function buildDay1Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 1: Introduction to Human Resource Management', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '5 Pillars', label: 'Foundational HR Activities', badge: 'Core' },
          { value: '4 Objectives', label: 'Organizational, Functional, Personal, Societal' },
          { value: '100+ Bed', label: 'Hospital Operations Focus' },
          { value: '3–4 Hours', label: 'Recommended Study Time', badge: 'Day 1' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Coursework Objective',
        quote: 'Understand what Human Resource Management is, why organisations need it, what HR professionals actually do on a daily basis, and how HR directly contributes to institutional success.',
        author: 'CHRMP Foundational Standard',
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 1: Understanding Human Resource Management (HRM)', level: 2 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Human Resource Management (HRM) is the strategic process of managing people within an organisation to achieve business objectives while ensuring employee satisfaction, professional development, and well-being. Unlike machines or capital assets, human beings have emotional needs, personal ambitions, and changing motivations, making people management a specialized organizational science.',
      },
    },
    {
      type: 'department_map',
      data: {
        title: 'Hospital Department Staffing Architecture',
        departments: [
          { name: 'Medical Department', roles: 'Specialist Doctors & Surgeons', headcount: 15, focus: 'Clinical Diagnosis & Surgery', compliance: 'NMC / Medical Council' },
          { name: 'Nursing Department', roles: 'ICU & Ward Registered Nurses', headcount: 30, focus: '24/7 Patient Care & Medication', compliance: 'State Nursing Council' },
          { name: 'Biomedical Department', roles: 'Biomedical Engineers', headcount: 5, focus: 'ICU & Dialysis Equipment Maintenance', compliance: 'NABH Safety Standards' },
          { name: 'Laboratory & Diagnostics', roles: 'Lab Technicians & Pathologists', headcount: 10, focus: 'Blood & Pathology Tests', compliance: 'NABL Certification' },
          { name: 'Pharmacy', roles: 'Registered Pharmacists', headcount: 8, focus: 'Medication Dispensing', compliance: 'Pharmacy Council' },
          { name: 'Administration & HR', roles: 'HR Executives & Floor Managers', headcount: 17, focus: 'Rostering, Billing & Compliance', compliance: 'Labor & Hospital Bylaws' },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'The 5 Foundational Pillars of HRM', level: 3 },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The Five Foundational Activities of People Management',
        subtitle: 'HR responsibility extends across the complete professional journey from entry to departure.',
        steps: [
          {
            step: 1,
            title: 'Acquiring',
            subtitle: 'Attracting and hiring suitable employees',
            description: 'Workforce planning, job descriptions, sourcing candidates through specialized portals, screening technical resumes, and conducting STAR structured interviews.',
            keyAction: 'Ensure vacancies are filled with qualified individuals who fit organizational values and departmental staffing quotas.',
            badge: 'Stage 1',
          },
          {
            step: 2,
            title: 'Developing',
            subtitle: 'Enhancing employee knowledge and clinical/technical skills',
            description: 'Designing orientation programs, statutory hospital safety workshops, equipment SOP refreshers, and leadership mentoring.',
            keyAction: 'Continuously upgrade competencies to meet technological changes and accreditation standards.',
            badge: 'Stage 2',
          },
          {
            step: 3,
            title: 'Motivating',
            subtitle: 'Inspiring engagement, commitment, and high morale',
            description: 'Employee recognition schemes, clear performance milestones, supportive leadership channels, and psychological workplace safety.',
            keyAction: 'Prevent operational fatigue, emotional burnout, and disengagement through recognition and fair work conditions.',
            badge: 'Stage 3',
          },
          {
            step: 4,
            title: 'Compensating',
            subtitle: 'Providing fair salaries, benefits, and statutory allowances',
            description: 'Structuring pay grades, market benchmarking, timely payroll execution, provident fund (PF), ESI, and shift differential allowances.',
            keyAction: 'Maintain external market competitiveness while ensuring internal compensation equity across similar roles.',
            badge: 'Stage 4',
          },
          {
            step: 5,
            title: 'Retaining',
            subtitle: 'Encouraging valued professionals to remain long-term',
            description: 'Career progression pathways, conflict resolution, equitable workload distribution, and addressing underlying turnover drivers.',
            keyAction: 'Lower attrition costs: replacing a specialized hospital nurse or engineer costs 50%–150% of their annual salary in lost productivity.',
            badge: 'Stage 5',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 2: The Four Major Objectives of HRM', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'The Four Pillars of HR Objectives',
        subtitle: 'Frequently tested in HR certifications and leadership interviews.',
        items: [
          {
            title: '1. Organisational',
            badge: 'Business Goals',
            focus: 'Achieving Enterprise Success',
            mindset: 'Workforce alignment to organizational strategy and revenue goals.',
            keyDifferences: [
              'Maintaining appropriate staffing ratios across shifts',
              'Improving employee productivity and operational output',
              'Minimizing costly unplanned staff turnover',
            ],
            hospitalExample: 'Recruiting 10 qualified ICU nurses so the hospital can open a new 20-bed critical care wing on schedule.',
          },
          {
            title: '2. Functional',
            badge: 'HR Operations',
            focus: 'Operational Department Excellence',
            mindset: 'Running HR processes seamlessly, accurately, and punctually.',
            keyDifferences: [
              'Flawless payroll and attendance computation',
              'Speedy candidate response and onboarding',
              'Accurate employee records and compliance files',
            ],
            hospitalExample: 'Processing monthly attendance and shift overtime calculations on time without payroll disputes.',
          },
          {
            title: '3. Personal & Societal',
            badge: 'Ethics & Wellbeing',
            focus: 'Individual Growth & Social Ethics',
            mindset: 'Fulfilling individual career ambitions while maintaining ethical statutory employment standards.',
            keyDifferences: [
              'Equal employment opportunities and anti-discrimination',
              'Safe, harassment-free workplace (POSH compliance)',
              'Career growth ladders and skill training access',
            ],
            hospitalExample: 'Providing Biomedical Engineers technical OEM equipment training and ensuring zero discrimination in promotion decisions.',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 3 & 4: Evolution of HRM & Core Distinctions', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'Evolutionary Trajectory: Personnel Management vs HRM vs Strategic HRM',
        subtitle: 'How people management transformed from a clerical desk into a strategic leadership driver.',
        items: [
          {
            title: 'Personnel Management',
            badge: 'Traditional (1950s–1980s)',
            focus: 'Clerical & Reactive',
            mindset: 'Employees are viewed as labor costs or operational overhead.',
            keyDifferences: [
              'Heavy focus on rule enforcement and attendance punch cards',
              'Reactive response to employee disputes and union negotiations',
              'Separate, isolated department with zero boardroom presence',
            ],
            hospitalExample: 'Maintaining paper attendance registers and penalizing nurses who arrive 5 minutes late.',
          },
          {
            title: 'Human Resource Mgmt (HRM)',
            badge: 'Modern (1980s–2000s)',
            focus: 'Developmental & Proactive',
            mindset: 'Employees are valued organizational assets worthy of investment.',
            keyDifferences: [
              'Focus on training, motivation, and career development',
              'Proactive conflict management and performance appraisal systems',
              'Integration of company goals with employee personal aspirations',
            ],
            hospitalExample: 'Conducting structured onboarding, annual appraisals, and sponsoring nurses for specialized ICU certifications.',
          },
          {
            title: 'Strategic HRM (SHRM)',
            badge: 'Contemporary (Current)',
            focus: 'Enterprise Partnership',
            mindset: 'Workforce strategy is directly linked to executive business strategy.',
            keyDifferences: [
              'Predictive workforce planning and talent analytics',
              'HR leaders co-architect business decisions with the CEO/Board',
              'Focus on competitive market differentiation and talent brand',
            ],
            hospitalExample: 'Forecasting healthcare demand 3 years ahead and building an in-house Biomedical Engineering apprenticeship academy.',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Knowledge Check: Strategic vs Administrative HR Response',
        scenario: 'A 100-bed hospital is experiencing an alarming 28% annual nurse attrition rate in the critical care ward. Exit notes cite extreme shift exhaustion.',
        options: [
          'Administrative response: Post continuous job ads on portals to replace leavers as fast as possible.',
          'Personnel response: Issue warning memos to nurses demanding strict commitment to roster schedules.',
          'Strategic HRM response: Conduct diagnostic stay-interviews, analyze nurse-patient ratios, implement rotational rest protocols, and benchmark market pay.',
          'Ignore the attrition since nursing turnover is natural across all healthcare institutions.',
        ],
        correctOptionIndex: 2,
        explanation: 'Strategic HRM treats retention systematically: diagnosing root burnout causes (workload ratios, shift schedules), correcting underlying structural flaws, and monitoring metrics.',
        mentorTip: 'Always remember: Replacing employees is reactive. Resolving the systemic drivers of turnover is strategic HR management.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 1 Practical Assignment: Healthcare Workforce Mapping',
        durationMinutes: 45,
        objective: 'Demonstrate applied understanding of HRM definitions, objectives, and departmental staffing architecture for a hospital.',
        tasks: [
          'Task 1: Define Human Resource Management in your own words (avoid textbook regurgitation).',
          'Task 2: Select a 100-bed hospital scenario and list 5 distinct departments with their required personnel and core operational challenges.',
          'Task 3: For each of the 4 HRM objectives (Organisational, Functional, Personal, Societal), write one concrete real-world example from a hospital environment.',
          'Task 4: Explain why treating employees as "strategic assets" rather than "cost burdens" changes how an HR Manager handles shift rosters.',
        ],
        submissionFormat: 'Written report (1.5–2 pages) in Google Docs or PDF for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 1 Self-Mastery Checklist',
        subtitle: 'Confirm that you have understood each foundational concept before proceeding to Day 2.',
        items: [
          'I can define Human Resource Management clearly in my own words.',
          'I can explain the 5 foundational pillars: Acquiring, Developing, Motivating, Compensating, and Retaining.',
          'I can differentiate between Organisational, Functional, Personal, and Societal HR objectives.',
          'I understand how Personnel Management evolved into HRM and Strategic HRM.',
          'I can map hospital departments to clinical and non-clinical workforce requirements.',
          'I have completed the Day 1 practical assignment for mentor evaluation.',
        ],
      },
    },
  ];
}

function buildDay2Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 2: HR Department Structure, Roles and Responsibilities', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '3 Core Personas', label: 'Generalist vs Specialist vs HRBP', badge: 'Key Concept' },
          { value: '1:60 to 1:100', label: 'HR to Employee Benchmark Ratio' },
          { value: '5 Divisions', label: 'TA, Ops, C&B, L&D, ER' },
          { value: '3–4 Hours', label: 'Estimated Study Time', badge: 'Day 2' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Mentor Guidance',
        quote: 'Pay particular attention to the difference between an HR Manager, HR Generalist, and HR Specialist. These titles are often confused by beginners, but their scope of authority and daily deliverables are entirely distinct.',
        author: 'HR Leadership Competency Model',
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 1: Functional Divisions of an HR Department', level: 2 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Depending on organizational scale, the HR department is structured into dedicated operational divisions. In a 50-person clinic, one HR professional handles everything. In a 100- to 500-employee hospital, specialized functional pillars emerge to ensure clinical quality, regulatory compliance, and uninterrupted service delivery.',
      },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The 5 Functional Pillars of an Established HR Department',
        subtitle: 'How responsibilities are divided in medium-to-large institutions.',
        steps: [
          {
            step: 1,
            title: 'Talent Acquisition (Recruitment)',
            subtitle: 'Sourcing, screening, and hiring',
            description: 'Focuses on job descriptions, sourcing doctors, nurses, and technicians, primary source credential verification, and negotiating employment offers.',
            keyAction: 'Reduce Time to Fill and Cost per Hire while increasing Quality of Hire.',
            badge: 'Division 1',
          },
          {
            step: 2,
            title: 'HR Operations & Compliance',
            subtitle: 'Records, contracts, and daily administrative rhythm',
            description: 'Maintains employee files, background check records, biometric attendance systems, leave administration, and statutory labor filings.',
            keyAction: 'Ensure 100% compliance with NABH, Factories Act, Maternity Benefit Act, and PF/ESI laws.',
            badge: 'Division 2',
          },
          {
            step: 3,
            title: 'Compensation & Benefits (C&B)',
            subtitle: 'Payroll, rewards, and incentive architecture',
            description: 'Structures wage bands, night-shift allowances, medical insurance packages, performance bonus incentives, and monthly salary disbursement.',
            keyAction: 'Maintain external market competitiveness while ensuring internal equity between comparable roles.',
            badge: 'Division 3',
          },
          {
            step: 4,
            title: 'Learning & Development (L&D)',
            subtitle: 'Skill enhancement and capability building',
            description: 'Coordinates technical equipment training, emergency protocol drills, soft-skills communication for front-desk staff, and mandatory hospital certifications.',
            keyAction: 'Close workforce capability gaps to meet clinical accreditations and patient safety protocols.',
            badge: 'Division 4',
          },
          {
            step: 5,
            title: 'Employee Relations & Engagement (ER)',
            subtitle: 'Workplace culture, dispute resolution, and retention',
            description: 'Handles employee grievances, investigates harassment allegations under POSH, mediates supervisor-staff conflicts, and monitors workplace climate.',
            keyAction: 'Protect institutional trust, psychological safety, and lower preventable attrition.',
            badge: 'Division 5',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 2: Deciphering HR Roles & Personas', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'HR Generalist vs HR Specialist vs HR Business Partner (HRBP)',
        subtitle: 'Understanding what each professional actually executes day-to-day.',
        items: [
          {
            title: 'HR Generalist',
            badge: 'Broad Breadth',
            focus: 'End-to-End Operational Execution',
            mindset: 'Jack-of-all-trades handling multiple operational functions across the lifecycle.',
            keyDifferences: [
              'Coordinates recruitment, onboarding, leave, attendance, and basic grievances',
              'Reports to HR Manager; acts as primary contact for daily staff queries',
              'Common in small-to-mid sized organizations (50–150 employees)',
            ],
            hospitalExample: 'A single Generalist manages onboarding for new lab technicians, processes monthly biometric leave, and drafts employment contracts.',
          },
          {
            title: 'HR Specialist',
            badge: 'Deep Expertise',
            focus: 'Domain-Specific Mastery',
            mindset: 'Subject matter expert focused purely on one complex HR domain.',
            keyDifferences: [
              'Specialized depth (e.g. Talent Acquisition Specialist, Payroll Specialist)',
              'Designs frameworks, benchmarks compensation, or optimizes applicant tracking systems',
              'Found in larger hospitals, multi-chain facilities, and enterprise organizations',
            ],
            hospitalExample: 'A Healthcare Recruiter who exclusively sources, screens, and verifies credentials for Specialized Surgeons and ICU Nurses.',
          },
          {
            title: 'HR Business Partner (HRBP)',
            badge: 'Strategic Alignment',
            focus: 'Departmental Strategy & Retention',
            mindset: 'Embedded strategic consultant bridging executive leadership with departmental workforce needs.',
            keyDifferences: [
              'Partners directly with Department Heads (e.g., Medical Superintendent, Nursing Director)',
              'Analyzes attrition trends, succession planning, and clinical team restructurings',
              'Minimal transactional paperwork; high-level strategic problem solver',
            ],
            hospitalExample: 'Collaborating with the Head of Surgery to design rotational shift incentives that cut surgeon turnover by 40%.',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Scenario Matcher: Assigning the Correct HR Professional',
        scenario: 'Two registered nurses complain confidentially that their shift supervisor systematically assigns them unfair night shifts and displays personal hostility.',
        options: [
          'Assign to the Payroll Specialist to deduct the supervisor\'s pay.',
          'Assign to the Employee Relations Specialist or HR Generalist to conduct a confidential grievance investigation and review shift roster objectivity.',
          'Assign to the Talent Acquisition Recruiter to immediately hire replacement nurses.',
          'Tell the nurses that HR only deals with hiring, not supervisor interpersonal conflicts.',
        ],
        correctOptionIndex: 1,
        explanation: 'Workplace disputes, roster favoritism, and interpersonal complaints fall squarely under Employee Relations (ER) or the HR Generalist in charge of staff welfare.',
        mentorTip: 'Never dismiss a grievance as "routine tension". Unresolved supervisor bias is the #1 recorded driver of hospital staff resignations.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 2 Practical Assignment: Department Architecture Design',
        durationMinutes: 45,
        objective: 'Construct an organizational chart and role profiles for an expanding 100-employee hospital.',
        tasks: [
          'Task 1: Design an HR Department Organizational Chart for a 100-employee hospital (specify reporting lines from HR Manager down to Executives).',
          'Task 2: Write a 1-page Job Description for an "HR Generalist" in a hospital (include Job Title, Reporting, Key Responsibilities, Required Educational Background, and Skills).',
          'Task 3: Explain in 3 concise paragraphs why a 100-employee hospital needs an HR Generalist rather than hiring 4 separate specialized HR specialists.',
        ],
        submissionFormat: 'Org chart diagram + Written Job Description in Word/PDF for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 2 Self-Mastery Checklist',
        subtitle: 'Verify your mastery of HR department structures.',
        items: [
          'I can differentiate between HR Generalist, HR Specialist, and HRBP.',
          'I understand the 5 functional divisions of an HR department.',
          'I know the reporting hierarchy from HR Executive to Head of HR.',
          'I can draft a comprehensive Job Description for an HR Generalist.',
          'I understand how HR department structure scales from 50 to 500 employees.',
        ],
      },
    },
  ];
}

function buildDay3Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 3: Employee Lifecycle Management (Attraction to Separation)', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '7 Stages', label: 'Full Lifecycle Journey', badge: 'Framework' },
          { value: '90 Days', label: 'Critical Assimilation Window' },
          { value: '3–4 Hours', label: 'Estimated Study Time', badge: 'Day 3' },
          { value: '100% Risk', label: 'Mitigated by Proper Offboarding' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Lifecycle Principle',
        quote: 'Make sure you understand the complete employee journey rather than memorising seven disconnected stages. A good HR professional sees how an error in Recruitment directly causes a disaster in Onboarding and early Separation.',
        author: 'CHRMP Practical Framework',
      },
    },
    {
      type: 'header',
      data: { text: 'The 7 Stages of the Employee Lifecycle', level: 2 },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The Seven Evolutionary Stages of an Employee Journey',
        subtitle: 'Navigate each phase from initial candidate attraction through dignified offboarding.',
        steps: [
          {
            step: 1,
            title: 'Attraction (Employer Branding)',
            subtitle: 'Becoming an employer of choice before vacancies occur',
            description: 'Building hospital reputation, showcasing workplace culture, fair compensation perception, and medical research opportunities.',
            keyAction: 'Ensure top clinical talent considers your institution first when seeking career progression.',
            badge: 'Stage 1',
          },
          {
            step: 2,
            title: 'Recruitment & Selection',
            subtitle: 'Identifying, interviewing, and selecting the right candidates',
            description: 'Job postings, ATS resume screening, behavioral STAR interviews, technical trade tests with department heads, and credential verification.',
            keyAction: 'Validate both technical competence (medical licenses, equipment proficiency) and culture alignment.',
            badge: 'Stage 2',
          },
          {
            step: 3,
            title: 'Onboarding & Induction',
            subtitle: 'Assimilation into the organization and role',
            description: 'Day 1 welcome, statutory paperwork, hospital IT access, safety & fire drills, introducing team mentors, and setting 30-60-90 day performance goals.',
            keyAction: 'Bridge the critical gap between hiring and full autonomous productivity.',
            badge: 'Stage 3',
          },
          {
            step: 4,
            title: 'Development & Learning',
            subtitle: 'Continuous growth and technical upskilling',
            description: 'On-the-job training, OEM biomedical equipment workshops, infection prevention protocols, and leadership grooming.',
            keyAction: 'Keep employee skills aligned with advancing medical technology and accreditation standards.',
            badge: 'Stage 4',
          },
          {
            step: 5,
            title: 'Retention & Engagement',
            subtitle: 'Maintaining satisfaction, loyalty, and morale',
            description: 'Work-life balance initiatives, fair shift rotation schedules, competitive pay adjustments, recognition programs, and open grievance channels.',
            keyAction: 'Lower unwanted turnover: high employee engagement directly drives higher patient satisfaction scores.',
            badge: 'Stage 5',
          },
          {
            step: 6,
            title: 'Performance Management',
            subtitle: 'Evaluating and optimizing employee contributions',
            description: 'Regular check-ins, objective KPI reviews, multi-rater feedback, constructive performance improvement plans (PIPs), and merit promotions.',
            keyAction: 'Differentiate high performers while supporting struggling employees with clear, measurable coaching.',
            badge: 'Stage 6',
          },
          {
            step: 7,
            title: 'Separation & Offboarding',
            subtitle: 'Dignified exit and administrative transition',
            description: 'Resignation acceptance, notice period coordination, knowledge handover, asset retrieval (IDs, equipment keys), exit interview, and Full & Final (F&F) settlement.',
            keyAction: 'Diagnose the real reasons behind departures through exit interviews while maintaining positive alumni goodwill.',
            badge: 'Stage 7',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'Critical Deep-Dive: Onboarding vs Orientation', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'Orientation vs Onboarding: Why Beginners Confuse Them',
        subtitle: 'Orientation is a single administrative event; Onboarding is a comprehensive 90-day assimilation program.',
        items: [
          {
            title: 'Orientation',
            badge: 'Single Event (Day 1)',
            focus: 'Administrative Formalities',
            mindset: 'Completing paperwork, issuing ID badges, and explaining basic rules.',
            keyDifferences: [
              'Duration: 1–2 days max',
              'Activities: Filling PF/ESI forms, hospital tour, signing code of conduct',
              'Outcome: Employee has an ID card and knows where the cafeteria is',
            ],
            hospitalExample: 'Handing a new Biomedical Engineer their hospital access badge and emergency exit map.',
          },
          {
            title: 'Onboarding',
            badge: 'Strategic Journey (90 Days)',
            focus: 'Full Professional Assimilation',
            mindset: 'Integrating the new hire into the team, workflow, and technical tools until fully productive.',
            keyDifferences: [
              'Duration: 30 to 90 continuous days',
              'Activities: Pairing with senior mentor, technical SOP training, weekly check-ins',
              'Outcome: Employee operates with full clinical confidence and high job satisfaction',
            ],
            hospitalExample: 'Pairing the Biomedical Engineer with a Senior Specialist for 30 days to calibrate ICU ventilators before assigning solo night shifts.',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Lifecycle Case Simulator: Preventing Early Resignation',
        scenario: 'A newly recruited Lab Technician resigns after just 18 days on the job, complaining they were left alone with complex diagnostic machinery without any SOP training or senior guidance.',
        options: [
          'Blame the recruiter for hiring someone with low resilience.',
          'Blame the employee and deduct their notice period pay.',
          'Recognize this as a catastrophic failure of Stage 3 (Onboarding & Induction) and institute a mandatory 30-day paired mentor program.',
          'Eliminate laboratory training because it costs too much time.',
        ],
        correctOptionIndex: 2,
        explanation: 'Over 40% of early employee turnover occurs within the first 90 days due to inadequate onboarding, role ambiguity, and lack of mentor support.',
        mentorTip: 'A structured onboarding checklist is not bureaucracy; it is the single most effective insurance policy against early turnover.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 3 Practical Assignment: Biomedical Engineer Onboarding Blueprint',
        durationMinutes: 45,
        objective: 'Construct a comprehensive 30-day onboarding checklist for a technical healthcare position.',
        tasks: [
          'Task 1: Draw a flowchart showing the 7 stages of the employee lifecycle for a hospital employee.',
          'Task 2: Design a detailed "30-Day Onboarding Checklist" for a newly recruited Biomedical Engineer (divided into Day 1, Week 1, Month 1 milestones).',
          'Task 3: Draft 5 essential questions that HR must ask during an Exit Interview when a valued nurse decides to resign.',
        ],
        submissionFormat: 'Flowchart diagram + Onboarding Checklist table in Word/PDF for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 3 Self-Mastery Checklist',
        subtitle: 'Ensure you understand the full employee lifecycle.',
        items: [
          'I can list the 7 stages of the employee lifecycle in precise chronological order.',
          'I understand the difference between Day 1 Orientation and 90-Day Onboarding.',
          'I can build an operational 30-day onboarding checklist for a technical employee.',
          'I know how to conduct a structured exit interview during Stage 7 (Separation).',
          'I understand how failures in early stages trigger premature resignations.',
        ],
      },
    },
  ];
}

function buildDay4Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 4: HR Policies, Workplace Rules, Culture & Code of Conduct', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '4 Layers', label: 'Policy, Procedure, Rule, Guideline', badge: 'Governance' },
          { value: '8 Essential', label: 'Mandatory Hospital Policies' },
          { value: '100% POSH', label: 'Zero Tolerance Compliance' },
          { value: '3–4 Hours', label: 'Estimated Study Time', badge: 'Day 4' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Professional Standard',
        quote: 'HR is not simply about hiring and organizing office events. A substantial part of the profession involves maintaining structure, handling sensitive information with absolute confidentiality, enforcing fair policies, and protecting organizational integrity.',
        author: 'HR Governance Principles',
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 1: Policy vs Procedure vs Rule vs Guideline', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'The Hierarchy of Organizational HR Governance',
        subtitle: 'Understanding the legal and administrative distinctions between governance documents.',
        items: [
          {
            title: '1. Policy',
            badge: 'Organizational Intent',
            focus: 'Broad Principles & Values',
            mindset: 'High-level statement of what the organization commits to achieving.',
            keyDifferences: [
              'Approved by Board of Directors / CEO',
              'Rarely changes; reflects company philosophy and legal stance',
              'Answers: "WHAT is our stance on this matter?"',
            ],
            hospitalExample: 'Attendance & Leave Policy: "The hospital commits to 24/7 patient safety by requiring punctuality while supporting employee health."',
          },
          {
            title: '2. Procedure',
            badge: 'Operational Steps',
            focus: 'Sequential Implementation',
            mindset: 'The exact step-by-step path required to execute the policy.',
            keyDifferences: [
              'Standard Operating Procedure (SOP) with forms and timelines',
              'Outlines who submits what, to whom, and within how many hours',
              'Answers: "HOW do we implement this policy step-by-step?"',
            ],
            hospitalExample: 'Leave Application Procedure: "1) Log into HRMS; 2) Submit request 72 hours prior; 3) Department Head approves within 24 hours."',
          },
          {
            title: '3. Rule & Guideline',
            badge: 'Directives vs Advice',
            focus: 'Enforcement vs Best Practice',
            mindset: 'Rules are mandatory directives with penalties; Guidelines are recommended advice.',
            keyDifferences: [
              'Rule: Non-negotiable mandatory directive with strict disciplinary consequences',
              'Guideline: Suggested flexible recommendation to improve efficiency',
              'Rule answers: "MUST DO"; Guideline answers: "SHOULD PREFER"',
            ],
            hospitalExample: 'Rule: "Wearing sterile scrubs in ICU is mandatory; violation leads to immediate suspension." Guideline: "Employees are encouraged to take a 10-minute walk during lunch."',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 2: Mandatory Hospital HR Policies', level: 2 },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The Core HR Policy Suite Required in Healthcare',
        subtitle: 'Ensuring patient safety, ethical standards, and legal compliance.',
        steps: [
          {
            step: 1,
            title: 'Attendance, Shift & Leave Policy',
            subtitle: 'Punctuality, shift swapping protocols, earned/sick leave rules',
            description: 'Defines grace periods, biometric attendance logs, overtime compensation, advance notice for planned leave, and consequences of unexcused absence.',
            keyAction: 'Ensures clinical wards are never understaffed due to unexpected absences.',
            badge: 'Policy 1',
          },
          {
            step: 2,
            title: 'Workplace Code of Conduct & Ethics',
            subtitle: 'Professional integrity, patient dignity, and conflict of interest',
            description: 'Defines acceptable professional behavior, respectful communication, non-acceptance of patient gifts/bribes, and dress code standards.',
            keyAction: 'Protects hospital institutional credibility and ethical standing.',
            badge: 'Policy 2',
          },
          {
            step: 3,
            title: 'Data Privacy & Strict Confidentiality',
            subtitle: 'Protecting patient records and colleague salary information',
            description: 'Absolute non-disclosure of patient diagnoses, medical charts, internal compensation data, and disciplinary files.',
            keyAction: 'Violation of patient privacy carries criminal medical liability and regulatory license revocation.',
            badge: 'Policy 3',
          },
          {
            step: 4,
            title: 'Prevention of Sexual Harassment (POSH)',
            subtitle: 'Zero-tolerance safety and statutory Internal Committee (ICC)',
            description: 'Statutory mandate under Indian law (POSH Act 2013). Outlines clear definition of unwelcome conduct, formal complaint mechanism, and impartial enquiry.',
            keyAction: 'Guarantees a safe, respectful workplace for all employees, especially female night-shift clinical staff.',
            badge: 'Policy 4',
          },
          {
            step: 5,
            title: 'Disciplinary & Grievance Policy',
            subtitle: 'Natural justice, fair hearings, and progressive warnings',
            description: 'Progressive discipline framework: 1) Verbal coaching; 2) Written show-cause notice; 3) Inquiry hearing; 4) Suspension or termination for gross misconduct.',
            keyAction: 'Protects the organization from wrongful termination lawsuits through documented due process.',
            badge: 'Policy 5',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Ethical Dilemma: Confidentiality & Discipline',
        scenario: 'An HR Executive discovers from payroll records that a friend working in the Biomedical department earns less than a newly hired colleague in the same role. She tells her friend the salary number.',
        options: [
          'This is fine because pay transparency helps employees negotiate better salaries.',
          'This is a grave breach of HR confidentiality, violating organizational policy and ethical employment obligations; the HR Executive faces formal disciplinary action.',
          'HR should immediately increase the friend\'s salary to match without informing management.',
          'Tell the Biomedical Engineer to confront their supervisor immediately.',
        ],
        correctOptionIndex: 1,
        explanation: 'Confidentiality is an absolute cornerstone of the HR profession. Unauthorized disclosure of private compensation records destroys departmental trust and violates employment contracts.',
        mentorTip: 'If you cannot maintain strict confidentiality with sensitive financial, medical, and grievance records, you cannot succeed as an HR professional.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 4 Practical Assignment: Drafting a Hospital Leave Policy',
        durationMinutes: 45,
        objective: 'Draft your first genuine, legally sound HR policy document.',
        tasks: [
          'Task 1: Draft a complete 2-page "Attendance and Leave Policy" for a 100-employee hospital.',
          'Include sections: Policy Title, Scope, Objectives, Types of Leave (Casual, Sick, Earned/Privilege, Maternity), Application Procedure, Late Arrival Grace Period, and Consequences of Absenteeism without Prior Notice.',
          'Task 2: Write a 1-page Code of Conduct clause addressing "Patient Confidentiality and Social Media Usage" for hospital staff.',
        ],
        submissionFormat: 'Formal HR Policy Document in Word/PDF for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 4 Self-Mastery Checklist',
        subtitle: 'Confirm your grasp of organizational governance.',
        items: [
          'I understand the distinction between Policy, Procedure, Rule, and Guideline.',
          'I can draft a structured, professional HR policy document from scratch.',
          'I understand why confidentiality is non-negotiable for HR practitioners.',
          'I know the core components of the POSH framework and ICC constitution.',
          'I understand progressive discipline and fair due-process inquiry procedures.',
        ],
      },
    },
  ];
}

function buildDay5Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 5: Strategic HRM, Workforce Planning & HR Metrics', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '4 Live Calculators', label: 'Interactive Numerical Tools', badge: 'Practical' },
          { value: '<12%', label: 'Target Healthcare Attrition' },
          { value: '>85%', label: 'Target Offer Acceptance' },
          { value: '3–4 Hours', label: 'Estimated Study Time', badge: 'Day 5' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Strategic HR Principle',
        quote: 'Strategic HR speaks the language of the CEO and Board: metrics, financial impact, workload modeling, and workforce forecasting. If you cannot quantify your talent bottlenecks, you cannot lead strategic decisions.',
        author: 'Workforce Analytics Blueprint',
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 1: Interactive HR Metric Calculators', level: 2 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Experiment with the four interactive calculators below. Adjust the sliders and input values to see real-time formula calculations, benchmark status alerts, and operational guidance.',
      },
    },
    {
      type: 'calculator',
      data: {
        calculatorType: 'attrition_rate',
        title: 'Interactive Calculator 1: Attrition Rate Analyzer',
        description: 'Calculate employee turnover percentage using average headcount over a specific time period.',
        defaultValues: { opening: 150, closing: 130, leavers: 25 },
      },
    },
    {
      type: 'calculator',
      data: {
        calculatorType: 'workforce_gap',
        title: 'Interactive Calculator 2: Workforce Gap & Staffing Analyzer',
        description: 'Compare projected workforce demand against available internal supply to identify staffing shortages or surpluses.',
        defaultValues: { demand: 60, supply: 52 },
      },
    },
    {
      type: 'calculator',
      data: {
        calculatorType: 'cost_per_hire',
        title: 'Interactive Calculator 3: Cost per Hire (CPH) Calculator',
        description: 'Measure total recruitment expenditure divided by number of successfully joined candidates.',
        defaultValues: { cost: 120000, hires: 8 },
      },
    },
    {
      type: 'calculator',
      data: {
        calculatorType: 'offer_acceptance',
        title: 'Interactive Calculator 4: Offer Acceptance Rate Analyzer',
        description: 'Evaluate candidate drop-off between extended formal offers and accepted positions.',
        defaultValues: { offersExtended: 50, offersAccepted: 35 },
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 2: Strategic Workforce Planning Architecture', level: 2 },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The 4-Step Strategic Workforce Planning Framework',
        subtitle: 'Ensuring the organisation has the right number of people with the right skills at the right time.',
        steps: [
          {
            step: 1,
            title: 'Strategic Analysis',
            subtitle: 'Understanding business growth plans and hospital expansion',
            description: 'Reviewing hospital executive expansion targets (e.g., adding a 30-bed oncology unit or opening a second clinic branch in 6 months).',
            keyAction: 'Identify future capability requirements before talent shortages occur.',
            badge: 'Step 1',
          },
          {
            step: 2,
            title: 'Workforce Demand Forecasting',
            subtitle: 'Predicting how many employees will be needed',
            description: 'Using Ratio Analysis (e.g., 1 Nurse per 5 general beds, 1 Nurse per 1 ICU bed) and Trend Analysis based on historical workload.',
            keyAction: 'Calculate future required headcount by department and clinical specialty.',
            badge: 'Step 2',
          },
          {
            step: 3,
            title: 'Workforce Supply Forecasting',
            subtitle: 'Estimating how many current employees will remain available',
            description: 'Analyzing expected retirements, historical attrition buffers, promotion readiness, and internal transfers.',
            keyAction: 'Determine realistic internal talent availability before turning to external sourcing.',
            badge: 'Step 3',
          },
          {
            step: 4,
            title: 'Gap Analysis & Action Plan',
            subtitle: 'Workforce Demand minus Workforce Supply',
            description: 'If Demand exceeds Supply (Deficit): initiate targeted recruitment and overtime. If Supply exceeds Demand (Surplus): redeploy staff or freeze hiring.',
            keyAction: 'Execute talent acquisition pipelines 60–90 days ahead of new wing inaugurations.',
            badge: 'Step 4',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Numerical Checkpoint: Hospital Attrition Calculation',
        scenario: 'A hospital begins the financial year with 200 staff members. During the year, 30 staff members leave, and 50 new staff are recruited, ending the year with 220 staff members. What is the annual attrition rate?',
        options: [
          '15.00%',
          '14.28% (Average headcount = (200 + 220) / 2 = 210. Rate = (30 / 210) * 100 = 14.28%)',
          '25.00%',
          '13.63%',
        ],
        correctOptionIndex: 1,
        explanation: 'Always calculate using Average Headcount: (200 + 220) ÷ 2 = 210. Attrition Rate = (30 leavers ÷ 210) × 100 = 14.285% ≈ 14.28%.',
        mentorTip: 'Never calculate attrition using opening headcount alone; using average headcount accounts for mid-year workforce growth.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 5 Practical Assignment: Quantitative HR Metrics Report',
        durationMinutes: 45,
        objective: 'Solve quantitative workforce metrics and interpret their business implications.',
        tasks: [
          'Task 1: Solve the 4 numerical problems (Attrition Rate, Workforce Gap, Cost per Hire, Offer Acceptance Rate) showing step-by-step formula workings.',
          'Task 2: A hospital extended 50 job offers but only 35 were accepted (70% acceptance). Write 3 concrete recommendations for the HR Director to improve offer acceptance to 85%.',
          'Task 3: Explain the financial cost of losing a Biomedical Engineer when replacement cost is estimated at ₹1,50,000.',
        ],
        submissionFormat: 'Calculations spreadsheet or written PDF with formulas for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 5 Self-Mastery Checklist',
        subtitle: 'Confirm your mathematical and strategic metrics proficiency.',
        items: [
          'I can calculate Attrition Rate accurately using Average Headcount.',
          'I can calculate Workforce Gap (Demand - Supply) and interpret Deficit vs Surplus.',
          'I can calculate Cost per Hire and identify recruitment expenditure components.',
          'I can calculate Offer Acceptance Rate and analyze candidate drop-off causes.',
          'I understand the 4-step Strategic Workforce Planning model.',
        ],
      },
    },
  ];
}

function buildDay6Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 6: Healthcare HR Management: Hospital Staffing & Shifts', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '24/7/365', label: 'Continuous Healthcare Operations', badge: 'Critical' },
          { value: '3 Rotas', label: 'Morning, Evening, Night Shifts' },
          { value: '100% PSV', label: 'Primary Source Credential Verification' },
          { value: '3–4 Hours', label: 'Estimated Study Time', badge: 'Day 6' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Healthcare HR Standard',
        quote: 'In corporate HR, a hiring mistake causes financial loss. In hospital HR, an uncredentialed nurse or fatigued biomedical engineer can cost a patient their life. The stakes in healthcare HR are existential.',
        author: 'NABH Healthcare Quality Standard',
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 1: Clinical vs Non-Clinical Workforce Architecture', level: 2 },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: 'The Dual Nature of Hospital Workforce Management',
        subtitle: 'Balancing specialized clinical licensing with general operational support.',
        items: [
          {
            title: 'Clinical Personnel',
            badge: 'Direct Patient Care',
            focus: 'Medical & Technical Care',
            mindset: 'Governed by statutory medical councils, clinical licenses, and patient safety protocols.',
            keyDifferences: [
              'Roles: Surgeons, Resident Doctors, ICU Nurses, Biomedical Engineers, Lab Techs',
              'Mandatory Primary Source Credential Verification (MCI, State Nursing Council)',
              'Subject to medical malpractice liability and strict patient-to-nurse ratios',
            ],
            hospitalExample: 'Verifying that a newly hired ICU Nurse holds an active state nursing registration certificate before roster assignment.',
          },
          {
            title: 'Non-Clinical Personnel',
            badge: 'Operational Support',
            focus: 'Hospital Administration & Facilities',
            mindset: 'Ensures the hospital infrastructure, billing, and logistical engine functions seamlessly.',
            keyDifferences: [
              'Roles: Hospital Administrators, Billing Clerks, Housekeeping, Security, HR, IT',
              'Governed by standard labor laws, service standards, and operational SOPs',
              'Focuses on patient admission speed, hygiene compliance, and facility uptime',
            ],
            hospitalExample: 'Ensuring round-the-clock housekeeping coverage in emergency wards to maintain sterile infection control standards.',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'TOPIC 2: 24/7 Rotational Shift Rostering Protocols', level: 2 },
    },
    {
      type: 'process_steps',
      data: {
        title: 'The 4-Step Rotational Shift Management Architecture',
        subtitle: 'Preventing clinical fatigue and maintaining continuous patient safety coverage.',
        steps: [
          {
            step: 1,
            title: 'Establish Shift Ratios & Bands',
            subtitle: 'Standard 8-hour healthcare operational shifts',
            description: 'Morning Shift (7:00 AM – 3:30 PM), Evening Shift (3:00 PM – 11:30 PM), Night Shift (11:00 PM – 7:30 AM), and General Shift (9:00 AM – 5:30 PM for admin).',
            keyAction: 'Schedule mandatory 30-minute overlaps for clinical handovers between outgoing and incoming teams.',
            badge: 'Shift Design',
          },
          {
            step: 2,
            title: 'Enforce Patient-to-Staff Safety Ratios',
            subtitle: 'NABH & international patient care standards',
            description: 'Intensive Care Unit (ICU): 1 Nurse per 1–2 Patients. High Dependency Unit (HDU): 1 Nurse per 3–4 Patients. General Ward: 1 Nurse per 5–6 Patients.',
            keyAction: 'Never compromise ICU ratios; understaffing directly increases hospital mortality rates.',
            badge: 'Ratios',
          },
          {
            step: 3,
            title: 'Rotational Rest Intervals & Fair Night Shifts',
            subtitle: 'Combating fatigue-induced medical errors',
            description: 'Ensure staff rotate equitably between night and day shifts. Enforce a minimum mandatory 16-hour rest interval following a night shift block.',
            keyAction: 'Ban continuous 24-hour shifts; fatigue causes 70% of medication administration errors.',
            badge: 'Rest Rules',
          },
          {
            step: 4,
            title: 'Emergency Reliever Allocation',
            subtitle: 'Maintaining buffer capacity for sudden sick leaves',
            description: 'Keep a pre-scheduled 10%–15% reliever pool on standby to cover sudden sickness or emergency surges.',
            keyAction: 'Avoid calling exhausted off-duty nurses to cover back-to-back night shifts.',
            badge: 'Buffer Pool',
          },
        ],
      },
    },
    {
      type: 'checkpoint',
      data: {
        question: 'Healthcare Staffing Simulation: Credential Verification',
        scenario: 'A private hospital urgently needs two Biomedical Engineers to service dialysis and ICU ventilator units. A candidate with impressive resume credentials offers to join immediately, but claims their university degree certificate will take 3 weeks to arrive from another state.',
        options: [
          'Allow them to service ICU ventilators immediately because the hospital is short-staffed.',
          'Issue an immediate unconditional appointment letter and skip credential verification.',
          'Issue a conditional offer letter, but restrict them from touching critical life-support machinery until primary source verification of engineering credentials and equipment certifications is formally confirmed.',
          'Reject the candidate without checking their reference letters.',
        ],
        correctOptionIndex: 2,
        explanation: 'In healthcare, primary source credential verification is non-negotiable. Allowing unverified personnel to maintain ICU life-support equipment creates catastrophic malpractice liability.',
        mentorTip: 'Never let urgent hiring pressure override patient safety verification protocols.',
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Day 6 Practical Assignment: Hospital Shift Roster & Verification Protocol',
        durationMinutes: 45,
        objective: 'Construct a weekly shift roster for 30 nurses and build a clinical credential verification checklist.',
        tasks: [
          'Task 1: Design a 7-day rotational shift schedule (Morning, Evening, Night, Off) for 30 nurses across a 50-bed general ward and a 10-bed ICU.',
          'Task 2: Build a 7-point "Primary Source Credential Verification Checklist" for newly hired Doctors, Nurses, and Biomedical Engineers.',
          'Task 3: Explain the role of HR during an NABH hospital accreditation audit.',
        ],
        submissionFormat: 'Shift Roster Excel/Word table + Verification Checklist in PDF for Mentor Review.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Day 6 Self-Mastery Checklist',
        subtitle: 'Confirm your healthcare HR domain expertise.',
        items: [
          'I understand the distinction between Clinical and Non-Clinical hospital personnel.',
          'I know standard patient-to-nurse ratios (ICU 1:1, General Ward 1:5).',
          'I can build a 3-shift rotational roster with mandatory handover intervals.',
          'I understand primary source credential verification (NMC, Nursing Council, OEM).',
          'I know mandatory NABH accreditation human resource compliance standards.',
        ],
      },
    },
  ];
}

function buildDay7Blocks() {
  return [
    {
      type: 'header',
      data: { text: 'DAY 7: Comprehensive Revision, Practical Test & Capstone Project', level: 1 },
    },
    {
      type: 'stats',
      data: {
        stats: [
          { value: '50 Marks', label: 'Comprehensive Weekly Exam', badge: 'Day 7 Exam' },
          { value: '35/50 (70%)', label: 'Passing Requirement' },
          { value: '100 Staff', label: 'Hospital Capstone Project' },
          { value: '7 Deliverables', label: 'Executive Portfolio', badge: 'Capstone' },
        ],
      },
    },
    {
      type: 'takeaway',
      data: {
        tag: 'Week 1 Milestone',
        quote: 'You have completed the foundational principles of human resource management, organizational structuring, employee lifecycle, HR policies, workforce metrics, and healthcare operations. Day 7 consolidates this knowledge into an executive capstone project.',
        author: 'Lead Faculty & Mentorship Board',
      },
    },
    {
      type: 'header',
      data: { text: 'PART 1: 10-Point Revision Knowledge Check', level: 2 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'Review the ten practical workplace situations below. For each situation, test your ability to instantly identify the appropriate HR division, policy, or operational intervention.',
      },
    },
    {
      type: 'comparison_matrix',
      data: {
        title: '10 Essential Workplace Situations & Corresponding HR Functions',
        subtitle: 'Quick reference matrix for foundational HR operations.',
        items: [
          {
            title: 'Staffing & Influx',
            badge: 'Acquisition & Onboarding',
            focus: 'Filling Vacancies & Induction',
            mindset: 'Recruitment & Onboarding',
            keyDifferences: [
              'Hospital needs 5 new staff → Recruitment / Talent Acquisition',
              'New nurse arrives on Day 1 → Structured Onboarding & Induction',
              'Opening a new dialysis wing in 6 months → Strategic Workforce Planning',
            ],
            hospitalExample: 'Executing candidate screening and 30-day paired onboarding.',
          },
          {
            title: 'Workplace Harmony',
            badge: 'Relations & Compliance',
            focus: 'Disputes, Grievances & Attendance',
            mindset: 'Employee Relations & HR Ops',
            keyDifferences: [
              'Nurse reports unfair supervisor treatment → Employee Relations investigation',
              'Biometric punch error on night shift → HR Operations / Attendance correction',
              'Salary calculation dispute → Payroll / Compensation & Benefits',
            ],
            hospitalExample: 'Maintaining neutral, documented, and confidential dispute resolution.',
          },
          {
            title: 'Growth & Departure',
            badge: 'Development & Retention',
            focus: 'Upskilling, Reviews & Offboarding',
            mindset: 'L&D, Performance & Separation',
            keyDifferences: [
              'Biomedical engineers need ventilator SOP training → Learning & Development',
              'High nurse turnover in emergency ward → Retention Management & Stay Interviews',
              'Staff member resigns → Separation Management & Exit Interview',
            ],
            hospitalExample: 'Closing capability gaps and analyzing exit feedback to improve retention.',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'PART 2: Week 1 50-Mark Comprehensive Examination Guide', level: 2 },
    },
    {
      type: 'process_steps',
      data: {
        title: '50-Mark Weekly Assessment Structure (Passing Score: 35/50 = 70%)',
        subtitle: 'Take this official exam under the "Quizzes" section on your student navigation bar.',
        steps: [
          {
            step: 'Sec A',
            title: 'Section A: HR Fundamentals (10 Marks)',
            subtitle: 'Q1 to Q3 (4 pts + 3 pts + 3 pts)',
            description: 'HRM definition, 5 foundational pillars, Personnel Management vs HRM vs Strategic HRM, and HR Generalist vs Specialist distinctions.',
            keyAction: 'Demonstrate theoretical clarity and operational definitions.',
            badge: '10 Marks',
          },
          {
            step: 'Sec B',
            title: 'Section B: Employee Lifecycle & Policies (10 Marks)',
            subtitle: 'Q4 to Q6 (4 pts + 3 pts + 3 pts)',
            description: 'Chronological 7 stages of employee lifecycle, Policy vs Procedure vs Rule vs Guideline, and ethical imperative of HR confidentiality.',
            keyAction: 'Apply governance and lifecycle principles to hospital environments.',
            badge: '10 Marks',
          },
          {
            step: 'Sec C',
            title: 'Section C: Strategic HRM & Numerical Formulas (10 Marks)',
            subtitle: 'Q7 to Q10 (3 pts + 2 pts + 2 pts + 3 pts)',
            description: 'Step-by-step formula math: Attrition Rate (using average headcount), Workforce Gap analysis, Cost per Hire, and Offer Acceptance Rate.',
            keyAction: 'Ensure zero mathematical errors; show exact formula logic.',
            badge: '10 Marks',
          },
          {
            step: 'Sec D',
            title: 'Section D: Healthcare HR Management (10 Marks)',
            subtitle: 'Q11 to Q13 (5 pts + 2 pts + 3 pts)',
            description: 'Hospital HR responsibilities, Primary Source Credential Verification protocols, 24/7 rotational shift rosters, and patient-to-nurse ratios.',
            keyAction: 'Demonstrate understanding of NABH quality and clinical patient safety requirements.',
            badge: '10 Marks',
          },
          {
            step: 'Sec E',
            title: 'Section E: Situational Judgement & Case Studies (10 Marks)',
            subtitle: 'Q14 to Q16 (3 pts + 3 pts + 4 pts)',
            description: 'Urgent recruitment strategy for 2 Biomedical Engineers, confidential supervisor grievance inquiry, and a 3-step systemic strategy to curb high nurse turnover.',
            keyAction: 'Provide practical, professional managerial decisions.',
            badge: '10 Marks',
          },
        ],
      },
    },
    {
      type: 'header',
      data: { text: 'PART 3: Capstone Project: 100-Employee Hospital HR Framework', level: 2 },
    },
    {
      type: 'department_map',
      data: {
        title: 'Capstone Scenario: 100-Employee Hospital Department Breakdown',
        departments: [
          { name: 'Nursing Department', roles: '30 Registered Nurses', headcount: 30, focus: 'ICU, Wards & ER', compliance: 'State Nursing Council' },
          { name: 'Medical Department', roles: '15 Full-Time Doctors & Consultants', headcount: 15, focus: 'Clinical Consultations & Surgery', compliance: 'NMC / Medical Council' },
          { name: 'Biomedical Department', roles: '5 Biomedical Engineers (2 Vacancies)', headcount: 5, focus: 'Dialysis & ICU Equipment Uptime', compliance: 'NABH Safety Standards' },
          { name: 'Laboratory & Pathology', roles: '10 Lab Technicians', headcount: 10, focus: 'Diagnostics & Blood Bank', compliance: 'NABL Certification' },
          { name: 'Pharmacy', roles: '8 Pharmacists', headcount: 8, focus: 'Medication Dispensing', compliance: 'Pharmacy Council' },
          { name: 'Administration & HR', roles: '12 Admin Staff + 5 HR Executives', headcount: 17, focus: 'Billing, Rostering & Records', compliance: 'Hospital Bylaws' },
          { name: 'Housekeeping & Facilities', roles: '10 Housekeeping Staff', headcount: 10, focus: 'Sterility & Infection Control', compliance: 'Infection Prevention' },
          { name: 'Finance & Accounts', roles: '5 Accountants', headcount: 5, focus: 'Cash Flow & Vendor Billing', compliance: 'Statutory Audit' },
        ],
      },
    },
    {
      type: 'assignment',
      data: {
        title: 'Capstone Project: The 7 Core Deliverables (Expected Length: 8–12 Pages)',
        durationMinutes: 180,
        objective: 'Construct a complete, production-grade HR Operations Framework for this 100-employee hospital addressing its 6 operational issues.',
        tasks: [
          'Deliverable 1: HR Department Organisational Chart showing reporting hierarchy for the 5 HR personnel.',
          'Deliverable 2: Complete Employee Lifecycle Framework flowchart from attraction to exit.',
          'Deliverable 3: 8-Point HR Policy Framework table outlining policy name, scope, and core rule.',
          'Deliverable 4: Biomedical Engineer Recruitment Plan for the 2 vacant positions (channels, screening, STAR interview questions, verification).',
          'Deliverable 5: 30-Day Onboarding Checklist for newly recruited Biomedical Engineers.',
          'Deliverable 6: Root-Cause Remediation Plan addressing the hospital\'s 6 operational challenges.',
          'Deliverable 7: 5-Metric HR Dashboard with formulas, target benchmarks, and review frequency.',
        ],
        submissionFormat: 'Word/PDF Report + Excel Calculations to be submitted under the "Projects" tab for Faculty Evaluation.',
      },
    },
    {
      type: 'checklist',
      data: {
        title: 'Week 1 Final Graduation Readiness Checklist',
        subtitle: 'Review your complete readiness before beginning Week 2 (Talent Acquisition & Selection Systems).',
        items: [
          'I have studied all daily materials from Day 1 through Day 6.',
          'I have achieved at least 35/50 (70%) on the Week 1 Comprehensive Quiz.',
          'I have constructed the 7 deliverables for the 100-Employee Hospital Capstone Project.',
          'I understand workforce calculations (Attrition, Cost per hire, Gap, Offer acceptance).',
          'I understand healthcare HR compliance, shift rotas, and credential verification.',
          'I am prepared to advance to Week 2: Talent Acquisition and Predictive Selection Systems.',
        ],
      },
    },
  ];
}

async function run() {
  console.log('=== Transforming All 7 Days into Visual Coursework ===');

  const days = [
    { id: 'd1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 1: Introduction to Human Resource Management', fn: buildDay1Blocks },
    { id: 'd1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 2: HR Department Structure, Roles & Responsibilities', fn: buildDay2Blocks },
    { id: 'd1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 3: Employee Lifecycle Management (Attraction to Separation)', fn: buildDay3Blocks },
    { id: 'd1b2c3d4-0007-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 4: HR Policies, Workplace Rules, Culture & Code of Conduct', fn: buildDay4Blocks },
    { id: 'd1b2c3d4-0008-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 5: Strategic HRM, Workforce Planning & HR Metrics', fn: buildDay5Blocks },
    { id: 'd1b2c3d4-0009-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 6: Healthcare HR Management: Hospital Staffing & Shifts', fn: buildDay6Blocks },
    { id: 'd1b2c3d4-0010-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 7: Comprehensive Revision, Practical Test & Capstone Project', fn: buildDay7Blocks },
  ];

  for (const day of days) {
    const blocks = day.fn();
    const { error } = await supabase
      .from('lessons')
      .update({
        content: { blocks },
        updated_at: new Date().toISOString(),
      })
      .eq('id', day.id);

    if (error) {
      console.error(`Error updating ${day.title}:`, error);
      throw error;
    }
    console.log(`  ✓ Transformed ${day.title} (${blocks.length} interactive visual coursework blocks)`);
  }

  console.log('=== All 7 Days Successfully Transformed into Visual Coursework! ===');
}

run().catch((err) => {
  console.error('Transformation failed:', err);
  process.exit(1);
});

