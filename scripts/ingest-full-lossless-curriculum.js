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

// Import the day builders from scratch directory
const scratchDir = path.join('C:', 'Users', 'Subroto Datta', '.gemini', 'antigravity', 'brain', 'ea34f7f9-a6fb-4e9b-8bc0-acb748ccf0c9', 'scratch');
const { getDayBlocks } = require(path.join(scratchDir, 'day_builders'));

const LESSON_MAPPING = [
  { day: 1, id: 'd1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 1: Introduction to Human Resource Management', minutes: 210 },
  { day: 2, id: 'd1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 2: HR Department Structure, Roles & Responsibilities', minutes: 220 },
  { day: 3, id: 'd1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 3: Employee Lifecycle Management (Attraction to Separation)', minutes: 240 },
  { day: 4, id: 'd1b2c3d4-0007-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 4: HR Policies, Workplace Rules, Culture & Code of Conduct', minutes: 230 },
  { day: 5, id: 'd1b2c3d4-0008-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 5: Strategic HRM, Workforce Planning & HR Metrics', minutes: 240 },
  { day: 6, id: 'd1b2c3d4-0009-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 6: Healthcare HR Management: Hospital Staffing & Shifts', minutes: 240 },
  { day: 7, id: 'd1b2c3d4-0010-7a8b-9c0d-1e2f3a4b5c6d', title: 'Day 7: Comprehensive Revision, Practical Test & Capstone Project', minutes: 240 },
];

async function ingestAll() {
  console.log('================================================================');
  console.log('INGESTING 100% COMPLETE & LOSSLESS WEEK 1 CURRICULUM INTO SUPABASE');
  console.log('================================================================');

  let totalBlocksAllDays = 0;

  for (const item of LESSON_MAPPING) {
    console.log(`\nProcessing Day ${item.day}: ${item.title}...`);
    const blocks = getDayBlocks(item.day);
    console.log(`  -> Generated ${blocks.length} structured & visual blocks`);

    // Verify content length
    let totalTextChars = 0;
    blocks.forEach(b => {
      if (b.type === 'paragraph' && b.data?.text) totalTextChars += b.data.text.length;
      if (b.type === 'header' && b.data?.text) totalTextChars += b.data.text.length;
      if (b.type === 'table') {
        const hLen = (b.data?.headers || []).join(' ').length;
        const rLen = (b.data?.rows || []).map(r => r.join(' ')).join(' ').length;
        totalTextChars += (hLen + rLen);
      }
      if (b.type === 'list') {
        totalTextChars += (b.data?.items || []).join(' ').length;
      }
    });
    console.log(`  -> Total content text characters: ${totalTextChars}`);

    const { error } = await supabase
      .from('lessons')
      .update({
        content: { blocks },
        estimated_minutes: item.minutes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) {
      console.error(`  ❌ Error updating ${item.title}:`, error);
      throw error;
    }

    console.log(`  ✓ Successfully updated in database!`);
    totalBlocksAllDays += blocks.length;
  }

  console.log('\n================================================================');
  console.log(`ALL 7 DAYS INGESTED SUCCESSFULLY! Total Blocks: ${totalBlocksAllDays}`);
  console.log('================================================================');
}

ingestAll().catch(err => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});

