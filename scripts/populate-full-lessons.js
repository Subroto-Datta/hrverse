const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local
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

// Import parser logic from ingest.js
const { parseModuleTextToBlocks } = require('./ingest.js');

const mapping = [
  { id: 'd1b2c3d4-0001-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_01/MODULE_01_INTRODUCTION_TO_HRM.txt' },
  { id: 'd1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_01/MODULE_02_HR_PLANNING.txt' },
  { id: 'd1b2c3d4-0003-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_01/MODULE_03_RECRUITMENT.txt' },
  { id: 'd1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_02/MODULE_04_COMPENSATION.txt' },
  { id: 'd1b2c3d4-0005-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_02/MODULE_05_PERFORMANCE_MGMT.txt' },
  { id: 'd1b2c3d4-0006-7a8b-9c0d-1e2f3a4b5c6d', file: 'WEEK_02/MODULE_06_TRAINING.txt' },
];

async function updateLessons() {
  const baseDir = path.join(__dirname, '..', 'reference-content');

  for (const item of mapping) {
    const filePath = path.join(baseDir, item.file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { blocks } = parseModuleTextToBlocks(raw);

    const { error } = await supabase
      .from('lessons')
      .update({
        content: { blocks },
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) {
      console.error(`Error updating lesson ${item.id}:`, error.message);
    } else {
      console.log(`✓ Lesson ${item.id} populated with ${blocks.length} rich-text blocks (${item.file})`);
    }
  }

  console.log('\nAll 6 lessons fully populated with comprehensive educational content!');
}

updateLessons().catch(console.error);

