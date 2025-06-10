import { CollegeData, QuickAction } from '../types/chatbot';

// This simulates data that would typically come from an Excel sheet
export const collegeDatabase: CollegeData[] = [
  // Admissions
  {
    id: '1',
    category: 'Admissions',
    question: 'What are the admission requirements?',
    answer: 'Our admission requirements include: High school diploma or equivalent, SAT score of 1200+ or ACT score of 25+, GPA of 3.0 or higher, completed application form, personal essay, and two letters of recommendation. We also consider extracurricular activities and community service.',
    keywords: ['admission', 'requirements', 'sat', 'act', 'gpa', 'application', 'essay', 'recommendation'],
    relatedTopics: ['Application Deadlines', 'Scholarships', 'Transfer Credits']
  },
  {
    id: '2',
    category: 'Admissions',
    question: 'When are the application deadlines?',
    answer: 'Application deadlines are: Early Decision - November 15th, Regular Decision - January 15th, Spring Admission - October 1st. We recommend applying early as some programs have limited enrollment.',
    keywords: ['deadline', 'application', 'early decision', 'regular decision', 'spring', 'enrollment'],
    relatedTopics: ['Admission Requirements', 'Financial Aid']
  },
  {
    id: '3',
    category: 'Admissions',
    question: 'What is the acceptance rate?',
    answer: 'Our current acceptance rate is approximately 65%. We admit students based on academic merit, extracurricular involvement, and potential for success in their chosen field.',
    keywords: ['acceptance rate', 'admission', 'merit', 'academic'],
    relatedTopics: ['Admission Requirements', 'Student Statistics']
  },

  // Academic Programs
  {
    id: '4',
    category: 'Academics',
    question: 'What degree programs do you offer?',
    answer: 'We offer over 80 undergraduate programs and 30 graduate programs across 6 colleges: College of Arts & Sciences, Business School, Engineering, Education, Health Sciences, and Fine Arts. Popular programs include Computer Science, Business Administration, Nursing, Psychology, and Engineering.',
    keywords: ['degree', 'programs', 'undergraduate', 'graduate', 'computer science', 'business', 'nursing', 'psychology', 'engineering'],
    relatedTopics: ['Course Catalog', 'Faculty', 'Research Opportunities']
  },
  {
    id: '5',
    category: 'Academics',
    question: 'What is the student-to-faculty ratio?',
    answer: 'Our student-to-faculty ratio is 12:1, ensuring small class sizes and personalized attention. The average class size is 18 students, allowing for meaningful interaction between students and professors.',
    keywords: ['student faculty ratio', 'class size', 'professors', 'interaction'],
    relatedTopics: ['Faculty', 'Academic Support']
  },
  {
    id: '6',
    category: 'Academics',
    question: 'Do you offer online courses?',
    answer: 'Yes! We offer hybrid and fully online programs in select fields including Business Administration, Education, Nursing (RN to BSN), and several certificate programs. All online courses maintain the same high academic standards as our on-campus programs.',
    keywords: ['online', 'courses', 'hybrid', 'distance learning', 'certificate'],
    relatedTopics: ['Degree Programs', 'Technology Resources']
  },

  // Campus Life
  {
    id: '7',
    category: 'Campus Life',
    question: 'What housing options are available?',
    answer: 'We offer several housing options: Traditional residence halls, suite-style housing, apartment-style living, and themed communities. All first-year students are required to live on campus. Housing includes meal plans and is equipped with WiFi, laundry facilities, and study spaces.',
    keywords: ['housing', 'dormitory', 'residence halls', 'apartments', 'meal plans', 'first year'],
    relatedTopics: ['Dining Services', 'Campus Safety', 'Student Activities']
  },
  {
    id: '8',
    category: 'Campus Life',
    question: 'What dining options are available?',
    answer: 'Our campus features 8 dining locations including the main dining hall, food court, coffee shops, and grab-and-go markets. We offer various meal plans and accommodate dietary restrictions including vegetarian, vegan, gluten-free, and halal options.',
    keywords: ['dining', 'food', 'meal plans', 'vegetarian', 'vegan', 'gluten-free', 'halal', 'cafeteria'],
    relatedTopics: ['Housing', 'Student Health', 'Campus Facilities']
  },
  {
    id: '9',
    category: 'Campus Life',
    question: 'What clubs and organizations are available?',
    answer: 'We have over 150+ student organizations including academic clubs, cultural organizations, recreational sports, Greek life, volunteer groups, and professional societies. Popular clubs include Student Government, Drama Club, Environmental Club, and various honor societies.',
    keywords: ['clubs', 'organizations', 'student government', 'greek life', 'sports', 'volunteer', 'honor society'],
    relatedTopics: ['Student Activities', 'Leadership Opportunities', 'Recreation']
  },

  // Financial Aid
  {
    id: '10',
    category: 'Financial Aid',
    question: 'What financial aid options are available?',
    answer: 'We offer comprehensive financial aid including federal grants, state grants, institutional scholarships, work-study programs, and student loans. Over 85% of our students receive some form of financial assistance. Merit scholarships range from $2,000 to full tuition.',
    keywords: ['financial aid', 'scholarships', 'grants', 'loans', 'work study', 'merit', 'tuition'],
    relatedTopics: ['Tuition Costs', 'FAFSA', 'Payment Plans']
  },
  {
    id: '11',
    category: 'Financial Aid',
    question: 'What is the cost of tuition?',
    answer: 'Current tuition rates: In-state students: $12,500/year, Out-of-state students: $24,000/year. Additional costs include housing ($8,500), meal plans ($4,200), books ($1,200), and personal expenses (varies). Total estimated cost ranges from $26,400-$37,900 annually.',
    keywords: ['tuition', 'cost', 'in-state', 'out-of-state', 'housing cost', 'meal plan cost', 'books'],
    relatedTopics: ['Financial Aid', 'Payment Plans', 'Scholarships']
  },
  {
    id: '12',
    category: 'Financial Aid',
    question: 'How do I apply for financial aid?',
    answer: 'Complete the FAFSA (Free Application for Federal Student Aid) by March 1st for priority consideration. You can apply at fafsa.gov. Additionally, submit our institutional scholarship application by February 15th. Our Financial Aid office provides free assistance with applications.',
    keywords: ['fafsa', 'financial aid application', 'scholarship application', 'deadline', 'assistance'],
    relatedTopics: ['Financial Aid', 'Deadlines', 'Student Services']
  },

  // Campus Services
  {
    id: '13',
    category: 'Services',
    question: 'What support services are available?',
    answer: 'We provide comprehensive support services: Academic advising, tutoring center, writing center, career services, counseling and psychological services, disability services, health center, library services, and IT support. All services are free for enrolled students.',
    keywords: ['support services', 'advising', 'tutoring', 'career services', 'counseling', 'disability', 'health', 'library'],
    relatedTopics: ['Academic Support', 'Student Health', 'Career Development']
  },
  {
    id: '14',
    category: 'Services',
    question: 'What career services do you offer?',
    answer: 'Our Career Services Center offers resume writing assistance, interview preparation, job search strategies, career fairs, internship placement, alumni networking events, and graduate school preparation. We maintain partnerships with over 500 employers nationwide.',
    keywords: ['career services', 'resume', 'interview', 'job search', 'internship', 'networking', 'employers'],
    relatedTopics: ['Alumni Network', 'Student Services', 'Professional Development']
  },

  // Facilities
  {
    id: '15',
    category: 'Facilities',
    question: 'What facilities are available on campus?',
    answer: 'Our 300-acre campus includes: Modern library with 24/7 study spaces, state-of-the-art science laboratories, computer labs, fitness center, Olympic-size pool, multiple sports fields, performing arts center, art studios, and maker spaces. All buildings are connected by covered walkways.',
    keywords: ['facilities', 'library', 'laboratories', 'computer labs', 'fitness center', 'pool', 'sports', 'arts center'],
    relatedTopics: ['Recreation', 'Academic Resources', 'Student Life']
  },
  {
    id: '16',
    category: 'Facilities',
    question: 'What recreational facilities do you have?',
    answer: 'Recreation facilities include: Fitness center with cardio and weight equipment, group fitness studios, indoor track, basketball courts, racquetball courts, Olympic pool, outdoor sports fields, tennis courts, and a rock climbing wall. All facilities are free for students.',
    keywords: ['recreation', 'fitness', 'gym', 'pool', 'basketball', 'tennis', 'climbing', 'sports'],
    relatedTopics: ['Campus Facilities', 'Student Health', 'Intramural Sports']
  }
];

export const quickActions: QuickAction[] = [
  { id: '1', label: 'Admission Requirements', query: 'What are the admission requirements?', icon: 'GraduationCap' },
  { id: '2', label: 'Tuition Costs', query: 'What is the cost of tuition?', icon: 'DollarSign' },
  { id: '3', label: 'Campus Housing', query: 'What housing options are available?', icon: 'Home' },
  { id: '4', label: 'Degree Programs', query: 'What degree programs do you offer?', icon: 'BookOpen' },
  { id: '5', label: 'Financial Aid', query: 'What financial aid options are available?', icon: 'CreditCard' },
  { id: '6', label: 'Campus Tour', query: 'How can I schedule a campus tour?', icon: 'MapPin' }
];