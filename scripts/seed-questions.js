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

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Read scripts/quiz-seed.sql
const sqlFile = path.join(__dirname, 'quiz-seed.sql');
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Parse rows from VALUES (...)
// Regex to extract each question row
const rowRegex = /\('([^']+)',\s*'((?:[^']|'')*)',\s*'([^']+)',\s*'((?:[^']|'')*)'::jsonb,\s*'([^']+)',\s*'((?:[^']|'')*)',\s*(\d+),\s*(\d+)\)/g;

const questions = [];
let match;
while ((match = rowRegex.exec(sqlContent)) !== null) {
  const quizId = match[1];
  const questionText = match[2].replace(/''/g, "'");
  const questionType = match[3];
  const optionsRaw = match[4].replace(/''/g, "'");
  const options = JSON.parse(optionsRaw);
  const correctAnswer = match[5];
  const explanation = match[6].replace(/''/g, "'");
  const points = parseInt(match[7], 10);
  const orderIndex = parseInt(match[8], 10);

  questions.push({
    quiz_id: quizId,
    question_text: questionText,
    question_type: questionType,
    options: options,
    correct_answer: correctAnswer,
    explanation: explanation,
    points: points,
    order_index: orderIndex,
  });
}

console.log(`Parsed ${questions.length} questions from quiz-seed.sql.`);

async function seed() {
  const { data: existing } = await supabase.from('quiz_questions').select('id');
  if (existing && existing.length > 0) {
    console.log(`Already found ${existing.length} questions in DB.`);
  }

  // Insert in chunks of 10
  for (let i = 0; i < questions.length; i += 10) {
    const chunk = questions.slice(i, i + 10);
    const { data, error } = await supabase.from('quiz_questions').insert(chunk).select();
    if (error) {
      console.error(`Error inserting chunk ${i / 10}:`, error.message);
    } else {
      console.log(`Inserted chunk ${i / 10 + 1}: ${data.length} questions.`);
    }
  }

  const { count } = await supabase.from('quiz_questions').select('*', { count: 'exact', head: true });
  console.log(`Total questions in database now: ${count}`);
}

seed().catch(console.error);

