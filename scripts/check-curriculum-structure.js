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

async function getStructure() {
  const { data: modules, error } = await supabase
    .from('modules')
    .select('id, course_id, title, order_index, parts(id, title, order_index, lessons(id, title, order_index, estimated_minutes))')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== MODULES, PARTS, AND LESSONS IN SUPABASE ===');
  modules.forEach(m => {
    console.log(`\nMODULE ${m.order_index}: [${m.id}] ${m.title} (course_id: ${m.course_id})`);
    (m.parts || []).sort((a,b) => a.order_index - b.order_index).forEach(p => {
      console.log(`  PART ${p.order_index}: [${p.id}] ${p.title}`);
      (p.lessons || []).sort((a,b) => a.order_index - b.order_index).forEach(l => {
        console.log(`    LESSON ${l.order_index}: [${l.id}] ${l.title} (${l.estimated_minutes}m)`);
      });
    });
  });
}

getStructure();

