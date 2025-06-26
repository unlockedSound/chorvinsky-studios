const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function uploadSingleImage(filePath, category) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('category', category);

  try {
    console.log(`📤 Uploading ${path.basename(filePath)} to category: ${category}...`);
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully uploaded: ${result.originalName}`);
      console.log(`   Category: ${result.category}`);
      console.log(`   ID: ${result._id}`);
      return result;
    } else {
      const error = await response.json();
      console.error(`❌ Upload failed: ${error.error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node upload-single.js <file-path> <category>');
  console.log('Categories: home, film, models, tango');
  console.log('Example: node upload-single.js ./my-photo.jpg home');
  process.exit(1);
}

const [filePath, category] = args;
const validCategories = ['home', 'film', 'models', 'tango'];

if (!validCategories.includes(category)) {
  console.error(`❌ Invalid category. Must be one of: ${validCategories.join(', ')}`);
  process.exit(1);
}

uploadSingleImage(filePath, category); 