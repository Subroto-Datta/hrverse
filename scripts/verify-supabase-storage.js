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

async function verify() {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, estimated_minutes, updated_at, content')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n=== DIRECT QUERY FROM SUPABASE POSTGRES DATABASE ===');
  data.forEach((l) => {
    const blocks = l.content?.blocks || [];
    const tableBlocks = blocks.filter(b => b.type === 'table').length;
    const listBlocks = blocks.filter(b => b.type === 'list').length;
    const headerBlocks = blocks.filter(b => b.type === 'header').length;
    const interactiveBlocks = blocks.filter(b => !['paragraph', 'header', 'list', 'table'].includes(b.type)).length;
    
    console.log(`\n• Lesson ID: ${l.id}`);
    console.log(`  Title: "${l.title}"`);
    console.log(`  Blocks in DB column 'content': ${blocks.length} total`);
    console.log(`  Breakdown: ${headerBlocks} headers, ${tableBlocks} tables, ${listBlocks} lists, ${interactiveBlocks} interactive visual widgets`);
    console.log(`  Last Updated At: ${l.updated_at}`);
  });
}

verify();
