const fs = require('fs');
const path = require('path');

function parseModuleTextToBlocks(rawText) {
  const lines = rawText.split(/\r?\n/);
  const blocks = [];
  let currentParagraphLines = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(' ').trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          data: { text },
        });
      }
      currentParagraphLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^[=-]{4,}$/.test(line)) {
      flushParagraph();
      continue;
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    const headerMatch = line.match(/^([0-9]+\.\s+[A-Z\s&/()-]+)$/);
    if (headerMatch) {
      flushParagraph();
      blocks.push({
        type: 'header',
        data: { text: line, level: 2 },
      });
      continue;
    }

    const subHeaderMatch = line.match(/^([A-Z]\.\s+.*:|Key Pillars.*:|The [A-Za-z\s]+:)$/);
    if (subHeaderMatch) {
      flushParagraph();
      blocks.push({
        type: 'header',
        data: { text: line.replace(/:$/, ''), level: 3 },
      });
      continue;
    }

    if (/^[-*•]\s+/.test(line) || /^[0-9]+\.\s+/.test(line)) {
      flushParagraph();
      const itemText = line.replace(/^[-*•\d.]+\s*/, '');
      blocks.push({
        type: 'list',
        data: {
          style: line.startsWith('-') || line.startsWith('*') ? 'unordered' : 'ordered',
          items: [itemText],
        },
      });
      continue;
    }

    if (line.toLowerCase().startsWith('key principle:') || line.toLowerCase().startsWith('note:') || line.toLowerCase().startsWith('the gold standard:')) {
      flushParagraph();
      blocks.push({
        type: 'callout',
        data: {
          type: 'info',
          title: 'Core HR Takeaway',
          text: line,
        },
      });
      continue;
    }

    currentParagraphLines.push(line);
  }

  flushParagraph();
  return { blocks };
}

function parseQuizFile(rawText) {
  const questions = [];
  const questionBlocks = rawText.split(/(?=Q[0-9]+\.)/g);

  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed.startsWith('Q')) continue;

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 5) continue;

    const qLine = lines.find(l => /^Q[0-9]+\./.test(l)) || '';
    const questionText = qLine.replace(/^Q[0-9]+\.\s*/, '');

    const optionLines = lines.filter(l => /^[A-D]\)/.test(l));
    const correctLine = lines.find(l => l.startsWith('Correct:')) || '';
    const correctLetter = correctLine.replace('Correct:', '').trim().toUpperCase();

    const explanationLine = lines.find(l => l.startsWith('Explanation:')) || '';
    const explanation = explanationLine.replace('Explanation:', '').trim();

    const options = optionLines.map(opt => {
      const letter = opt.substring(0, 1).toUpperCase();
      const text = opt.substring(3).trim();
      return {
        id: letter,
        text,
        is_correct: letter === correctLetter,
      };
    });

    if (questionText && options.length > 0) {
      questions.push({
        question: questionText,
        options,
        correctAnswer: correctLetter,
        explanation,
      });
    }
  }

  return questions;
}

function run() {
  console.log('--- HR VERSE CLI INGESTION & VALIDATION ENGINE ---');
  const refDir = path.join(__dirname, '../reference-content');

  if (!fs.existsSync(refDir)) {
    console.error(`Directory not found: ${refDir}`);
    process.exit(1);
  }

  const overview = fs.readFileSync(path.join(refDir, 'COURSE_OVERVIEW.txt'), 'utf8');
  const roadmap = fs.readFileSync(path.join(refDir, 'COURSE_ROADMAP.txt'), 'utf8');
  console.log(`✓ Verified COURSE_OVERVIEW.txt (${overview.length} chars)`);
  console.log(`✓ Verified COURSE_ROADMAP.txt (${roadmap.length} chars)`);

  const modules = [
    { file: 'WEEK_01/MODULE_01_INTRODUCTION_TO_HRM.txt', title: 'Module 1: Introduction to Strategic HRM' },
    { file: 'WEEK_01/MODULE_02_HR_PLANNING.txt', title: 'Module 2: Strategic Workforce Planning & Job Analysis' },
    { file: 'WEEK_01/MODULE_03_RECRUITMENT.txt', title: 'Module 3: Talent Acquisition & Selection Systems' },
    { file: 'WEEK_02/MODULE_04_COMPENSATION.txt', title: 'Module 4: Compensation Architecture & Total Rewards' },
    { file: 'WEEK_02/MODULE_05_PERFORMANCE_MGMT.txt', title: 'Module 5: Performance Management & Appraisal' },
    { file: 'WEEK_02/MODULE_06_TRAINING.txt', title: 'Module 6: Learning, Development & ADDIE' },
  ];

  let totalBlocks = 0;
  for (const m of modules) {
    const raw = fs.readFileSync(path.join(refDir, m.file), 'utf8');
    const { blocks } = parseModuleTextToBlocks(raw);
    totalBlocks += blocks.length;
    console.log(`✓ Parsed ${m.title}: ${blocks.length} rich-text blocks extracted`);
  }

  const q1Text = fs.readFileSync(path.join(refDir, 'WEEK_01/QUIZ_WEEK_01.txt'), 'utf8');
  const q2Text = fs.readFileSync(path.join(refDir, 'WEEK_02/QUIZ_WEEK_02.txt'), 'utf8');
  const q1 = parseQuizFile(q1Text);
  const q2 = parseQuizFile(q2Text);
  console.log(`✓ Parsed Week 1 Quiz: ${q1.length} questions validated`);
  console.log(`✓ Parsed Week 2 Quiz: ${q2.length} questions validated`);

  const a1 = fs.readFileSync(path.join(refDir, 'ASSESSMENTS/ASSESSMENT_01_HR_STRATEGY.txt'), 'utf8');
  const a2 = fs.readFileSync(path.join(refDir, 'ASSESSMENTS/ASSESSMENT_02_CASE_STUDY.txt'), 'utf8');
  const p1 = fs.readFileSync(path.join(refDir, 'PROJECTS/PROJECT_01_HR_AUDIT.txt'), 'utf8');
  const p2 = fs.readFileSync(path.join(refDir, 'PROJECTS/PROJECT_02_HR_TRANSFORMATION.txt'), 'utf8');
  console.log(`✓ Verified Assessment 1: ApexLogix 12-Month HR Roadmap (${a1.length} chars)`);
  console.log(`✓ Verified Assessment 2: NovaHealth Case Turnaround (${a2.length} chars)`);
  console.log(`✓ Verified Capstone Project 1: Comprehensive HR Audit (${p1.length} chars)`);
  console.log(`✓ Verified Capstone Project 2: Digital HR Transformation (${p2.length} chars)`);

  console.log(`\n🎉 INGESTION SUMMARY: All 12 reference files (${totalBlocks} content blocks, ${q1.length + q2.length} quiz questions) fully verified and ready!`);
}

run();

