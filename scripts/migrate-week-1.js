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

// Parser for text to JSONB blocks
function parseDayTextToBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentParagraph = [];
  let currentList = [];
  let listStyle = null;
  let currentTable = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const pText = currentParagraph.join(' ').trim();
      if (pText) {
        blocks.push({ type: 'paragraph', data: { text: pText } });
      }
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({
        type: 'list',
        data: { style: listStyle || 'bullet', items: currentList },
      });
      currentList = [];
      listStyle = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      if (currentTable.length >= 2) {
        const headers = currentTable[0];
        const rows = currentTable.slice(1);
        blocks.push({
          type: 'table',
          data: { headers, rows },
        });
      } else {
        for (const row of currentTable) {
          blocks.push({
            type: 'paragraph',
            data: { text: row.join(' | ') },
          });
        }
      }
      currentTable = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    // Check for tab-separated table
    if (rawLine.includes('\t')) {
      const cols = rawLine.split('\t').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        flushParagraph();
        flushList();
        currentTable.push(cols);
        continue;
      }
    }

    if (currentTable.length > 0) {
      flushTable();
    }

    // Main Day Header (Level 1)
    if (/^DAY\s+\d+\s*[-–]/i.test(line) && !/ASSIGNMENT|ASSESSMENT|CHECKLIST/i.test(line)) {
      flushAll();
      blocks.push({ type: 'header', data: { text: line, level: 1 } });
      continue;
    }

    // Major Sections (Level 2)
    if (/^(TOPIC\s+\d+|PART\s+\d+|DAY\s+\d+\s+(ASSIGNMENT|ASSESSMENT|COMPLETION CHECKLIST|PRACTICAL ASSIGNMENTS)|SECTION\s+[A-Z])/i.test(line)) {
      flushAll();
      blocks.push({ type: 'header', data: { text: line, level: 2 } });
      continue;
    }

    // Sub-topic numbered headers (Level 3)
    if (/^\d+\.\d+\s+[A-Z]/.test(line)) {
      flushAll();
      blocks.push({ type: 'header', data: { text: line, level: 3 } });
      continue;
    }

    // Callout boxes
    if (/^(Important:|Note:|Remember:|Mentor's instruction:|Mentor's recommendation:)/i.test(line)) {
      flushAll();
      const colonIdx = line.indexOf(':');
      const title = line.substring(0, colonIdx).trim();
      const text = line.substring(colonIdx + 1).trim() || line;
      blocks.push({
        type: 'callout',
        data: { title, text, type: 'info' },
      });
      continue;
    }

    // Practical examples / scenarios
    if (/^(Practical example:|Scenario:|Practical Scenario:)/i.test(line)) {
      flushAll();
      blocks.push({
        type: 'callout',
        data: { title: line, text: '', type: 'info' },
      });
      continue;
    }

    // Unordered bullet list
    const bulletMatch = line.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      flushParagraph();
      flushTable();
      if (listStyle !== 'bullet') {
        flushList();
        listStyle = 'bullet';
      }
      currentList.push(bulletMatch[1]);
      continue;
    }

    // Ordered list
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch && !/^\d+\.\d+/.test(line)) {
      flushParagraph();
      flushTable();
      if (listStyle !== 'ordered') {
        flushList();
        listStyle = 'ordered';
      }
      currentList.push(numMatch[2]);
      continue;
    }

    // Append to list if wrapped
    if (currentList.length > 0 && !/^[A-Z0-9]/.test(line)) {
      currentList[currentList.length - 1] += ' ' + line;
      continue;
    } else if (currentList.length > 0) {
      flushList();
    }

    currentParagraph.push(line);
  }

  flushAll();
  return blocks;
}

async function runMigration() {
  console.log('--- Starting Week 1 Curriculum Migration ---');

  // 1. Get Course and Module 1
  const { data: module1, error: modErr } = await supabase
    .from('modules')
    .select('id, course_id')
    .eq('order_index', 1)
    .single();

  if (modErr || !module1) {
    throw new Error('Module 1 not found: ' + (modErr?.message || ''));
  }

  const courseId = module1.course_id;
  const module1Id = module1.id;

  // 2. Update Module 1 title and description
  console.log('1. Updating Module 1 metadata...');
  const { error: modUpdErr } = await supabase
    .from('modules')
    .update({
      title: 'Week 1: HR Fundamentals & Healthcare Operations Prep',
      description: '7-day intensive foundational human resource management curriculum covering core HRM principles, organizational architecture, full employee lifecycle, policy frameworks, workforce planning metrics, healthcare HR operations, and a 100-employee hospital capstone mini-project.',
      updated_at: new Date().toISOString(),
    })
    .eq('id', module1Id);

  if (modUpdErr) throw modUpdErr;

  // 3. Upsert the 3 Parts
  console.log('2. Configuring 3 structured parts...');
  const part1Id = 'c1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d';
  const part2Id = 'c1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d';
  const part3Id = 'c1b2c3d4-0007-7a8b-9c0d-1e2f3a4b5c6d';

  const partsToUpsert = [
    {
      id: part1Id,
      module_id: module1Id,
      title: 'Part 1: HR Foundations & Organizational Architecture',
      order_index: 1,
    },
    {
      id: part2Id,
      module_id: module1Id,
      title: 'Part 2: Lifecycle Management, Policies & Strategic Metrics',
      order_index: 2,
    },
    {
      id: part3Id,
      module_id: module1Id,
      title: 'Part 3: Healthcare HR Operations & Weekly Capstone',
      order_index: 3,
    },
  ];

  for (const part of partsToUpsert) {
    const { error: partErr } = await supabase.from('parts').upsert(part);
    if (partErr) throw partErr;
  }

  // 4. Read each of the 7 Days and parse into lessons
  console.log('3. Ingesting and updating 7 Day Lessons...');
  const dayFiles = [
    {
      id: 'd1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part1Id,
      order_index: 1,
      file: 'DAY_01_INTRODUCTION_TO_HRM.txt',
      title: 'Day 1: Introduction to Human Resource Management',
      slug: 'day-1-introduction-to-hrm',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part1Id,
      order_index: 2,
      file: 'DAY_02_HR_DEPARTMENT_STRUCTURE.txt',
      title: 'Day 2: HR Department Structure, Roles & Responsibilities',
      slug: 'day-2-hr-department-structure-roles',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part2Id,
      order_index: 1,
      file: 'DAY_03_EMPLOYEE_LIFECYCLE.txt',
      title: 'Day 3: Employee Lifecycle Management (Attraction to Separation)',
      slug: 'day-3-employee-lifecycle-management',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0007-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part2Id,
      order_index: 2,
      file: 'DAY_04_HR_POLICIES_CULTURE.txt',
      title: 'Day 4: HR Policies, Workplace Rules, Culture & Code of Conduct',
      slug: 'day-4-hr-policies-rules-culture',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0008-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part2Id,
      order_index: 3,
      file: 'DAY_05_STRATEGIC_HRM_PLANNING.txt',
      title: 'Day 5: Strategic HRM, Workforce Planning & HR Metrics',
      slug: 'day-5-strategic-hrm-workforce-planning-metrics',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0009-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part3Id,
      order_index: 1,
      file: 'DAY_06_HEALTHCARE_HR.txt',
      title: 'Day 6: Healthcare HR Management: Hospital Staffing & Shifts',
      slug: 'day-6-healthcare-hr-hospital-staffing',
      duration: 210,
    },
    {
      id: 'd1b2c3d4-0010-7a8b-9c0d-1e2f3a4b5c6d',
      part_id: part3Id,
      order_index: 2,
      file: 'DAY_07_REVISION_ASSESSMENT.txt',
      title: 'Day 7: Comprehensive Revision, Practical Test & Capstone Project',
      slug: 'day-7-comprehensive-revision-assessment-capstone',
      duration: 240,
    },
  ];

  const contentBase = path.join(__dirname, '..', 'reference-content', 'WEEK_01_NEW');

  for (const day of dayFiles) {
    const raw = fs.readFileSync(path.join(contentBase, day.file), 'utf8');
    const blocks = parseDayTextToBlocks(raw);

    const lessonData = {
      id: day.id,
      part_id: day.part_id,
      title: day.title,
      slug: day.slug,
      content: { blocks },
      estimated_minutes: day.duration,
      order_index: day.order_index,
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    const { error: lessErr } = await supabase.from('lessons').upsert(lessonData);
    if (lessErr) {
      console.error(`Error saving lesson ${day.title}:`, lessErr);
      throw lessErr;
    }
    console.log(`  ✓ Ingested ${day.title} (${blocks.length} blocks)`);
  }

  // 5. Update Week 1 Quiz metadata
  console.log('4. Updating Week 1 Quiz metadata...');
  const quizId = 'e1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d';
  const { error: qUpdErr } = await supabase
    .from('quizzes')
    .update({
      title: 'Week 1 Comprehensive Assessment: HR Fundamentals & Healthcare Operations',
      description: '50-mark comprehensive weekly evaluation across HR fundamentals, employee lifecycle, strategic formulas, healthcare HR, and practical situational judgment. Passing requirement: 35/50 (70%).',
      passing_score: 70,
      time_limit_minutes: 75,
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', quizId);

  if (qUpdErr) throw qUpdErr;

  // 6. Delete old questions for Week 1 Quiz and insert the 16 Comprehensive Exam Questions (50 Total Points)
  console.log('5. Replacing quiz questions with 50-mark comprehensive assessment...');
  await supabase.from('quiz_questions').delete().eq('quiz_id', quizId);

  const comprehensiveQuestions = [
    // SECTION A – HR Fundamentals (10 Marks)
    {
      quiz_id: quizId,
      order_index: 1,
      question_type: 'multiple_choice',
      points: 4,
      question_text: 'Define Human Resource Management (HRM) and identify the primary five foundational activities involved in managing human resources.',
      options: [
        { id: 'A', text: 'Marketing, Accounting, Sales, Inventory Control, and Distribution' },
        { id: 'B', text: 'Acquiring, Developing, Motivating, Compensating, and Retaining employees aligned with organizational goals' },
        { id: 'C', text: 'Payroll computation, Legal documentation, Union negotiations, and Disciplinary actions only' },
        { id: 'D', text: 'Hiring candidates and terminating underperforming staff without ongoing engagement' },
      ],
      correct_answer: 'B',
      explanation: 'HRM is the systematic approach to Acquiring, Developing, Motivating, Compensating, and Retaining employees while aligning individual contributions with organizational objectives.',
    },
    {
      quiz_id: quizId,
      order_index: 2,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'What represents the key evolution from Personnel Management to Strategic HRM (SHRM)?',
      options: [
        { id: 'A', text: 'Personnel management handled strategy, while SHRM focuses purely on attendance logs' },
        { id: 'B', text: 'Personnel management was administrative and reactive; HRM emphasized employee development; SHRM directly aligns workforce strategy with long-term business goals' },
        { id: 'C', text: 'Personnel management eliminated all labour law requirements while SHRM introduced them' },
        { id: 'D', text: 'There is no functional or strategic difference between the three terms' },
      ],
      correct_answer: 'B',
      explanation: 'Personnel management was traditional, compliance-driven, and reactive. HRM treated people as developmental assets. SHRM elevates HR into an indispensable business partner aligned with enterprise strategy.',
    },
    {
      quiz_id: quizId,
      order_index: 3,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'Which best differentiates an HR Generalist from an HR Specialist?',
      options: [
        { id: 'A', text: 'An HR Generalist handles broad responsibilities across recruitment, payroll, and relations, whereas an HR Specialist has deep expertise in a specific niche like Compensation & Benefits' },
        { id: 'B', text: 'An HR Generalist only handles legal court disputes, while a Specialist manages employee birthdays' },
        { id: 'C', text: 'HR Generalists work exclusively in hospitals, while Specialists work in IT companies' },
        { id: 'D', text: 'Generalists report directly to the CEO, while Specialists report to union leaders' },
      ],
      correct_answer: 'A',
      explanation: 'HR Generalists handle multiple HR domains across operations, onboarding, and grievances. HR Specialists focus deeply on dedicated domains such as Talent Acquisition, C&B, or L&D.',
    },

    // SECTION B – Employee Lifecycle and HR Policies (10 Marks)
    {
      quiz_id: quizId,
      order_index: 4,
      question_type: 'multiple_choice',
      points: 4,
      question_text: 'What is the correct sequential order of the 7 stages of the Employee Lifecycle?',
      options: [
        { id: 'A', text: 'Onboarding → Attraction → Recruitment → Development → Retention → Performance → Separation' },
        { id: 'B', text: 'Attraction → Recruitment → Onboarding → Development → Retention → Performance Management → Separation' },
        { id: 'C', text: 'Recruitment → Separation → Onboarding → Attraction → Development → Retention → Promotion' },
        { id: 'D', text: 'Application → Payroll → Review → Termination → Rehire → Training → Exit' },
      ],
      correct_answer: 'B',
      explanation: 'The standard 7-stage employee lifecycle begins with Attraction (Employer Branding) and finishes with Separation (Offboarding & Exit).',
    },
    {
      quiz_id: quizId,
      order_index: 5,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'How do Policies, Procedures, Rules, and Guidelines differ in organizational HR governance?',
      options: [
        { id: 'A', text: 'Policy is the overarching statement/principle; Procedure outlines step-by-step actions; Rule is a mandatory directive with consequences; Guideline is recommended best practice' },
        { id: 'B', text: 'Rules are optional advice, while Guidelines carry immediate financial penalties' },
        { id: 'C', text: 'Procedures are high-level philosophy, while Policies are informal team customs' },
        { id: 'D', text: 'All four terms are legally interchangeable with no structural distinction' },
      ],
      correct_answer: 'A',
      explanation: 'Policy states organizational intent; Procedure defines operational steps; Rule enforces strict non-negotiables; Guideline offers flexible recommendations.',
    },
    {
      quiz_id: quizId,
      order_index: 6,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'Why is confidentiality strictly enforced for HR professionals regarding salary, medical records, and grievances?',
      options: [
        { id: 'A', text: 'To maintain employee trust, protect personal data privacy, prevent toxic workplace politics, and comply with data protection regulations' },
        { id: 'B', text: 'So that only senior executives are allowed to know hospital shift schedules' },
        { id: 'C', text: 'Because HR contracts explicitly forbid talking to colleagues' },
        { id: 'D', text: 'To hide errors in attendance calculation from internal auditors' },
      ],
      correct_answer: 'A',
      explanation: 'Confidentiality protects sensitive medical and compensation information, avoids grievances and resentment among staff, and satisfies statutory privacy mandates.',
    },

    // SECTION C – Strategic HRM and Numerical Questions (10 Marks)
    {
      quiz_id: quizId,
      order_index: 7,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'A company starts the year with 150 employees (Opening Headcount), ends with 130 employees (Closing Headcount), and 25 employees left during the year. Calculate the Attrition Rate using Average Headcount.',
      options: [
        { id: 'A', text: '16.67%' },
        { id: 'B', text: '17.86%' },
        { id: 'C', text: '19.23%' },
        { id: 'D', text: '14.50%' },
      ],
      correct_answer: 'B',
      explanation: 'Average Headcount = (150 + 130) / 2 = 140. Attrition Rate = (Number of Leavers / Average Headcount) * 100 = (25 / 140) * 100 = 17.857% ≈ 17.86%.',
    },
    {
      quiz_id: quizId,
      order_index: 8,
      question_type: 'multiple_choice',
      points: 2,
      question_text: 'A hospital staffing model requires 60 nurses across three inpatient shifts, but workforce forecasting projects only 52 nurses will be available due to leaves and turnover. What is the Workforce Gap?',
      options: [
        { id: 'A', text: '+8 Surplus' },
        { id: 'B', text: '-8 Deficit / Shortage (requires hiring 8 nurses)' },
        { id: 'C', text: '112 Nurses total' },
        { id: 'D', text: 'Zero gap because part-time nurses can cover indefinitely' },
      ],
      correct_answer: 'B',
      explanation: 'Workforce Gap = Workforce Demand - Workforce Supply = 60 - 52 = 8 nurses deficit (shortage).',
    },
    {
      quiz_id: quizId,
      order_index: 9,
      question_type: 'multiple_choice',
      points: 2,
      question_text: 'A company spends ₹1,20,000 on job portal subscriptions, recruitment agency fees, and interviewing logistics, successfully hiring 8 staff members. What is the Cost per Hire?',
      options: [
        { id: 'A', text: '₹12,000' },
        { id: 'B', text: '₹15,000' },
        { id: 'C', text: '₹18,500' },
        { id: 'D', text: '₹20,000' },
      ],
      correct_answer: 'B',
      explanation: 'Cost per Hire = Total Recruitment Costs / Total Number of Hires = ₹1,20,000 / 8 = ₹15,000 per hire.',
    },
    {
      quiz_id: quizId,
      order_index: 10,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'A talent acquisition team extends 50 formal job offers, of which 35 are accepted by candidates. What is the Offer Acceptance Rate and what does it indicate?',
      options: [
        { id: 'A', text: '70% — Indicates 3 out of 10 candidates rejected the offer, signaling potential issues with compensation competitiveness or candidate engagement' },
        { id: 'B', text: '35% — Indicates that more than half of the job positions must be eliminated' },
        { id: 'C', text: '85% — Indicates superior employer branding and below-market salaries' },
        { id: 'D', text: '14.2% — Represents the annual retention percentage' },
      ],
      correct_answer: 'A',
      explanation: 'Offer Acceptance Rate = (Offers Accepted / Offers Extended) * 100 = (35 / 50) * 100 = 70%. A 30% drop-off warrants reviewing compensation benchmarks and interview candidate experience.',
    },

    // SECTION D – Healthcare HR (10 Marks)
    {
      quiz_id: quizId,
      order_index: 11,
      question_type: 'multiple_choice',
      points: 5,
      question_text: 'Which of the following encompasses the core responsibilities specific to Hospital & Healthcare HR Management?',
      options: [
        { id: 'A', text: 'Clinical and non-clinical workforce planning, 24/7 rotational shift scheduling, medical credentialing & statutory license verification, NABH accreditation compliance, and infection control training records' },
        { id: 'B', text: 'Operating surgical equipment and diagnosing patient illnesses in the emergency ward' },
        { id: 'C', text: 'Selling medical insurance policies directly to outpatient visitors' },
        { id: 'D', text: 'Managing hospital pharmacy inventory and prescribing pharmaceutical drugs' },
      ],
      correct_answer: 'A',
      explanation: 'Healthcare HR oversees 24/7 staffing rosters, NABH compliance, clinical vs non-clinical staff categorization, credentialing (MCI/NMC/Nursing Councils), and mandatory hospital safety training.',
    },
    {
      quiz_id: quizId,
      order_index: 12,
      question_type: 'multiple_choice',
      points: 2,
      question_text: 'Why is Primary Source Credential Verification crucial during the recruitment of Doctors, Nurses, and Biomedical Engineers?',
      options: [
        { id: 'A', text: 'To protect patient safety, avoid medical malpractice liability, and meet mandatory healthcare regulatory compliance' },
        { id: 'B', text: 'To negotiate lower salaries based on degree grades' },
        { id: 'C', text: 'Because college certificates expire every calendar month' },
        { id: 'D', text: 'It is merely a formality and can be skipped during urgent staffing shortages' },
      ],
      correct_answer: 'A',
      explanation: 'In healthcare, hiring uncredentialed or unverified personnel endangers patient lives, leads to severe malpractice lawsuits, and revokes hospital operating licenses.',
    },
    {
      quiz_id: quizId,
      order_index: 13,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'How should Hospital HR manage 24/7 rotational shift rosters to prevent clinical burnout and maintain patient safety?',
      options: [
        { id: 'A', text: 'Schedule staff across standard shifts (Morning, Evening, Night) with mandatory rest intervals, planned handover protocols, equitable night rotation, and pre-scheduled emergency backup relievers' },
        { id: 'B', text: 'Assign nurses to continuous 36-hour shifts so they can take 5 consecutive days off' },
        { id: 'C', text: 'Allow employees to arrive and leave whenever they want without departmental supervisor coordination' },
        { id: 'D', text: 'Roster only doctors during night shifts and leave wards unstaffed by nursing' },
      ],
      correct_answer: 'A',
      explanation: 'Safe healthcare shift scheduling requires structured 3-shift rotation, rest intervals between shifts, formal handovers, and buffer relievers to prevent fatigue-induced medical errors.',
    },

    // SECTION E – Situational Judgement & Case Study (10 Marks)
    {
      quiz_id: quizId,
      order_index: 14,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'Urgent Healthcare Sourcing Scenario: A 100-bed hospital urgently needs two Biomedical Engineers to maintain critical ICU and dialysis equipment. How should HR coordinate this recruitment?',
      options: [
        { id: 'A', text: 'Wait 6 months for walk-in campus candidates to visit the reception' },
        { id: 'B', text: 'Partner with technical biomedical engineering networks, source via specialized medical equipment portals, fast-track technical assessment with the Biomedical Head, verify equipment certifications, and issue conditional offers with accelerated onboarding' },
        { id: 'C', text: 'Transfer administrative clerks to handle biomedical ICU equipment maintenance' },
        { id: 'D', text: 'Ignore the vacancy until hospital equipment encounters a breakdown' },
      ],
      correct_answer: 'B',
      explanation: 'Critical technical vacancies require targeted channel sourcing, rigorous skill validation by department heads, and swift background credential verification.',
    },
    {
      quiz_id: quizId,
      order_index: 15,
      question_type: 'multiple_choice',
      points: 3,
      question_text: 'Grievance Handling Scenario: Two nurses complain confidentially that their shift supervisor is engaging in favoritism, assigning them disproportionate night shifts and verbally abusing them. What is HR’s immediate appropriate action?',
      options: [
        { id: 'A', text: 'Dismiss the complaint as routine hospital stress without taking notes' },
        { id: 'B', text: 'Immediately fire the supervisor without any investigation' },
        { id: 'C', text: 'Tell the supervisor who complained about them so they can resolve it themselves' },
        { id: 'D', text: 'Document the grievance formally, review shift logs for objective evidence of roster bias, interview all involved parties privately with confidentiality, and implement corrective action based on policy' },
      ],
      correct_answer: 'D',
      explanation: 'HR must remain an objective, neutral investigator: documenting statements, examining objective roster data, maintaining strict confidentiality, and adhering to fair disciplinary policy.',
    },
    {
      quiz_id: quizId,
      order_index: 16,
      question_type: 'multiple_choice',
      points: 4,
      question_text: 'Hospital Retention Case Study: The nursing department experiences a 35% annual turnover rate. What systematic 3-step approach should HR undertake to resolve this attrition crisis?',
      options: [
        { id: 'A', text: '1) Conduct structured exit interviews & anonymous pulse surveys to diagnose root causes (e.g. nurse-patient ratios, compensation, supervisor behavior); 2) Implement targeted retention initiatives (rest-break policies, compensation benchmarking, shift rota fairness); 3) Track monthly attrition and pulse metrics to evaluate improvement' },
        { id: 'B', text: 'Increase recruitment spending without investigating why current nurses are resigning' },
        { id: 'C', text: 'Withhold final relieving letters from resigning nurses to prevent them from leaving' },
        { id: 'D', text: 'Replace all registered nurses with untrained volunteers' },
      ],
      correct_answer: 'A',
      explanation: 'Resolving high turnover requires diagnostic data gathering (exit interviews, feedback), structural remedy (workload ratios, fair shifts, market pay), and ongoing metric tracking.',
    },
  ];

  for (const q of comprehensiveQuestions) {
    const { error: qErr } = await supabase.from('quiz_questions').insert(q);
    if (qErr) {
      console.error('Error inserting question:', qErr);
      throw qErr;
    }
  }
  console.log(`  ✓ Inserted ${comprehensiveQuestions.length} comprehensive exam questions (Total Marks: 50, Passing: 35)`);

  // 7. Upsert the 100-Employee Hospital HR Mini-Project
  console.log('6. Upserting 100-Employee Hospital HR Mini-Project...');
  const projectId = 'f1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d';
  const projectInstructions = `### Scenario
A hospital has 100 employees across the following departments:
- Nursing: 30 employees
- Medical: 15 employees
- Biomedical: 5 employees
- Laboratory: 10 employees
- Pharmacy: 8 employees
- Administration: 12 employees
- Finance: 5 employees
- Housekeeping: 10 employees
- HR: 5 employees
Total: 100 Employees

### Operational Challenges Identified:
1. Employee attendance records are inconsistent.
2. The hospital has no structured onboarding programme.
3. Two Biomedical Engineer positions are vacant.
4. Employee complaints and grievances are not documented properly.
5. Training records and compliance logs are incomplete.
6. Management wants to improve employee retention and satisfaction.

### Deliverables Required:
1. **HR Organisational Structure**: Create an organisational chart showing the HR department and its reporting structure.
2. **Employee Lifecycle Framework**: Create a flowchart explaining how an employee moves from attraction to separation.
3. **HR Policy Framework**: Prepare a table containing at least eight HR policies, their purposes, and key rules.
4. **Recruitment Plan**: Prepare a complete recruitment plan for the two vacant Biomedical Engineer positions (job requirement, qualifications, skills, channels, screening criteria, interview stages, joining documentation).
5. **Employee Onboarding Checklist**: Prepare a detailed 30-day onboarding checklist for a newly recruited Biomedical Engineer.
6. **HR Improvement Recommendations**: Recommend practical, systemic measures to address the hospital's six operational problems.
7. **HR Metrics Dashboard**: Identify at least five core HR metrics that management should monitor with formulas and benchmark targets.`;

  const projectRubric = [
    { criterion: 'HR Organizational Architecture & Flowcharts', weight: 20, max_points: 20 },
    { criterion: 'Policy Framework & Governance Depth', weight: 20, max_points: 20 },
    { criterion: 'Biomedical Recruitment & Onboarding Plan', weight: 20, max_points: 20 },
    { criterion: 'Operational Problem Solving & Practicality', weight: 20, max_points: 20 },
    { criterion: 'HR Metrics, Formulas & Professional Presentation', weight: 20, max_points: 20 },
  ];

  const { error: projErr } = await supabase.from('projects').upsert({
    id: projectId,
    course_id: courseId,
    title: 'Capstone Mini-Project: HR Operations Framework for a 100-Employee Hospital',
    description: 'Comprehensive 7-deliverable operational HR framework for a 100-employee hospital experiencing attendance, onboarding, retention, and staffing issues.',
    instructions: projectInstructions,
    rubric: projectRubric,
    max_score: 100,
    is_published: true,
    updated_at: new Date().toISOString(),
  });

  if (projErr) throw projErr;
  console.log('  ✓ Upserted 100-Employee Hospital Capstone Project');

  // 8. Recalculate Student Progress
  console.log('7. Recalculating student enrollment progress...');
  const { data: allLessons } = await supabase.from('lessons').select('id').eq('is_published', true);
  const totalLessonCount = allLessons ? allLessons.length : 10;

  const { data: enrollments } = await supabase.from('enrollments').select('id, student_id');
  if (enrollments && enrollments.length > 0) {
    for (const enr of enrollments) {
      const { data: completed } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('student_id', enr.student_id)
        .eq('status', 'completed');

      const completedCount = completed ? completed.length : 0;
      const progressPct = Math.round((completedCount / totalLessonCount) * 100);

      await supabase
        .from('enrollments')
        .update({ progress_percentage: progressPct })
        .eq('id', enr.id);
      console.log(`  ✓ Updated student ${enr.student_id} progress to ${progressPct}% (${completedCount}/${totalLessonCount} lessons)`);
    }
  }

  console.log('--- Migration Completed Successfully! ---');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
