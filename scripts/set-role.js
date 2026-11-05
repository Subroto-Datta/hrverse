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

const targetRole = process.argv[2] || 'admin';
const targetEmail = process.argv[3] || 'subroto.d@somaiya.edu';

if (!['admin', 'student'].includes(targetRole)) {
  console.error('Invalid role. Please specify "admin" or "student".');
  process.exit(1);
}

async function setRole() {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ role: targetRole, updated_at: new Date().toISOString() })
    .eq('email', targetEmail)
    .select()
    .single();

  if (error) {
    console.error('Failed to update role:', error.message);
    process.exit(1);
  }

  console.log(`✓ Successfully updated role for ${profile.full_name} (${profile.email}) to: [${profile.role}]`);
  console.log(`Now you can visit ${targetRole === 'admin' ? 'http://localhost:3000/admin' : 'http://localhost:3000/dashboard'} in your browser.`);
}

setRole().catch(console.error);

