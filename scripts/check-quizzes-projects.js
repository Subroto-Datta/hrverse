const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
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

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function checkProjectsAndQuizzes() {
  const { data: qData, error: qErr } = await supabase.from('quizzes').select('*');
  console.log('Quizzes in DB:', qData);
  if (qErr) console.error('Quizzes err:', qErr);

  const { data: pData, error: pErr } = await supabase.from('projects').select('*');
  console.log('Projects in DB:', pData);
  if (pErr) console.error('Projects err:', pErr);
}

checkProjectsAndQuizzes();

