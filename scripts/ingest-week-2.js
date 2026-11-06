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

const {
  buildDay8,
  buildDay9,
  buildDay10,
  buildDay11,
  buildDay12,
  buildDay13,
  buildDay14,
} = require('./week2-builders');

const MODULE_2_ID = 'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d';
const PART_1_ID = 'c1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d';
const PART_2_ID = 'c1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d';
const PART_3_ID = 'c1b2c3d4-0005-7a8b-9c0d-1e2f3a4b5c6d';

const WEEK_2_LESSONS = [
  {
    day: 8,
    id: 'd1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_1_ID,
    order_index: 1,
    title: 'Day 8: Introduction to Recruitment & Talent Acquisition',
    summary: 'Explore the foundations of recruitment vs talent acquisition, the 17-stage hiring lifecycle, and proactive candidate sourcing.',
    minutes: 210,
    fn: buildDay8,
  },
  {
    day: 9,
    id: 'd1b2c3d4-0005-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_1_ID,
    order_index: 2,
    title: 'Day 9: Job Analysis, Job Description (JD), Job Specification (JS) & Candidate Requirements',
    summary: 'Master job architecture: Job analysis methods, drafting professional JDs, defining mandatory candidate specifications, and setting KRAs/KPIs.',
    minutes: 220,
    fn: buildDay9,
  },
  {
    day: 10,
    id: 'd1b2c3d4-0006-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_2_ID,
    order_index: 1,
    title: 'Day 10: Recruitment Sources, Candidate Sourcing, LinkedIn Recruitment & Talent Pipeline Management',
    summary: 'Master proactive sourcing channels, Boolean search operators, LinkedIn recruitment, talent pipelines, and sourcing performance trackers.',
    minutes: 240,
    fn: buildDay10,
  },
  {
    day: 11,
    id: 'd1b2c3d4-0011-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_2_ID,
    order_index: 2,
    title: 'Day 11: Resume Screening, CV Analysis, Shortlisting Criteria, ATS & Candidate Evaluation',
    summary: 'Understand ATS parsing, CV vs resume differences, red flag audits, candidate screening matrices, and objective shortlisting rubrics.',
    minutes: 230,
    fn: buildDay11,
  },
  {
    day: 12,
    id: 'd1b2c3d4-0012-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_3_ID,
    order_index: 1,
    title: 'Day 12: Interview Planning, Interview Types, Interview Coordination & Candidate Experience',
    summary: 'Learn 9 interview formats, structured interview protocols, scheduling coordination, interviewer dossier preparation, and candidate experience.',
    minutes: 230,
    fn: buildDay12,
  },
  {
    day: 13,
    id: 'd1b2c3d4-0013-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_3_ID,
    order_index: 2,
    title: 'Day 13: Candidate Evaluation, Final Selection, Salary Negotiation & Offer Management',
    summary: 'Construct weighted scorecards, evaluate background verification, decode CTC vs in-hand pay, negotiate salary, and manage employment offers.',
    minutes: 240,
    fn: buildDay13,
  },
  {
    day: 14,
    id: 'd1b2c3d4-0014-7a8b-9c0d-1e2f3a4b5c6d',
    part_id: PART_3_ID,
    order_index: 3,
    title: 'Day 14: Recruitment Practical Project & Week 2 Comprehensive Assessment',
    summary: 'Apply end-to-end recruitment operations to a 200-bed hospital expansion: 13 vacancies across 5 departments, 50-mark exam, and 7 core project deliverables.',
    minutes: 240,
    fn: buildDay14,
  },
];

async function runIngestion() {
  console.log('================================================================');
  console.log('INGESTING FULL LOSSLESS WEEK 2 CURRICULUM INTO SUPABASE');
  console.log('================================================================');

  // 1. Update Module 2
  console.log('\n1. Updating Module 2 record...');
  const { error: modErr } = await supabase
    .from('modules')
    .upsert({
      id: MODULE_2_ID,
      course_id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Week 2: Recruitment & Talent Acquisition',
      description: 'Master the complete recruitment lifecycle: Manpower requisitions, job analysis, professional JDs, multi-channel sourcing, Boolean search, ATS optimization, resume screening, structured interviewing, candidate scorecards, salary negotiation, and 200-bed hospital recruitment operations.',
      order_index: 2,
      is_published: true,
      updated_at: new Date().toISOString(),
    });
  if (modErr) throw modErr;
  console.log('  ✓ Module 2 updated successfully!');

  // 2. Upsert Parts
  console.log('\n2. Updating Week 2 Parts...');
  const parts = [
    {
      id: PART_1_ID,
      module_id: MODULE_2_ID,
      title: 'Part 1: Recruitment Foundations & Job Architecture',
      order_index: 1,
    },
    {
      id: PART_2_ID,
      module_id: MODULE_2_ID,
      title: 'Part 2: Candidate Sourcing, Screening & ATS Systems',
      order_index: 2,
    },
    {
      id: PART_3_ID,
      module_id: MODULE_2_ID,
      title: 'Part 3: Interviewing, Selection & 200-Bed Hospital Capstone',
      order_index: 3,
    },
  ];

  for (const p of parts) {
    const { error: partErr } = await supabase
      .from('parts')
      .upsert(p);
    if (partErr) throw partErr;
    console.log(`  ✓ Part ${p.order_index} upserted: ${p.title}`);
  }

  // 3. Ingest Lessons
  console.log('\n3. Ingesting Lessons for Days 8 through 14...');
  let totalBlocks = 0;

  for (const item of WEEK_2_LESSONS) {
    console.log(`\nProcessing Day ${item.day}: ${item.title}...`);
    const blocks = item.fn();
    console.log(`  -> Generated ${blocks.length} structured & visual coursework blocks`);

    // Calculate text content size
    let textChars = 0;
    blocks.forEach(b => {
      if (b.type === 'paragraph' && b.data?.text) textChars += b.data.text.length;
      if (b.type === 'header' && b.data?.text) textChars += b.data.text.length;
      if (b.type === 'table') {
        const hLen = (b.data?.headers || []).join(' ').length;
        const rLen = (b.data?.rows || []).map(r => r.join(' ')).join(' ').length;
        textChars += (hLen + rLen);
      }
      if (b.type === 'list') {
        textChars += (b.data?.items || []).join(' ').length;
      }
    });
    console.log(`  -> Content characters: ${textChars}`);

    const { error: lessonErr } = await supabase
      .from('lessons')
      .upsert({
        id: item.id,
        part_id: item.part_id,
        order_index: item.order_index,
        title: item.title,
        slug: `day-${item.day}`,
        summary: item.summary,
        estimated_minutes: item.minutes,
        is_published: true,
        content: { blocks },
        updated_at: new Date().toISOString(),
      });

    if (lessonErr) {
      console.error(`  ❌ Error updating ${item.title}:`, lessonErr);
      throw lessonErr;
    }

    console.log(`  ✓ Successfully upserted into database!`);
    totalBlocks += blocks.length;
  }

  // 4. Upsert Week 2 Capstone Project
  console.log('\n4. Upserting Week 2 Capstone Project...');
  const { error: projErr } = await supabase
    .from('projects')
    .upsert({
      id: 'p1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
      module_id: MODULE_2_ID,
      title: 'Capstone Project: 200-Bed Hospital Recruitment Operations Framework',
      description: 'Manage an end-to-end hospital expansion hiring project: Coordinate 13 clinical and administrative vacancies across 5 departments within 30 days. Deliver manpower requisition sheets, JDs, sourcing matrices, screening sheets, interview schedules, candidate scorecards, and offer tracking records.',
      is_published: true,
      updated_at: new Date().toISOString(),
    });
  if (projErr) console.warn('Note on projects table:', projErr.message);
  else console.log('  ✓ Week 2 Capstone Project upserted successfully!');

  // 5. Upsert Week 2 Quiz
  console.log('\n5. Upserting Week 2 Comprehensive Quiz...');
  const { error: quizErr } = await supabase
    .from('quizzes')
    .upsert({
      id: 'q1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d',
      module_id: MODULE_2_ID,
      title: 'Week 2 Comprehensive Assessment: Recruitment & Talent Acquisition',
      description: 'Comprehensive 50-mark examination covering recruitment fundamentals, job analysis, candidate sourcing, resume screening, structured interviews, scorecards, and salary negotiation. Minimum passing score: 35/50 (70%).',
      passing_score: 70,
      time_limit_minutes: 75,
      is_published: true,
      updated_at: new Date().toISOString(),
    });
  if (quizErr) console.warn('Note on quizzes table:', quizErr.message);
  else console.log('  ✓ Week 2 Comprehensive Quiz upserted successfully!');

  console.log('\n================================================================');
  console.log(`WEEK 2 INGESTION COMPLETE! Total Blocks Ingested: ${totalBlocks}`);
  console.log('================================================================');
}

runIngestion().catch(err => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});
