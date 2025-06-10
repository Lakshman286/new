import express from 'express';
import cors from 'cors';
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for Excel data
let collegeData = [];
let datasetInfo = [];
let lastModified = new Map();

// Function to read all Excel files from data directory
function readAllExcelData() {
  try {
    const dataDir = join(__dirname, 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      createSampleExcelFiles(dataDir);
    }
    
    // Get all Excel files in the data directory
    const files = fs.readdirSync(dataDir).filter(file => 
      file.endsWith('.xlsx') || file.endsWith('.xls')
    );
    
    if (files.length === 0) {
      createSampleExcelFiles(dataDir);
      // Re-read files after creating samples
      const newFiles = fs.readdirSync(dataDir).filter(file => 
        file.endsWith('.xlsx') || file.endsWith('.xls')
      );
      files.push(...newFiles);
    }
    
    let totalRecords = 0;
    collegeData = [];
    datasetInfo = [];
    
    // Process each Excel file
    for (const file of files) {
      const filePath = join(dataDir, file);
      const stats = fs.statSync(filePath);
      
      // Check if file has been modified
      const lastMod = lastModified.get(file);
      if (lastMod && stats.mtime <= lastMod) {
        continue; // Skip unchanged files
      }
      
      lastModified.set(file, stats.mtime);
      
      try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        
        // Process all sheets in the workbook
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet);
          
          if (rawData.length === 0) continue;
          
          // Process and structure the data
          const processedData = rawData.map((row, index) => ({
            id: `${file}_${sheetName}_${index + 1}`,
            dataset: file.replace(/\.(xlsx|xls)$/i, ''),
            sheet: sheetName,
            category: row.Category || 'General',
            question: row.Question || '',
            answer: row.Answer || '',
            keywords: (row.Keywords || '').toLowerCase().split(',').map(k => k.trim()).filter(k => k),
            relatedTopics: row.RelatedTopics ? row.RelatedTopics.split(',').map(t => t.trim()) : []
          }));
          
          collegeData.push(...processedData);
          totalRecords += processedData.length;
          
          // Track dataset info
          const existingDataset = datasetInfo.find(d => d.file === file);
          if (existingDataset) {
            existingDataset.sheets.push({
              name: sheetName,
              records: processedData.length
            });
            existingDataset.totalRecords += processedData.length;
          } else {
            datasetInfo.push({
              file: file,
              name: file.replace(/\.(xlsx|xls)$/i, ''),
              sheets: [{
                name: sheetName,
                records: processedData.length
              }],
              totalRecords: processedData.length,
              lastModified: stats.mtime
            });
          }
        }
        
        console.log(`✅ Loaded ${file} successfully`);
      } catch (fileError) {
        console.error(`❌ Error reading ${file}:`, fileError.message);
      }
    }
    
    console.log(`📊 Total: ${totalRecords} records from ${files.length} Excel files`);
    console.log(`📁 Datasets: ${datasetInfo.map(d => d.name).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error reading Excel files:', error.message);
    
    // Fallback to sample data if Excel reading fails
    if (collegeData.length === 0) {
      collegeData = getSampleData();
      console.log('📝 Using sample data as fallback');
    }
  }
}

// Create multiple sample Excel files
function createSampleExcelFiles(dataDir) {
  // Admissions Dataset
  const admissionsData = [
    {
      Category: 'Admissions',
      Question: 'What are the admission requirements?',
      Answer: 'Our admission requirements include: High school diploma or equivalent, SAT score of 1200+ or ACT score of 25+, GPA of 3.0 or higher, completed application form, personal essay, and two letters of recommendation.',
      Keywords: 'admission,requirements,sat,act,gpa,application,essay,recommendation',
      RelatedTopics: 'Application Deadlines,Scholarships,Transfer Credits'
    },
    {
      Category: 'Admissions',
      Question: 'When are the application deadlines?',
      Answer: 'Application deadlines are: Early Decision - November 15th, Regular Decision - January 15th, Spring Admission - October 1st.',
      Keywords: 'deadline,application,early decision,regular decision,spring',
      RelatedTopics: 'Admission Requirements,Financial Aid'
    },
    {
      Category: 'Admissions',
      Question: 'What is the acceptance rate?',
      Answer: 'Our current acceptance rate is approximately 65%. We admit students based on academic merit, extracurricular involvement, and potential for success.',
      Keywords: 'acceptance rate,admission,merit,academic',
      RelatedTopics: 'Admission Requirements,Student Statistics'
    }
  ];

  // Academic Programs Dataset
  const academicsData = [
    {
      Category: 'Academics',
      Question: 'What degree programs do you offer?',
      Answer: 'We offer over 80 undergraduate programs and 30 graduate programs across 6 colleges: Arts & Sciences, Business, Engineering, Education, Health Sciences, and Fine Arts.',
      Keywords: 'degree,programs,undergraduate,graduate,computer science,business,nursing,psychology,engineering',
      RelatedTopics: 'Course Catalog,Faculty,Research'
    },
    {
      Category: 'Academics',
      Question: 'What is the student-to-faculty ratio?',
      Answer: 'Our student-to-faculty ratio is 12:1, ensuring small class sizes and personalized attention. Average class size is 18 students.',
      Keywords: 'student faculty ratio,class size,professors,interaction',
      RelatedTopics: 'Faculty,Academic Support'
    },
    {
      Category: 'Academics',
      Question: 'Do you offer online courses?',
      Answer: 'Yes! We offer hybrid and fully online programs in Business, Education, Nursing, and certificate programs with the same high standards.',
      Keywords: 'online,courses,hybrid,distance learning,certificate',
      RelatedTopics: 'Degree Programs,Technology Resources'
    }
  ];

  // Campus Life Dataset
  const campusLifeData = [
    {
      Category: 'Housing',
      Question: 'What housing options are available?',
      Answer: 'We offer traditional residence halls, suite-style housing, apartment-style living, and themed communities. All first-year students live on campus.',
      Keywords: 'housing,dormitory,residence halls,apartments,meal plans,first year',
      RelatedTopics: 'Dining Services,Campus Safety,Student Activities'
    },
    {
      Category: 'Dining',
      Question: 'What dining options are available?',
      Answer: 'Our campus features 8 dining locations including main dining hall, food court, coffee shops, and markets. We accommodate all dietary restrictions.',
      Keywords: 'dining,food,meal plans,vegetarian,vegan,gluten-free,halal,cafeteria',
      RelatedTopics: 'Housing,Student Health,Campus Facilities'
    },
    {
      Category: 'Activities',
      Question: 'What clubs and organizations are available?',
      Answer: 'We have 150+ student organizations including academic clubs, cultural groups, recreational sports, Greek life, and volunteer organizations.',
      Keywords: 'clubs,organizations,student government,greek life,sports,volunteer,honor society',
      RelatedTopics: 'Student Activities,Leadership,Recreation'
    }
  ];

  // Financial Aid Dataset
  const financialAidData = [
    {
      Category: 'Financial Aid',
      Question: 'What financial aid options are available?',
      Answer: 'We offer federal grants, state grants, institutional scholarships, work-study programs, and student loans. Over 85% of students receive financial assistance.',
      Keywords: 'financial aid,scholarships,grants,loans,work study,merit,tuition',
      RelatedTopics: 'Tuition Costs,FAFSA,Payment Plans'
    },
    {
      Category: 'Costs',
      Question: 'What is the cost of tuition?',
      Answer: 'In-state: $12,500/year, Out-of-state: $24,000/year. Additional costs: housing ($8,500), meals ($4,200), books ($1,200).',
      Keywords: 'tuition,cost,in-state,out-of-state,housing cost,meal plan cost,books',
      RelatedTopics: 'Financial Aid,Payment Plans,Scholarships'
    },
    {
      Category: 'Applications',
      Question: 'How do I apply for financial aid?',
      Answer: 'Complete the FAFSA by March 1st for priority consideration. Submit our scholarship application by February 15th. We provide free assistance.',
      Keywords: 'fafsa,financial aid application,scholarship application,deadline,assistance',
      RelatedTopics: 'Financial Aid,Deadlines,Student Services'
    }
  ];

  // Create separate Excel files
  const datasets = [
    { name: 'admissions_data.xlsx', data: admissionsData },
    { name: 'academic_programs.xlsx', data: academicsData },
    { name: 'campus_life.xlsx', data: campusLifeData },
    { name: 'financial_aid.xlsx', data: financialAidData }
  ];

  datasets.forEach(({ name, data }) => {
    const filePath = join(dataDir, name);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, filePath);
    console.log(`📊 Created sample file: ${name}`);
  });
}

// Fallback sample data
function getSampleData() {
  return [
    {
      id: '1',
      dataset: 'fallback',
      sheet: 'Data',
      category: 'General',
      question: 'How can I help you?',
      answer: 'I can help you with information about admissions, academics, campus life, financial aid, and more!',
      keywords: ['help', 'information', 'general'],
      relatedTopics: []
    }
  ];
}

// Enhanced fuzzy search function
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Enhanced smart response matching
function findBestMatch(userInput) {
  const input = userInput.toLowerCase().trim();
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const item of collegeData) {
    let score = 0;
    
    // Exact keyword matching (highest priority)
    for (const keyword of item.keywords) {
      if (input.includes(keyword)) {
        score += 3;
      }
      
      // Fuzzy matching for keywords
      const similarity = calculateSimilarity(input, keyword);
      if (similarity > 0.7) {
        score += similarity * 2;
      }
    }
    
    // Question similarity
    const questionSimilarity = calculateSimilarity(input, item.question.toLowerCase());
    if (questionSimilarity > 0.6) {
      score += questionSimilarity * 2;
    }
    
    // Category matching
    if (input.includes(item.category.toLowerCase())) {
      score += 1;
    }
    
    // Dataset relevance boost
    if (input.includes(item.dataset.toLowerCase())) {
      score += 0.5;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  
  return bestScore > 0.5 ? bestMatch : null;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    dataLoaded: collegeData.length > 0,
    recordCount: collegeData.length,
    datasets: datasetInfo.length,
    datasetInfo: datasetInfo,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/datasets', (req, res) => {
  res.json({ 
    datasets: datasetInfo,
    totalRecords: collegeData.length,
    totalFiles: datasetInfo.length
  });
});

app.get('/api/categories', (req, res) => {
  const categories = [...new Set(collegeData.map(item => item.category))];
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: collegeData.filter(item => item.category === cat).length,
    datasets: [...new Set(collegeData.filter(item => item.category === cat).map(item => item.dataset))]
  }));
  
  res.json({ 
    categories: categoryStats, 
    total: categories.length 
  });
});

app.get('/api/data', (req, res) => {
  const { category, dataset, limit = 50 } = req.query;
  
  let filteredData = collegeData;
  
  if (category && category !== 'all') {
    filteredData = filteredData.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (dataset && dataset !== 'all') {
    filteredData = filteredData.filter(item => 
      item.dataset.toLowerCase() === dataset.toLowerCase()
    );
  }
  
  res.json({
    data: filteredData.slice(0, parseInt(limit)),
    total: filteredData.length,
    categories: [...new Set(collegeData.map(item => item.category))],
    datasets: datasetInfo
  });
});

app.post('/api/chat', (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Message is required and must be a string' 
    });
  }
  
  // Reload Excel data periodically
  readAllExcelData();
  
  const bestMatch = findBestMatch(message);
  
  let response;
  let category = 'General';
  let relatedTopics = [];
  let sourceDataset = null;
  
  if (bestMatch) {
    response = bestMatch.answer;
    category = bestMatch.category;
    relatedTopics = bestMatch.relatedTopics || [];
    sourceDataset = {
      file: bestMatch.dataset,
      sheet: bestMatch.sheet
    };
  } else {
    // Generate helpful fallback response with available datasets
    const availableCategories = [...new Set(collegeData.map(item => item.category))];
    const availableDatasets = datasetInfo.map(d => d.name);
    
    response = `I'd be happy to help you with information about our college! I have data from ${availableDatasets.length} datasets covering: ${availableCategories.join(', ')}. Could you please be more specific about what you'd like to know?`;
  }
  
  res.json({
    response,
    category,
    relatedTopics,
    sourceDataset,
    confidence: bestMatch ? 0.8 : 0.3,
    timestamp: new Date().toISOString(),
    matchedItem: bestMatch ? bestMatch.id : null,
    availableDatasets: datasetInfo.map(d => ({ name: d.name, records: d.totalRecords }))
  });
});

app.post('/api/reload-data', (req, res) => {
  try {
    lastModified.clear(); // Force reload all files
    readAllExcelData();
    res.json({ 
      success: true, 
      message: 'All datasets reloaded successfully',
      recordCount: collegeData.length,
      datasets: datasetInfo.length,
      datasetInfo: datasetInfo
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Initialize data and start server
readAllExcelData();

app.listen(PORT, () => {
  console.log(`🚀 College Chatbot Server running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${collegeData.length} records from ${datasetInfo.length} datasets`);
  console.log(`📁 Excel files location: ${join(__dirname, 'data')}/`);
  console.log(`📋 Available datasets: ${datasetInfo.map(d => d.name).join(', ')}`);
});