const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load environment variables from .env.local
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

// Import table definitions
const { TABLE_DEFINITIONS } = require(path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'week2_table_defs'));

/**
 * Universal text to blocks parser that also injects structured tables
 */
function parseRawToBlocks(rawText, dayNum) {
  const lines = rawText.split(/\r?\n/);
  const blocks = [];
  const dayTables = TABLE_DEFINITIONS.filter(t => t.day === dayNum);
  const usedTables = new Set();
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Check if current position matches any defined table
    let matchedTable = null;
    for (let tDef of dayTables) {
      if (!usedTables.has(tDef) && tDef.pattern.test(line)) {
        matchedTable = tDef;
        break;
      }
    }

    if (matchedTable) {
      usedTables.add(matchedTable);
      // Add the current header/line if it wasn't just the table header
      blocks.push({
        type: 'header',
        data: { text: line, level: 2 }
      });
      blocks.push({
        type: 'table',
        data: {
          headers: matchedTable.headers,
          rows: matchedTable.rows
        }
      });
      i++;
      // Skip lines that belonged to the raw pasted table rows
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (!cur) {
          i++;
          continue;
        }
        // Check if cur line is part of the table row cells
        const isCell = matchedTable.rows.some(r => r.some(cell => cell.toLowerCase().includes(cur.toLowerCase()) || cur.toLowerCase().includes(cell.toLowerCase())));
        const isHeader = matchedTable.headers.some(h => h.toLowerCase().includes(cur.toLowerCase()));
        if (isCell || isHeader || cur === 'Basis' || cur === 'Criteria' || cur === 'Component' || cur === 'Requirement' || cur === 'Position' || cur === 'Metric' || cur === 'Score' || cur === 'Candidate') {
          i++;
        } else {
          break;
        }
      }
      continue;
    }

    // Check for tabbed tables
    if (lines[i].includes('\t')) {
      const tableRows = [];
      while (i < lines.length && lines[i].includes('\t')) {
        const cells = lines[i].split('\t').map(c => c.trim());
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const rows = tableRows.slice(1);
        blocks.push({
          type: 'table',
          data: { headers, rows }
        });
      }
      continue;
    }

    // Main Topic Headings
    if (/^TOPIC\s+\d+:/i.test(line) || /^PART\s+\d+:/i.test(line)) {
      blocks.push({
        type: 'header',
        data: { text: line, level: 1 }
      });
      i++;
      continue;
    }

    // Section Headings
    if (/^(\d+\.\d+)\s+/i.test(line) || /^SECTION\s+[A-Z]/i.test(line) || /^TASK\s+\d+/i.test(line) || /^PROJECT:/i.test(line) || /^Assignment\s+\d+/i.test(line)) {
      blocks.push({
        type: 'header',
        data: { text: line, level: 2 }
      });
      i++;
      continue;
    }

    // Subheadings
    if (/^(\d+\.\d+\.\d+)\s+/i.test(line) || /^Example:/i.test(line) || /^Major Responsibilities:/i.test(line) || /^Skills Required:/i.test(line) || /^Important:/i.test(line) || /^Deliverable:/i.test(line) || /^Tools:/i.test(line) || /^Task:/i.test(line)) {
      blocks.push({
        type: 'header',
        data: { text: line, level: 3 }
      });
      i++;
      continue;
    }

    // Bullet Lists
    if (/^[-*•]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const listItems = [];
      const isOrdered = /^\d+\.\s+/.test(line);
      while (i < lines.length) {
        const cur = lines[i].trim();
        if (isOrdered && /^\d+\.\s+/.test(cur)) {
          listItems.push(cur.replace(/^\d+\.\s+/, ''));
          i++;
        } else if (!isOrdered && /^[-*•]\s+/.test(cur)) {
          listItems.push(cur.replace(/^[-*•]\s+/, ''));
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'list',
        data: {
          style: isOrdered ? 'ordered' : 'unordered',
          items: listItems
        }
      });
      continue;
    }

    // Otherwise, normal paragraph
    let paraText = line;
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine || 
          nextLine.includes('\t') || 
          /^TOPIC\s+\d+:/i.test(nextLine) || 
          /^PART\s+\d+:/i.test(nextLine) || 
          /^(\d+\.\d+)\s+/i.test(nextLine) || 
          /^(\d+\.\d+\.\d+)\s+/i.test(nextLine) || 
          /^SECTION\s+[A-Z]/i.test(nextLine) || 
          /^TASK\s+\d+/i.test(nextLine) || 
          /^PROJECT:/i.test(nextLine) || 
          /^Assignment\s+\d+/i.test(nextLine) || 
          /^Example:/i.test(nextLine) || 
          /^Major Responsibilities:/i.test(nextLine) || 
          /^Skills Required:/i.test(nextLine) || 
          /^[-*•]\s+/.test(nextLine) || 
          /^\d+\.\s+/.test(nextLine)) {
        break;
      }
      paraText += ' ' + nextLine;
      i++;
    }

    blocks.push({
      type: 'paragraph',
      data: { text: paraText }
    });
  }

  return blocks;
}

// =========================================================================
// ENRICHMENT BUILDERS FOR WEEK 2 (DAYS 8 - 14)
// =========================================================================

function buildDay8() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_8.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 8);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: '17 Steps', label: 'End-to-End Recruitment Lifecycle', badge: 'Lifecycle' },
        { value: 'Active/Passive', label: 'Candidate Sourcing Spectrum' },
        { value: 'Funnel Logic', label: '1,000 Exposed → 7 Hired' },
        { value: '21/30 Pass', label: '70% Minimum Assessment Benchmark', badge: 'Day 8' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 8 Core Takeaway',
      quote: 'Recruitment is about filling current vacancies. Talent Acquisition is building the strategic organizational capability to consistently attract, assess, and onboard the right talent for sustainable enterprise growth.',
      author: 'CHRMP Talent Acquisition Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 3: RECRUITMENT VS TALENT ACQUISITION')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Strategic Distinction: Recruitment vs Talent Acquisition',
          subtitle: 'Understanding the shift from reactive vacancy filling to proactive talent capability.',
          items: [
            { feature: 'Core Focus', traditional: 'Fills immediate current vacancies as they arise', strategic: 'Anticipates both current and future organizational talent needs' },
            { feature: 'Approach', traditional: 'Reactive, transactional, and short-term', strategic: 'Proactive, strategic, and continuous' },
            { feature: 'Candidate Pool', traditional: 'Vacancy-specific applicant pool', strategic: 'Pre-screened, engaged talent pipelines and talent pools' },
            { feature: 'Employer Branding', traditional: 'Limited or passive recruitment advertising', strategic: 'Core pillar: building long-term institutional reputation' },
            { feature: 'Workforce Planning', traditional: 'Weak link: acts only upon requisition arrival', strategic: 'Strong integration: aligned with corporate headcount forecasting' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 5: THE COMPLETE RECRUITMENT PROCESS')) {
      result.push({
        type: 'process_steps',
        data: {
          title: 'The 17-Step Complete Recruitment Pipeline',
          subtitle: 'From initial departmental manpower identification to candidate onboarding.',
          steps: [
            { step: 1, title: 'Manpower Requisition', subtitle: 'Need identification', description: 'Department identifies vacancy and submits requisition with budget and head approval.', keyAction: 'Verify business need and role necessity.', badge: 'Stage 1' },
            { step: 2, title: 'Job Analysis & Specification', subtitle: 'Role definition', description: 'Study tasks, responsibilities, essential qualifications, and required competencies.', keyAction: 'Draft crystal-clear JD and JS.', badge: 'Stage 2' },
            { step: 3, title: 'Sourcing & Attraction', subtitle: 'Candidate acquisition', description: 'Leverage LinkedIn, job portals, campus recruitment, and employee referrals.', keyAction: 'Attract qualified active and passive talent.', badge: 'Stage 3' },
            { step: 4, title: 'Screening & Shortlisting', subtitle: 'Filtering applications', description: 'Compare candidate profiles against mandatory eligibility criteria and shortlisting rubrics.', keyAction: 'Filter high-potential candidates for interviews.', badge: 'Stage 4' },
            { step: 5, title: 'Technical & HR Interviews', subtitle: 'Competency evaluation', description: 'Conduct structured interviews to evaluate technical skills, communication, and culture fit.', keyAction: 'Capture standardized evaluation feedback.', badge: 'Stage 5' },
            { step: 6, title: 'Offer & Preboarding', subtitle: 'Closing the hire', description: 'Present approved compensation offer, negotiate professionally, and verify credentials.', keyAction: 'Ensure high offer acceptance and zero no-shows.', badge: 'Stage 6' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 17: HEALTHCARE RECRUITMENT EXAMPLE')) {
      result.push({
        type: 'checkpoint',
        data: {
          question: 'A 200-bed hospital installs new advanced dialysis and ventilator equipment and urgently requires two Biomedical Engineers. What is HR\'s first operational step?',
          scenario: 'The hospital clinical director informs HR that patient treatment commences in 30 days. Operating advanced medical equipment without certified biomedical engineering oversight violates statutory hospital licensing.',
          options: [
            'Immediately publish an unapproved newspaper advertisement without consulting the biomedical department.',
            'Meet with the Biomedical Department Head to determine exact equipment types, required technical competencies, and initiate a targeted multi-channel sourcing plan.',
            'Wait for candidates to walk in through the hospital reception desk spontaneously.',
            'Assign general ward nurses to troubleshoot the dialysis machines during their night shifts.',
          ],
          correctOptionIndex: 1,
          explanation: 'Before initiating recruitment, HR must conduct a job analysis to establish the exact technical equipment requirements, mandatory engineering qualifications, and shift requirements in consultation with the department head.',
          mentorTip: 'Never advertise a vacancy without understanding the technical responsibilities and obtaining formal requisition approval.',
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('DAY 8 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 8 Recruitment & TA Mastery Verification',
          subtitle: 'Verify your foundational understanding of the recruitment lifecycle before advancing to Job Analysis.',
          items: [
            'Can define recruitment and explain its organizational importance',
            'Can clearly articulate the differences between recruitment and talent acquisition',
            'Memorized the complete recruitment lifecycle from requisition to onboarding',
            'Understand internal vs external recruitment methods, advantages, and limitations',
            'Know the core recruitment terminology (applicant, candidate, shortlisted, offer, joiner)',
            'Understand the recruitment funnel stages and dropout analysis',
            'Can explain the operational responsibilities of an HR Executive during hiring',
            'Completed the Day 8 Recruitment Process Design assignment',
            'Reviewed the 30-Mark Day 8 Assessment (Passing: 21/30 / 70%)',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay9() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_9.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 9);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: 'Job Analysis', label: 'Understanding the Job & Requirements', badge: 'Core' },
        { value: 'JD vs JS', label: 'Duties & Roles vs Candidate Profile' },
        { value: 'KRA & KPI', label: 'Outcome Focus vs Measurable Metric' },
        { value: '21/30 Pass', label: '70% Assessment Benchmark', badge: 'Evaluation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 9 Core Takeaway',
      quote: 'An HR professional cannot recruit effectively without first understanding the position. Job Analysis is the blueprint upon which accurate job descriptions, objective candidate screening, and fair compensation are constructed.',
      author: 'Job Architecture Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 2: HOW IS JOB ANALYSIS CONDUCTED?')) {
      result.push({
        type: 'process_steps',
        data: {
          title: 'Five Methods of Conducting Job Analysis',
          subtitle: 'Systematically gathering accurate operational and clinical job requirements.',
          steps: [
            { step: 1, title: 'Interview Method', subtitle: 'Managerial & Employee Dialogue', description: 'Question incumbents and reporting managers regarding daily tasks, escalation points, and essential qualifications.', keyAction: 'Uncover real daily responsibilities and technical tools.', badge: 'Method 1' },
            { step: 2, title: 'Questionnaire Method', subtitle: 'Structured Data Gathering', description: 'Distribute structured forms across job holders to record equipment used, software tools, and supervisor reporting.', keyAction: 'Capture wide sample data efficiently across departments.', badge: 'Method 2' },
            { step: 3, title: 'Observation Method', subtitle: 'Direct Workplace Inspection', description: 'Observe employees executing repetitive or hands-on clinical and operational procedures in real-time.', keyAction: 'Verify physical demands and environmental conditions.', badge: 'Method 3' },
            { step: 4, title: 'Work Diary Method', subtitle: 'Time & Activity Logs', description: 'Employees maintain chronological activity logs over 2–4 weeks detailing time spent per task.', keyAction: 'Identify time allocation and hidden bottlenecks.', badge: 'Method 4' },
            { step: 5, title: 'Documentation Audit', subtitle: 'SOPs & Service Manuals', description: 'Review hospital standard operating procedures, vendor maintenance manuals, and accreditation guidelines.', keyAction: 'Ensure statutory compliance requirements are incorporated.', badge: 'Method 5' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 5: DIFFERENCE BETWEEN JOB ANALYSIS')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Core Distinction: Job Analysis vs Job Description vs Job Specification',
          subtitle: 'Understanding the triad of job architecture.',
          items: [
            { feature: 'Core Meaning', traditional: 'Job Analysis: The investigative process of collecting information about a job', strategic: 'JD: Document describing the role duties | JS: Document describing candidate qualifications' },
            { feature: 'Primary Focus', traditional: 'Focuses on the job tasks, workflows, and environmental demands', strategic: 'JD focuses on responsibilities | JS focuses on candidate attributes and skills' },
            { feature: 'Output Deliverable', traditional: 'Job analysis data and research notes', strategic: 'Job Description (JD) and Job Specification (JS)' },
            { feature: 'Recruitment Role', traditional: 'Informs what to look for before writing advertisements', strategic: 'JD tells applicants what they will do | JS sets the minimum shortlisting criteria' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 9: JOB DESIGN')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Job Design Methods: Job Enlargement vs Job Enrichment vs Job Rotation',
          subtitle: 'Structuring organizational roles to optimize productivity and engagement.',
          items: [
            { feature: 'Core Concept', traditional: 'Job Enlargement: Horizontal expansion adding more tasks at the same level', strategic: 'Job Enrichment: Vertical expansion adding autonomy, decision-making, and responsibility' },
            { feature: 'Authority Level', traditional: 'Authority and decision power typically remain unchanged', strategic: 'Authority, accountability, and managerial autonomy increase significantly' },
            { feature: 'Employee Experience', traditional: 'Job Rotation: Moving across departments to develop broad cross-functional exposure', strategic: 'Job Enrichment: Enhances intrinsic motivation, psychological ownership, and leadership' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('DAY 9 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 9 Job Analysis & Description Mastery Verification',
          subtitle: 'Verify your job architecture competencies before moving to Candidate Sourcing.',
          items: [
            'Can define Job Analysis and explain its 7 core organizational objectives',
            'Master the methods of Job Analysis (Interview, Questionnaire, Observation, Logs)',
            'Can write a comprehensive Job Description with summary, responsibilities, and conditions',
            'Can prepare a rigorous Job Specification distinguishing essential from desirable criteria',
            'Understand Job Design methods: Job Rotation, Job Enlargement, and Job Enrichment',
            'Understand the fundamental difference between a KRA and a KPI with examples',
            'Completed the 3 professional JDs and Job Specifications assignment',
            'Reviewed the 30-Mark Day 9 Assessment (Passing: 21/30 / 70%)',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay10() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_10.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 10);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: '9 Sourcing Channels', label: 'Portals, LinkedIn, Referrals, Campus, Agencies', badge: 'Sourcing' },
        { value: 'Boolean Search', label: 'AND, OR, NOT, Quotes Operators' },
        { value: 'Source Quality', label: 'Source-to-Shortlist Conversion' },
        { value: '21/30 Pass', label: '70% Assessment Benchmark', badge: 'Evaluation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 10 Core Takeaway',
      quote: 'Different roles require distinct sourcing channels. Relying on a single job portal is a recipe for recruitment failure. Master proactive talent sourcing, Boolean search precision, and talent pipeline management.',
      author: 'Candidate Sourcing Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 6: ACTIVE VS PASSIVE CANDIDATES')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Comparative Analysis: Active Candidates vs Passive Candidates',
          subtitle: 'Understanding the psychology, sourcing channels, and engagement techniques for both talent pools.',
          items: [
            { feature: 'Job Search Behavior', traditional: 'Actively searching: browsing portals, sending applications daily', strategic: 'Not searching: happily employed, focused on current career growth' },
            { feature: 'Primary Sourcing Channel', traditional: 'Job portals (Naukri, Indeed), company career pages, walk-ins', strategic: 'LinkedIn direct sourcing, professional networks, industry conferences, referrals' },
            { feature: 'Engagement Strategy', traditional: 'Standard job advertisements and automated application confirmation', strategic: 'Personalized InMail outreach highlighting career growth, leadership, and impact' },
            { feature: 'Availability & Urgency', traditional: 'Immediately available or actively serving standard notice period', strategic: 'Requires persuasive dialogue to consider transitioning; negotiation required' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 10: UNDERSTANDING TALENT POOLS AND TALENT PIPELINES')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Strategic Comparison: Talent Pool vs Talent Pipeline',
          subtitle: 'From passive database storage to structured future hiring readiness.',
          items: [
            { feature: 'Core Meaning', traditional: 'Talent Pool: A database of potential candidates who expressed interest or applied previously', strategic: 'Talent Pipeline: A structured, pre-qualified cohort being nurtured for upcoming vacancies' },
            { feature: 'Operational Nature', traditional: 'General talent inventory stored in ATS or spreadsheets', strategic: 'Proactive, segmented talent relationship management aligned with business expansion' },
            { feature: 'Hospital Example', traditional: '50 resumes of Biomedical Engineers who applied over the past 12 months', strategic: '6 vetted Biomedical Engineers ready to step in when the new hospital wing opens in 90 days' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 15: SOURCING METRICS')) {
      result.push({
        type: 'calculator',
        data: {
          calculatorType: 'offer_acceptance',
          title: 'Source-to-Shortlist Conversion Calculator',
          description: 'Measure the quality of a recruitment source: (Candidates Shortlisted ÷ Candidates Sourced) × 100.',
          defaultValues: { offersExtended: 100, offersAccepted: 25 },
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('DAY 10 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 10 Candidate Sourcing & Pipeline Mastery Verification',
          subtitle: 'Verify your sourcing competencies before moving to Resume Screening.',
          items: [
            'Can define Candidate Sourcing and explain its distinction from recruitment',
            'Know all major internal and external sourcing channels and when to apply each',
            'Master Boolean search operators (AND, OR, NOT, quotation marks)',
            'Understand the operational differences between active and passive candidates',
            'Know how to structure and nurture talent pools and talent pipelines',
            'Can maintain a professional Candidate Sourcing Tracker with all essential data fields',
            'Can draft personalized, respectful candidate outreach messages',
            'Completed all five practical assignments',
            'Reviewed the 30-Mark Day 10 Assessment (Passing: 21/30 / 70%)',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay11() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_11.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 11);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: 'ATS Screening', label: 'Applicant Tracking Systems & Parsing', badge: 'Screening' },
        { value: 'CV vs Resume', label: 'Comprehensive Record vs Targeted Summary' },
        { value: 'Red Flag Audit', label: 'Investigation Protocol: Gaps & Discrepancies' },
        { value: '21/30 Pass', label: '70% Assessment Benchmark', badge: 'Evaluation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 11 Core Takeaway',
      quote: 'Resume screening is not simply skimming resumes and picking people with elite colleges. A professional recruiter systematically checks whether the candidate satisfies mandatory criteria, demonstrates verifiable experience, and justifies investment of interviewer time.',
      author: 'Candidate Evaluation Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 2: CV VS RESUME')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Comparative Analysis: Resume vs Curriculum Vitae (CV)',
          subtitle: 'Understanding document length, purpose, and international recruitment conventions.',
          items: [
            { feature: 'Document Length', traditional: 'Resume: Concise (1–2 pages) tailored to a specific position', strategic: 'CV: Comprehensive (3–10+ pages) detailing complete academic and professional history' },
            { feature: 'Content Scope', traditional: 'Highlights job-relevant competencies, achievements, and impact', strategic: 'Exhaustive record: publications, clinical research, fellowships, conferences, degrees' },
            { feature: 'Primary Application', traditional: 'Corporate enterprise, healthcare operations, and technical industry roles', strategic: 'Medical doctors, university professors, clinical researchers, scientific positions' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 4: THE RESUME SCREENING PROCESS')) {
      result.push({
        type: 'process_steps',
        data: {
          title: 'The Seven-Step Structured Resume Screening Protocol',
          subtitle: 'Ensuring consistency, legal fairness, and high shortlisting accuracy.',
          steps: [
            { step: 1, title: 'Job Description Audit', subtitle: 'Refresh criteria', description: 'Review mandatory qualifications, minimum experience, and required certifications.', keyAction: 'Establish non-negotiable benchmark.', badge: 'Step 1' },
            { step: 2, title: 'Screening Criteria Matrix', subtitle: 'Define evaluation rubric', description: 'Convert JD requirements into measurable criteria (degree, experience, software tools).', keyAction: 'Ensure identical criteria applied to all.', badge: 'Step 2' },
            { step: 3, title: 'Application Review', subtitle: 'Compare against criteria', description: 'Inspect candidate resume, verify degree relevance, and check chronological tenure.', keyAction: 'Identify direct and transferable skills.', badge: 'Step 3' },
            { step: 4, title: 'Categorize Applicants', subtitle: 'Classification', description: 'Group candidates into: Strong Match, Potential Match, Hold for Review, and Not Suitable.', keyAction: 'Organize candidate pipeline.', badge: 'Step 4' },
            { step: 5, title: 'Red Flag Audit', subtitle: 'Check discrepancies', description: 'Check unexplained employment gaps, overlapping tenures, or missing certifications.', keyAction: 'Flag items requiring clarification.', badge: 'Step 5' },
            { step: 6, title: 'Shortlist Finalization', subtitle: 'Compile top cohort', description: 'Select the top qualifying candidates based on screening scores and availability.', keyAction: 'Create shortlist report for hiring manager.', badge: 'Step 6' },
            { step: 7, title: 'Document Screening Decisions', subtitle: 'Audit trail', description: 'Record decisions, scores, and specific job-related reasons in the recruitment tracker.', keyAction: 'Ensure transparency and legal defense.', badge: 'Step 7' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('DAY 11 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 11 Resume Screening Mastery Verification',
          subtitle: 'Verify your candidate screening competencies before advancing to Interview Planning.',
          items: [
            'Can explain the operational purpose and business value of structured resume screening',
            'Know the distinction between a Resume and a CV and when each is appropriate',
            'Master the 7 steps of the resume screening process',
            'Can differentiate between mandatory eligibility criteria and preferred qualifications',
            'Understand how Applicant Tracking Systems (ATS) parse resumes and match keywords',
            'Know how to investigate resume red flags professionally without bias',
            'Can build and apply a weighted Candidate Screening Matrix',
            'Can calculate Screening Rate and Shortlisting Ratio',
            'Completed all five practical assignments',
            'Reviewed the 30-Mark Day 11 Assessment (Passing: 21/30 / 70%)',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay12() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_12.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 12);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: '9 Formats', label: 'Phone, Video, In-Person, Technical, Panel, HR', badge: 'Interviews' },
        { value: 'Structured', label: 'Standardized Question & Scoring Rubrics' },
        { value: 'Candidate Exp', label: 'Employer Branding & Professional Etiquette' },
        { value: '21/30 Pass', label: '70% Assessment Benchmark', badge: 'Evaluation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 12 Core Takeaway',
      quote: 'Interview coordination is the operational engine of talent acquisition. Flawless scheduling, timely communication, interviewer alignment, and respectful candidate treatment preserve institutional reputation and ensure high offer conversion.',
      author: 'Interview Management Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 3: STRUCTURED VS UNSTRUCTURED INTERVIEWS')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Comparative Analysis: Structured vs Unstructured Interviews',
          subtitle: 'Why structured interviewing delivers superior predictive validity and legal protection.',
          items: [
            { feature: 'Question Design', traditional: 'Unstructured: Spontaneous, conversational, varying with every applicant', strategic: 'Structured: Predefined, job-related questions based directly on the JD' },
            { feature: 'Evaluation Consistency', traditional: 'Subjective: Depends heavily on interviewer mood and rapport', strategic: 'Standardized: Consistent rating scales (1–5) and competency rubrics' },
            { feature: 'Predictive Validity', traditional: 'Low: Poor predictor of actual on-the-job technical performance', strategic: 'High: Statistically proven to predict performance and reduce unconscious bias' },
            { feature: 'Candidate Comparison', traditional: 'Difficult: Applicants are asked completely different questions', strategic: 'Seamless: Objective side-by-side comparison across identical parameters' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('TOPIC 4: UNDERSTANDING THE INTERVIEW PROCESS')) {
      result.push({
        type: 'process_steps',
        data: {
          title: 'The Eight-Stage Interview Coordination Protocol',
          subtitle: 'From shortlist confirmation to post-interview evaluation and candidate status update.',
          steps: [
            { step: 1, title: 'Shortlist Confirmation', subtitle: 'Confirm candidate pool', description: 'Receive approved shortlist from recruiters and hiring managers.', keyAction: 'Ensure all candidates meet basic criteria.', badge: 'Stage 1' },
            { step: 2, title: 'Panel Availability Sync', subtitle: 'Coordinate calendars', description: 'Sync availability of technical managers, HR interviewers, and meeting rooms.', keyAction: 'Lock time slots before contacting candidates.', badge: 'Stage 2' },
            { step: 3, title: 'Interview Scheduling', subtitle: 'Slot allocation', description: 'Allocate 30–45 minute slots allowing 10–15 minute buffer intervals between sessions.', keyAction: 'Prevent panel fatigue and schedule overruns.', badge: 'Stage 3' },
            { step: 4, title: 'Candidate Invitation', subtitle: 'Send formal notice', description: 'Dispatch professional email with job title, date, time, meeting link/venue, and required documents.', keyAction: 'Request confirmation of attendance.', badge: 'Stage 4' },
            { step: 5, title: 'Panel Dossier Delivery', subtitle: 'Equip interviewers', description: 'Share candidate resumes, JD, and structured interview feedback forms with the panel.', keyAction: 'Ensure zero unprepared interviewers.', badge: 'Stage 5' },
            { step: 6, title: 'Interview Day Coordination', subtitle: 'Real-time execution', description: 'Welcome candidates, resolve connection issues, verify attendance, and monitor timing.', keyAction: 'Maintain punctual, professional execution.', badge: 'Stage 6' },
            { step: 7, title: 'Feedback Collection', subtitle: 'Gather evaluations', description: 'Collect signed feedback forms and ratings from panel within 24 hours of completion.', keyAction: 'Prevent evaluation memory decay.', badge: 'Stage 7' },
            { step: 8, title: 'Status Tracking & Next Steps', subtitle: 'Close the loop', description: 'Update recruitment tracker, notify hiring managers, and communicate updates to candidates.', keyAction: 'Deliver outstanding candidate experience.', badge: 'Stage 8' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('DAY 12 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 12 Interview Planning & Coordination Mastery Verification',
          subtitle: 'Verify your interview management competencies before advancing to Candidate Selection.',
          items: [
            'Can explain the operational purpose and objectives of employment interviews',
            'Know all 9 interview formats (Phone, Video, Face-to-Face, Technical, HR, Panel, Group, etc.)',
            'Understand why structured interviews provide superior validity and legal defensibility',
            'Master the 8 stages of the interview coordination workflow',
            'Can prepare conflict-free interview schedules for clinical and operational teams',
            'Can draft professional interview invitations, reminders, confirmations, and reschedule notices',
            'Know how to equip interview panels with resumes, JDs, and standardized feedback forms',
            'Understand candidate experience factors and professional interview etiquette',
            'Completed all five practical assignments',
            'Reviewed the 30-Mark Day 12 Assessment (Passing: 21/30 / 70%)',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay13() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_13.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 13);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: 'Weighted Scorecard', label: 'Multi-Competency Candidate Rating', badge: 'Selection' },
        { value: 'CTC Architecture', label: 'Fixed, Variable, Benefits & In-Hand Net' },
        { value: 'Offer Metrics', label: 'Acceptance Rate & Offer-to-Joining Ratio' },
        { value: '21/30 Pass', label: '70% Assessment Benchmark', badge: 'Evaluation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Day 13 Core Takeaway',
      quote: 'Final selection is not a subjective gut feeling. It is an evidence-based recommendation supported by structured scorecards, verified mandatory credentials, transparent compensation alignment, and diligent offer management.',
      author: 'Selection & Offer Management Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('14. Understanding the Difference Between CTC, Gross and Net Salary')) {
      result.push({
        type: 'comparison_matrix',
        data: {
          title: 'Comparative Breakdown: CTC vs Gross Salary vs Net In-Hand Salary',
          subtitle: 'Preventing candidate misunderstandings and pay transparency disputes.',
          items: [
            { feature: 'Cost to Company (CTC)', traditional: 'Total annual financial expenditure incurred by the enterprise to employ the individual', strategic: 'Includes basic pay, allowances, employer PF, insurance premiums, gratuity, and bonus' },
            { feature: 'Gross Salary', traditional: 'Salary earned by employee before employee-side statutory and voluntary deductions', strategic: 'Comprises fixed monthly components (Basic + HRA + Special Allowance)' },
            { feature: 'Net In-Hand Salary', traditional: 'Actual take-home money credited directly to the employee bank account each month', strategic: 'Gross Salary minus Employee PF (12%), Professional Tax, and Income Tax (TDS)' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('20. What Is an Offer Approval Workflow?')) {
      result.push({
        type: 'process_steps',
        data: {
          title: 'The Seven-Step Offer Approval and Preboarding Pipeline',
          subtitle: 'From candidate selection recommendation to successful first day joining.',
          steps: [
            { step: 1, title: 'Selection Recommendation', subtitle: 'Consolidate evaluations', description: 'Review candidate scorecard, technical panel feedback, and verify all mandatory credentials.', keyAction: 'Confirm candidate meets all eligibility criteria.', badge: 'Step 1' },
            { step: 2, title: 'Salary Expectation Alignment', subtitle: 'Compensation discussion', description: 'Confirm candidate salary expectations, current notice period, and potential joining date.', keyAction: 'Ensure expectations fit approved budget range.', badge: 'Step 2' },
            { step: 3, title: 'Internal Compensation Approval', subtitle: 'Finance & HR sign-off', description: 'Submit formal compensation proposal to HR Head and Finance for budgetary clearance.', keyAction: 'Never promise unapproved compensation.', badge: 'Step 3' },
            { step: 4, title: 'Offer Letter Generation', subtitle: 'Prepare formal offer', description: 'Draft official offer letter with designation, CTC structure, reporting manager, and conditions.', keyAction: 'Use approved legal templates.', badge: 'Step 4' },
            { step: 5, title: 'Offer Release & Briefing', subtitle: 'Extend the offer', description: 'Send offer letter and schedule a call to walk through salary components and acceptance deadline.', keyAction: 'Clarify fixed vs variable pay transparently.', badge: 'Step 5' },
            { step: 6, title: 'Preboarding Engagement', subtitle: 'Nurture candidate', description: 'Collect joining documents, initiate background verification, and conduct weekly check-ins.', keyAction: 'Minimize offer dropouts and counteroffer loss.', badge: 'Step 6' },
            { step: 7, title: 'Joining Day Confirmation', subtitle: 'Day 1 transition', description: 'Welcome new employee, complete physical document verification, and hand over to induction team.', keyAction: 'Celebrate successful hire completion.', badge: 'Step 7' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('24. Offer Acceptance Rate')) {
      result.push({
        type: 'calculator',
        data: {
          calculatorType: 'offer_acceptance',
          title: 'Offer Acceptance Rate & Joining Conversion Calculator',
          description: 'Measure offer conversion efficiency: (Offers Accepted ÷ Offers Issued) × 100.',
          defaultValues: { offersExtended: 20, offersAccepted: 16 },
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('PART 14: DAY 13 COMPLETION CHECKLIST')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Day 13 Candidate Selection & Offer Management Mastery Verification',
          subtitle: 'Verify your competencies before beginning the Day 14 Capstone Project.',
          items: [
            'Can objectively evaluate candidates across technical, behavioural, and cultural dimensions',
            'Know how to construct and score a weighted Candidate Scorecard out of 100',
            'Can distinguish clearly between recruitment, selection, and hiring',
            'Understand Background Verification (BGV) types and ethical consent protocols',
            'Master compensation terminology: CTC, Fixed Pay, Variable Pay, Gross, and Net Take-Home',
            'Can conduct professional salary discussions without making unauthorized commitments',
            'Know all 12 key components of an employment offer letter',
            'Understand the offer approval workflow and how to manage offer dropouts',
            'Can calculate Offer Acceptance Rate and Offer-to-Joining Ratio',
            'Completed all practical assignments and scored at least 21/30 on the assessment',
          ],
        },
      });
    }
  }
  return result;
}

function buildDay14() {
  const rawPath = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch', 'raw_week2', 'day_14.txt');
  const raw = fs.readFileSync(rawPath, 'utf8');
  const baseBlocks = parseRawToBlocks(raw, 14);

  const result = [];
  result.push({
    type: 'stats',
    data: {
      stats: [
        { value: '50-Mark Exam', label: 'Week 2 Comprehensive Written Assessment (Pass: 35/50)', badge: 'Assessment' },
        { value: '200-Bed Hospital', label: '13 Clinical & Administrative Vacancies' },
        { value: '100 Practical M', label: '7 Detailed Operational Deliverables' },
        { value: '20 Core Records', label: 'Complete HR Recruitment Documentation' },
      ],
    },
  });
  result.push({
    type: 'takeaway',
    data: {
      tag: 'Week 2 Capstone Milestone Takeaway',
      quote: 'Congratulations on reaching the culmination of Week 2! Today you step into the shoes of an HR Recruitment Executive managing an end-to-end hospital expansion. Synthesize your job analysis, sourcing, screening, interview coordination, and offer management skills into production-grade deliverables.',
      author: 'Talent Acquisition Capstone Standard',
    },
  });

  for (let b of baseBlocks) {
    result.push(b);

    if (b.type === 'header' && b.data.text && b.data.text.includes('PROJECT: RECRUITMENT MANAGEMENT FOR A 200-BED HOSPITAL')) {
      result.push({
        type: 'department_map',
        data: {
          title: '200-Bed Hospital 13-Vacancy Staffing Requisition',
          departments: [
            { name: 'Biomedical Engineering', roles: 'Biomedical Engineers (2 Vacancies)', headcount: 2, focus: 'New ICU Ventilators, Dialysis & Preventive Maintenance', compliance: 'NABH & AERB Safety Standards' },
            { name: 'Nursing Services', roles: 'Staff Nurses (5 Vacancies)', headcount: 5, focus: 'ICU & Surgical Ward Bedside Care', compliance: 'State Nursing Council' },
            { name: 'Human Resources', roles: 'HR Executive (1 Vacancy)', headcount: 1, focus: 'Recruitment Coordination, Attendance & Onboarding', compliance: 'Labor & Hospital Bylaws' },
            { name: 'Hospital Administration', roles: 'Hospital Receptionists (3 Vacancies)', headcount: 3, focus: 'Patient Registration, Triage, Insurance Desk & Billing', compliance: 'NABH Patient Rights' },
            { name: 'Diagnostic Laboratory', roles: 'Lab Technicians (2 Vacancies)', headcount: 2, focus: 'Pathology, Biochemistry & Blood Bank Testing', compliance: 'NABL Certification' },
          ],
        },
      });
      result.push({
        type: 'process_steps',
        data: {
          title: 'The 12-Stage Hospital Recruitment Lifecycle Overview',
          subtitle: 'The master workflow governing the 30-day hiring initiative.',
          steps: [
            { step: 1, title: 'Manpower Requisition', subtitle: 'Need validation', description: 'Confirm vacancies across Biomedical, Nursing, HR, Reception, and Laboratory.', keyAction: 'Ensure approvals and budgets are locked.', badge: 'Phase 1' },
            { step: 2, title: 'Job Architecture (JD & JS)', subtitle: 'Profile formulation', description: 'Draft detailed JDs and Job Specifications defining mandatory vs preferred criteria.', keyAction: 'Set clear competency bars.', badge: 'Phase 1' },
            { step: 3, title: 'Multi-Channel Sourcing', subtitle: 'Candidate acquisition', description: 'Deploy LinkedIn, Naukri, campus drives, and healthcare specialist agencies.', keyAction: 'Build diverse candidate pipeline.', badge: 'Phase 2' },
            { step: 4, title: 'Resume Screening & Matrix', subtitle: 'Filtering applications', description: 'Apply screening matrices and investigate red flags across all 260 applicants.', keyAction: 'Shortlist top 65 candidates.', badge: 'Phase 2' },
            { step: 5, title: 'Interview Coordination', subtitle: 'Interviewer alignment', description: 'Schedule 45 interviews syncing departmental heads, HR managers, and candidates.', keyAction: 'Collect structured scorecards within 24h.', badge: 'Phase 3' },
            { step: 6, title: 'Selection, Offers & Analytics', subtitle: 'Hiring & conversion', description: 'Issue 15 offers, negotiate salaries within budget, confirm 10 joiners, and report metrics.', keyAction: 'Achieve 30-day timeline target.', badge: 'Phase 3' },
          ],
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('PART 3: PROJECT TASKS')) {
      result.push({
        type: 'assignment',
        data: {
          title: 'Capstone Practical Project: 200-Bed Hospital Recruitment Framework',
          durationMinutes: 180,
          objective: 'Construct and document the complete operational recruitment framework to fill all 13 hospital vacancies within 30 days while managing budget and compliance constraints.',
          tasks: [
            'Task 1: Prepare Manpower Requirement Sheets for all 5 roles specifying priority and budget.',
            'Task 2: Draft complete Job Descriptions and Job Specifications for Biomedical Engineer, HR Executive, and Receptionist.',
            'Task 3: Develop a Multi-Channel Sourcing Strategy Matrix and write 5 customized Boolean search strings.',
            'Task 4: Construct a Resume Screening Matrix evaluating the 5 fictional Biomedical Engineer candidates.',
            'Task 5: Build a Conflict-Free Interview Schedule syncing all 5 department heads and candidates.',
            'Task 6: Create weighted Candidate Scorecards and formulate a Selection Recommendation Report for the HR Executive role.',
            'Task 7: Maintain an Offer Management Tracker and calculate the 6 core recruitment performance metrics.',
          ],
          submissionFormat: 'Comprehensive PDF or Word Document (10–15 pages) + Recruitment Tracker Excel Sheet',
        },
      });
    }

    if (b.type === 'header' && b.data.text && b.data.text.includes('PART 9: MENTOR EVALUATION – YOUR RESPONSIBILITY')) {
      result.push({
        type: 'checklist',
        data: {
          title: 'Week 2 Graduation Readiness & Mentorship Evaluation Checklist',
          subtitle: 'Verify student operational independence across the complete recruitment lifecycle.',
          items: [
            'Recruitment Requisition: Asks the right questions regarding qualifications, experience, and budget',
            'Job Architecture: Prepares specific, realistic, and compliant JDs and Job Specifications',
            'Sourcing Strategy: Knows how to select channels and construct effective Boolean search strings',
            'Screening Accuracy: Distinguishes mandatory vs preferred criteria and investigates resume red flags',
            'Interview Coordination: Prepares conflict-free schedules and maintains high candidate experience',
            'Candidate Evaluation: Applies weighted scorecards and defends evidence-based hiring choices',
            'Offer Management: Understands compensation structures, salary negotiation, and offer tracking',
            'Analytics & Metrics: Accurately calculates screening rate, shortlisting ratio, and offer acceptance',
            'Achieved at least 35/50 (70%) on the Week 2 Comprehensive Written Assessment',
            'Scored at least 70/100 on the 200-Bed Hospital Practical Recruitment Project',
          ],
        },
      });
    }
  }
  return result;
}

module.exports = {
  buildDay8,
  buildDay9,
  buildDay10,
  buildDay11,
  buildDay12,
  buildDay13,
  buildDay14,
};
