const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3001/api';

async function uploadFile(filePath, category) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('category', category);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Uploaded: ${path.basename(filePath)} to category: ${category}`);
      return result;
    } else {
      console.error(`❌ Failed to upload: ${path.basename(filePath)}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error uploading ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

async function uploadAllPhotos() {
  console.log('🚀 Starting bulk photo upload...\n');

  // Upload home photos
  const homePhotos = [
    'public/chorvinskystudios-00045.jpg',
    'public/chorvinskystudios-02264.jpg',
    'public/chorvinskystudios-04984.jpg',
    'public/chorvinskystudios-05070.jpg',
    'public/chorvinskystudios--6.jpg',
    'public/chorvinskystudios-08849.jpg',
    'public/chorvinskystudios-05998.jpg',
    'public/chorvinskystudios-09282-2.jpg',
    'public/chorvinskystudios-06280-2.jpg',
    'public/chorvinskystudios-07703.jpg',
    'public/chorvinskystudios-09074.jpg',
    'public/chorvinskystudios-05255.jpg',
    'public/chorvinskystudios-07888.jpg',
    'public/chorvinskystudios-08185.jpg',
    // Add new images here:
    // 'public/your-new-image.jpg',
    // 'public/another-new-image.jpg'
  ];

  // Upload film photos
  const filmPhotos = [
    'public/film/chorvinskystudios-003.jpg',
    'public/film/chorvinskystudios-003-2.jpg',
    'public/film/chorvinskystudios-003-3.jpg',
    'public/film/chorvinskystudios-004-2.jpg',
    'public/film/chorvinskystudios-005.jpg',
    'public/film/chorvinskystudios-005-2.jpg',
    'public/film/chorvinskystudios-006.jpg',
    'public/film/chorvinskystudios-007.jpg',
    'public/film/chorvinskystudios-008-2.jpg',
    'public/film/chorvinskystudios-009.jpg',
    'public/film/chorvinskystudios-009-3.jpg',
    'public/film/chorvinskystudios-010-2.jpg',
    'public/film/chorvinskystudios-012-3.jpg',
    'public/film/chorvinskystudios-013-2.jpg',
    'public/film/chorvinskystudios-015-2.jpg',
    'public/film/chorvinskystudios-016-2.jpg',
    'public/film/chorvinskystudios-016-3.jpg',
    'public/film/chorvinskystudios-017-2.jpg',
    'public/film/chorvinskystudios-018.jpg',
    'public/film/chorvinskystudios-019.jpg',
    'public/film/chorvinskystudios-020.jpg',
    'public/film/chorvinskystudios-023.jpg',
    'public/film/chorvinskystudios-023-2.jpg',
    'public/film/chorvinskystudios-025.jpg',
    'public/film/chorvinskystudios-028.jpg',
    'public/film/chorvinskystudios-031.jpg',
    'public/film/chorvinskystudios-032.jpg',
    'public/film/chorvinskystudios-033.jpg'
  ];

  console.log('📸 Uploading home photos...');
  for (const photo of homePhotos) {
    if (fs.existsSync(photo)) {
      await uploadFile(photo, 'home');
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n🎬 Uploading film photos...');
  for (const photo of filmPhotos) {
    if (fs.existsSync(photo)) {
      await uploadFile(photo, 'film');
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n✅ Bulk upload completed!');
}

// Run the upload
uploadAllPhotos().catch(console.error); 