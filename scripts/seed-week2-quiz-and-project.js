const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
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

const MODULE_2_ID = 'b1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d';
const COURSE_ID = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const WEEK_2_QUIZ_ID = 'e1b2c3d4-0002-7a8b-9c0d-1e2f3a4b5c6d';
const WEEK_2_PROJECT_ID = 'f1b2c3d4-0004-7a8b-9c0d-1e2f3a4b5c6d';

async function seedQuizAndProject() {
  console.log('=== Seeding Week 2 Quiz and Capstone Project ===');

  // 1. Update Quiz
  console.log('\n1. Updating Week 2 Quiz...');
  const { error: qErr } = await supabase
    .from('quizzes')
    .upsert({
      id: WEEK_2_QUIZ_ID,
      module_id: MODULE_2_ID,
      title: 'Week 2 Comprehensive Assessment: Recruitment & Talent Acquisition',
      description: '50-mark comprehensive weekly evaluation across recruitment fundamentals, job analysis, candidate sourcing, resume screening, structured interviews, scorecards, and offer management. Passing requirement: 35/50 (70%).',
      passing_score: 70,
      time_limit_minutes: 75,
      max_attempts: 3,
      is_published: true,
      updated_at: new Date().toISOString(),
    });
  if (qErr) throw qErr;
  console.log('  ✓ Week 2 Quiz metadata updated!');

  // 2. Delete old questions for Week 2 quiz and insert the comprehensive set
  console.log('\n2. Updating Quiz Questions for Week 2...');
  await supabase.from('quiz_questions').delete().eq('quiz_id', WEEK_2_QUIZ_ID);

  const questions = [
    // SECTION A – Recruitment Fundamentals (8 Marks)
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'What is the primary operational distinction between Recruitment and Talent Acquisition?',
      question_type: 'multiple_choice',
      options: [
        'Recruitment focuses on immediate vacancy filling, whereas Talent Acquisition is a long-term strategic capability to consistently attract, pipeline, and hire talent.',
        'Recruitment is performed only by corporate agencies, while Talent Acquisition is performed only by internal hospital staff.',
        'Recruitment is an eliminative negative process, while Talent Acquisition is solely about salary negotiation.',
        'There is no operational difference; both are interchangeable administrative terms for job posting.',
      ],
      correct_answer: 'Recruitment focuses on immediate vacancy filling, whereas Talent Acquisition is a long-term strategic capability to consistently attract, pipeline, and hire talent.',
      explanation: 'Recruitment addresses current immediate vacancies reactively, while Talent Acquisition strategically aligns workforce planning, employer branding, talent pipelines, and candidate experience for ongoing organizational capability.',
      points: 2,
      order_index: 1,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Which of the following is a major advantage of Internal Recruitment over External Recruitment?',
      question_type: 'multiple_choice',
      options: [
        'It introduces radical new technical methodologies from competitor firms.',
        'Faster turnaround time, lower recruitment cost, and verified cultural alignment with existing organizational knowledge.',
        'It automatically creates a much larger applicant pool with hundreds of diverse candidates.',
        'It eliminates the need for any supervisory interview or managerial approval.',
      ],
      correct_answer: 'Faster turnaround time, lower recruitment cost, and verified cultural alignment with existing organizational knowledge.',
      explanation: 'Internal recruitment leverages existing employees through promotions or transfers, drastically shortening hiring cycles, reducing agency spend, and boosting employee morale.',
      points: 3,
      order_index: 2,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'What is the key disadvantage an enterprise risks when relying exclusively on internal recruitment?',
      question_type: 'multiple_choice',
      options: [
        'Excessively high advertising and recruitment portal expenditures.',
        'Ripple effect creating subsequent vacancies, limited talent pool diversity, and risk of inbreeding without fresh industry perspectives.',
        'Immediate violation of National Medical Commission statutory guidelines.',
        'Candidate refusal to accept promotional title upgrades.',
      ],
      correct_answer: 'Ripple effect creating subsequent vacancies, limited talent pool diversity, and risk of inbreeding without fresh industry perspectives.',
      explanation: 'Promoting or transferring existing employees leaves their previous roles vacant (the ripple effect) and deprives the organization of external innovations and diverse market competencies.',
      points: 3,
      order_index: 3,
    },

    // SECTION B – Job Analysis and Sourcing (8 Marks)
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'In the triad of job architecture, what is the core difference between a Job Description (JD) and a Job Specification (JS)?',
      question_type: 'multiple_choice',
      options: [
        'A JD outlines the duties, tasks, and responsibilities of the role, while a JS details the candidate attributes, qualifications, skills, and experience required.',
        'A JD is prepared by the candidate, whereas a JS is drafted by the hospital union.',
        'A JD specifies the salary deductions, while a JS dictates the working hours.',
        'A JD is used only for external job portals, whereas a JS is kept strictly confidential within executive boardrooms.',
      ],
      correct_answer: 'A JD outlines the duties, tasks, and responsibilities of the role, while a JS details the candidate attributes, qualifications, skills, and experience required.',
      explanation: 'In simple terms: A JD defines what the employee is expected to do, while a JS defines what qualifications and competencies the candidate must possess.',
      points: 3,
      order_index: 4,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Which Boolean search operator should a healthcare recruiter use to find profiles that MUST contain both "Biomedical Engineer" and hospital equipment maintenance experience?',
      question_type: 'multiple_choice',
      options: [
        '"Biomedical Engineer" OR Hospital',
        '"Biomedical Engineer" NOT Maintenance',
        '"Biomedical Engineer" AND Hospital AND Maintenance',
        'Biomedical Engineer XOR Hospital',
      ],
      correct_answer: '"Biomedical Engineer" AND Hospital AND Maintenance',
      explanation: 'The AND operator mandates that all specified keywords must be present in the candidate profile, narrowing the search to relevant clinical technical professionals.',
      points: 2,
      order_index: 5,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'When sourcing for specialised medical or biomedical positions, why are Employee Referral Programmes considered one of the highest-quality recruitment channels?',
      question_type: 'multiple_choice',
      options: [
        'Existing clinical and engineering employees possess trusted peer networks and pre-screen for competency and culture fit.',
        'Referred candidates can bypass all background verification and credential checks.',
        'Employee referrals guarantee 100% acceptance with zero salary negotiation.',
        'Employee referrals are free of any bonus payments or operational administration.',
      ],
      correct_answer: 'Existing clinical and engineering employees possess trusted peer networks and pre-screen for competency and culture fit.',
      explanation: 'Employees stake their personal reputation when referring colleagues, leading to higher candidate quality, faster cultural integration, and superior retention.',
      points: 3,
      order_index: 6,
    },

    // SECTION C – Screening and Interview Coordination (10 Marks)
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'How should an HR Executive handle an unexplained one-year employment gap identified during resume screening?',
      question_type: 'multiple_choice',
      options: [
        'Immediately reject the candidate without any review because gaps always indicate poor work ethic.',
        'Treat it as a red flag to investigate respectfully during telephone screening or interview, rather than an automatic ground for rejection.',
        'Fabricate previous employment dates to allow the resume to pass automated ATS filters.',
        'Report the candidate to state labor authorities for resume inconsistency.',
      ],
      correct_answer: 'Treat it as a red flag to investigate respectfully during telephone screening or interview, rather than an automatic ground for rejection.',
      explanation: 'Employment gaps may arise from legitimate personal reasons such as higher education, family caregiving, health circumstances, or career transition. Fair HR practice requires non-judgmental professional verification.',
      points: 3,
      order_index: 7,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Why do research studies in industrial psychology overwhelmingly favor Structured Interviews over Unstructured Interviews?',
      question_type: 'multiple_choice',
      options: [
        'Structured interviews allow interviewers to speak spontaneously about sports and personal hobbies.',
        'Structured interviews use predefined, job-related questions and consistent rating rubrics, providing significantly higher predictive validity and minimizing unconscious bias.',
        'Structured interviews take less than 5 minutes to conduct.',
        'Structured interviews eliminate the need for the candidate to speak.',
      ],
      correct_answer: 'Structured interviews use predefined, job-related questions and consistent rating rubrics, providing significantly higher predictive validity and minimizing unconscious bias.',
      explanation: 'Asking identical job-related questions evaluated on standardized scorecards ensures fair candidate comparison, superior predictive accuracy, and legal defensibility against bias.',
      points: 3,
      order_index: 8,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'An authorized Technical Department Head becomes unexpectedly unavailable 30 minutes before a scheduled candidate interview. What is the immediate professional HR action?',
      question_type: 'multiple_choice',
      options: [
        'Leave the candidate waiting in the reception room indefinitely until someone notices.',
        'Immediately notify the candidate, apologize for the inconvenience, offer alternative available time slots, and confirm a rescheduled appointment.',
        'Cancel the vacancy completely and terminate the recruitment requisition.',
        'Conduct the advanced technical medical equipment assessment yourself without technical training.',
      ],
      correct_answer: 'Immediately notify the candidate, apologize for the inconvenience, offer alternative available time slots, and confirm a rescheduled appointment.',
      explanation: 'Candidate experience is a vital component of employer brand equity. Prompt, courteous communication, transparent apologies, and smooth rescheduling maintain professional trust.',
      points: 2,
      order_index: 9,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Why is it mandatory for HR to enforce that interviewers submit standardized Interview Feedback Forms within 24 hours of completing an interview?',
      question_type: 'multiple_choice',
      options: [
        'To prevent evaluation memory decay, eliminate subjective post-hoc rationalizations, and preserve an objective audit trail for hiring decisions.',
        'To ensure interviewers can be penalized with salary deductions.',
        'Because labor courts require daily submission of feedback forms to municipal authorities.',
        'To prevent the candidate from knowing their interview schedule.',
      ],
      correct_answer: 'To prevent evaluation memory decay, eliminate subjective post-hoc rationalizations, and preserve an objective audit trail for hiring decisions.',
      explanation: 'Interviewer memory of specific candidate answers degrades rapidly after 24–48 hours. Enforcing prompt feedback documentation prevents halo/horns effects and ensures consistent evidence-based selection.',
      points: 2,
      order_index: 10,
    },

    // SECTION D – Selection and Compensation (10 Marks)
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'What is a Candidate Scorecard and how does it support evidence-based selection?',
      question_type: 'multiple_choice',
      options: [
        'A spreadsheet that tracks daily employee biometric attendance hours.',
        'A structured evaluation tool that assigns ratings across weighted job-related competencies (e.g., technical knowledge, communication, problem-solving) to calculate an objective composite score.',
        'A list of negative personality traits used to disqualify union workers.',
        'A document sent to the candidate containing their credit bureau rating.',
      ],
      correct_answer: 'A structured evaluation tool that assigns ratings across weighted job-related competencies (e.g., technical knowledge, communication, problem-solving) to calculate an objective composite score.',
      explanation: 'Scorecards assign mathematical weights to core competencies, ensuring that technical and operational capabilities are measured objectively rather than through subjective intuition.',
      points: 2,
      order_index: 11,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'A candidate receives an annual Cost-to-Company (CTC) offer of ₹6,00,000 (₹50,000 monthly). Why is their actual monthly take-home (Net in-hand) salary lower than ₹50,000?',
      question_type: 'multiple_choice',
      options: [
        'Because the hospital administration retains 50% of salary as operational profit.',
        'Because CTC includes employer contributions (PF, insurance, gratuity) and annual bonuses, and Gross pay is subject to statutory employee deductions (Employee PF, Professional Tax, TDS).',
        'Because monthly CTC is divided into 14 annual payments.',
        'Because banks automatically charge a 20% convenience fee on direct payroll deposits.',
      ],
      correct_answer: 'Because CTC includes employer contributions (PF, insurance, gratuity) and annual bonuses, and Gross pay is subject to statutory employee deductions (Employee PF, Professional Tax, TDS).',
      explanation: 'CTC represents enterprise cost, not employee take-home cash. Monthly net pay equals Gross fixed earnings minus employee statutory withholdings (PF, ESI, Professional Tax, TDS).',
      points: 3,
      order_index: 12,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Which four parameters are standardly verified during pre-employment Background Verification (BGV) for hospital clinical and technical staff?',
      question_type: 'multiple_choice',
      options: [
        'Personal bank account balance, social media search history, political party registration, and gym memberships.',
        'Identity verification (Aadhaar/PAN), educational credentials, previous employment history with relieving letters, and professional council registrations (NMC/Nursing Council).',
        'Caste certificate, marriage verification, residential property title deeds, and passport stamp inspection.',
        'Credit card spending habits, vehicle loans, personal diary records, and WhatsApp chat history.',
      ],
      correct_answer: 'Identity verification (Aadhaar/PAN), educational credentials, previous employment history with relieving letters, and professional council registrations (NMC/Nursing Council).',
      explanation: 'Standard legal BGV is strictly job-related, focusing on identity, academic degrees, past employment tenures, reference checks, and mandatory council licensing.',
      points: 2,
      order_index: 13,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'A hospital recruitment team issues 40 employment offer letters during a hiring campaign. 32 candidates accept the offers, and 28 candidates eventually report to work on Day 1. Calculate the Offer Acceptance Rate and the Offer-to-Joining Ratio.',
      question_type: 'multiple_choice',
      options: [
        'Offer Acceptance Rate = 80%; Offer-to-Joining Ratio = 70%',
        'Offer Acceptance Rate = 70%; Offer-to-Joining Ratio = 80%',
        'Offer Acceptance Rate = 90%; Offer-to-Joining Ratio = 65%',
        'Offer Acceptance Rate = 85%; Offer-to-Joining Ratio = 50%',
      ],
      correct_answer: 'Offer Acceptance Rate = 80%; Offer-to-Joining Ratio = 70%',
      explanation: 'Offer Acceptance Rate = (32 ÷ 40) × 100 = 80%. Offer-to-Joining Ratio = (28 ÷ 40) × 100 = 70%.',
      points: 3,
      order_index: 14,
    },

    // SECTION E – Practical Case Study (14 Marks)
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'In the Day 14 Case Study, Candidate B achieves the highest numerical interview score (82/100) for a Biomedical Engineer role, but holds only a 3-year Diploma while the Job Specification strictly mandates a B.Tech in Biomedical Engineering. Should HR recommend Candidate B for hiring?',
      question_type: 'multiple_choice',
      options: [
        'Yes, because a high interview score always supersedes any mandatory educational qualifications.',
        'No. A high evaluation score cannot override non-negotiable statutory or policy eligibility criteria; HR must uphold mandatory requirements and recommend a qualifying candidate.',
        'Yes, if Candidate B agrees to take a 40% salary reduction.',
        'Yes, provided the hospital does not inform the NABH accreditation inspectors.',
      ],
      correct_answer: 'No. A high evaluation score cannot override non-negotiable statutory or policy eligibility criteria; HR must uphold mandatory requirements and recommend a qualifying candidate.',
      explanation: 'Mandatory eligibility criteria (such as specialized engineering or nursing degrees) are non-negotiable. Bypassing mandatory criteria introduces severe regulatory and clinical compliance risks.',
      points: 4,
      order_index: 15,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'During a final HR interview for an entry-level HR Executive role, which question is most effective in evaluating practical coordination and problem-solving abilities?',
      question_type: 'multiple_choice',
      options: [
        '"What is your favorite color and how does it make you feel?"',
        '"Describe a specific situation where you had to manage competing deadlines across multiple departments. How did you prioritize tasks and keep stakeholders informed?"',
        '"Can you recite the exact definition of Human Resource Management from your textbook?"',
        '"Do you plan on getting married or having children within the next 12 months?"',
      ],
      correct_answer: '"Describe a specific situation where you had to manage competing deadlines across multiple departments. How did you prioritize tasks and keep stakeholders informed?"',
      explanation: 'Behavioral STAR questions evaluate real demonstrated competency under past pressure, providing clear predictive evidence of how the candidate will execute daily HR tasks.',
      points: 3,
      order_index: 16,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'Immediately following the final selection of a candidate by the hiring panel, what chronological workflow must the HR Executive execute before the offer letter is delivered?',
      question_type: 'multiple_choice',
      options: [
        'Verify compensation expectations against approved budget → prepare formal proposal → obtain internal management and finance sign-off → generate official offer letter.',
        'Call the candidate immediately and verbally guarantee an unapproved salary.',
        'Publish the candidate name on social media before they sign the employment contract.',
        'Delete all previous interview notes and feedback scorecards.',
      ],
      correct_answer: 'Verify compensation expectations against approved budget → prepare formal proposal → obtain internal management and finance sign-off → generate official offer letter.',
      explanation: 'Internal governance requires budgetary verification and formal managerial authorization before releasing legally binding employment offer commitments.',
      points: 4,
      order_index: 17,
    },
    {
      quiz_id: WEEK_2_QUIZ_ID,
      question_text: 'A selected candidate signs and formally accepts an employment offer letter, but fails to report to the hospital on their scheduled Day 1 joining date without prior notice. What is the immediate operational HR protocol?',
      question_type: 'multiple_choice',
      options: [
        'Attempt professional telephone contact to verify safety/emergency status → update recruitment tracker to "No-Show" → notify department head → activate pre-identified backup shortlist candidate.',
        'Send an angry public message on social media threatening legal retaliation.',
        'Wait 30 days in silence hoping the candidate eventually arrives.',
        'Immediately shut down all clinical operations in the affected hospital department.',
      ],
      correct_answer: 'Attempt professional telephone contact to verify safety/emergency status → update recruitment tracker to "No-Show" → notify department head → activate pre-identified backup shortlist candidate.',
      explanation: 'Standard operational HR maintains pre-identified backup candidates in the talent pipeline. Promptly confirming candidate status and activating backups prevents costly clinical vacancy delays.',
      points: 3,
      order_index: 18,
    },
  ];

  for (const q of questions) {
    const { error: insErr } = await supabase.from('quiz_questions').insert(q);
    if (insErr) {
      console.error(`Error inserting question ${q.order_index}:`, insErr);
      throw insErr;
    }
  }
  console.log(`  ✓ Successfully seeded all ${questions.length} Week 2 quiz questions! Total points: 50.`);

  // 3. Upsert Week 2 Capstone Project
  console.log('\n3. Upserting Week 2 Capstone Project...');
  const { error: projErr } = await supabase
    .from('projects')
    .upsert({
      id: WEEK_2_PROJECT_ID,
      course_id: COURSE_ID,
      title: 'Capstone Project: 200-Bed Hospital Recruitment Operations Framework',
      description: 'Act as an HR Recruitment Executive managing an end-to-end 30-day hiring initiative to fill 13 clinical and operational vacancies for an expanding 200-bed hospital.',
      instructions: `### Project Scenario
You have joined the HR Department of a 200-bed multispeciality hospital as an HR Recruitment Executive.
The hospital is expanding its operations and needs to recruit employees across multiple clinical and administrative wings.

### 13 Vacancies Across 5 Departments:
1. **Biomedical Engineering**: 2 Biomedical Engineers (1–3 years experience, ICU equipment uptime focus)
2. **Nursing Services**: 5 Staff Nurses (1–3 years experience, B.Sc/GNM with State Nursing Council registration)
3. **Human Resources**: 1 HR Executive (0–2 years experience, recruitment coordination & onboarding)
4. **Hospital Administration**: 3 Hospital Receptionists (0–2 years experience, patient triage & registration)
5. **Diagnostic Laboratory**: 2 Lab Technicians (1–3 years experience, DMLT/BMLT pathology testing)

### Project Deliverables (7 Core Tasks):
- **Task 1: Manpower Requisition Portfolio**: Prepare 5 formal Manpower Requirement Sheets specifying position priority, reason for hiring, and budget.
- **Task 2: Job Architecture Dossier**: Draft 3 complete Job Descriptions and Job Specifications for Biomedical Engineer, HR Executive, and Hospital Receptionist with 4 measurable KPIs each.
- **Task 3: Recruitment Sourcing Strategy**: Construct a multi-channel sourcing matrix and write 5 customized Boolean search strings.
- **Task 4: Resume Screening Matrix**: Build a screening comparison table evaluating 5 candidate profiles against mandatory and preferred criteria.
- **Task 5: Conflict-Free Interview Schedule**: Coordinate a comprehensive schedule syncing all 5 department heads, HR managers, and candidates with buffer intervals.
- **Task 6: Weighted Candidate Scorecards**: Create competency scorecards out of 100 and formulate a Selection Recommendation Report for the HR Executive role.
- **Task 7: Offer Management & Analytics Tracker**: Maintain an Offer Management Tracker and calculate the 6 core recruitment metrics (Screening Rate, Shortlisting Ratio, Selection Ratio, Offer Acceptance Rate, Offer-to-Joining Ratio, Vacancy Fulfilment).`,
      rubric: [
        { criterion: 'Manpower Requisition & Priority Alignment', max_points: 10, description: 'Completeness and budget alignment of all 5 requisition sheets' },
        { criterion: 'Job Descriptions & Competency Specifications', max_points: 15, description: 'Rigor, realism, and measurable KPIs across 3 core positions' },
        { criterion: 'Sourcing Strategy & Boolean Architecture', max_points: 10, description: 'Channel diversification and Boolean query precision' },
        { criterion: 'Resume Screening & Matrix Evaluation', max_points: 15, description: 'Distinction of mandatory criteria and red flag investigation' },
        { criterion: 'Interview Scheduling & Coordination Plan', max_points: 10, description: 'Conflict-free timeline and candidate communication templates' },
        { criterion: 'Scorecards & Evidence-Based Selection', max_points: 15, description: 'Weighted evaluation and defensible hiring recommendation' },
        { criterion: 'Offer Management & Funnel Analytics', max_points: 25, description: 'Offer tracking accuracy and correct recruitment metric calculations' },
      ],
      max_score: 100,
      due_date: null,
      is_published: true,
      updated_at: new Date().toISOString(),
    });

  if (projErr) throw projErr;
  console.log('  ✓ Week 2 Capstone Project upserted successfully!');

  console.log('\n=== Week 2 Quiz and Project Seeding Complete! ===');
}

seedQuizAndProject().catch(err => {
  console.error('Fatal error seeding quiz/project:', err);
  process.exit(1);
});
