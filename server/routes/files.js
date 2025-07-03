const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const { uploadToS3, generateSignedUrl, s3 } = require('../s3');

const router = express.Router();
const upload = multer();

// Upload file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!req.file || !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files (jpg, jpeg, png, gif, webp) are allowed.' });
    }

    const s3Result = await uploadToS3(req.file);
    const fileDoc = new File({
      originalName: req.file.originalname,
      s3Key: s3Result.Key,
      s3Url: s3Result.Location, // Keep original URL for reference
      fileSize: req.file.size, // Store file size in bytes
      category: req.body.category || 'home', // Default to home if no category provided
    });
    await fileDoc.save();
    
    // Return file with signed URL
    const fileWithSignedUrl = {
      ...fileDoc.toObject(),
      signedUrl: generateSignedUrl(s3Result.Key)
    };
    
    res.status(201).json(fileWithSignedUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all files with signed URLs
router.get('/files', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });
    const filesWithSignedUrls = files.map(file => ({
      ...file.toObject(),
      signedUrl: generateSignedUrl(file.s3Key)
    }));
    res.json(filesWithSignedUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get files by category with signed URLs
router.get('/files/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const files = await File.find({ category }).sort({ uploadDate: -1 });
    const filesWithSignedUrls = files.map(file => ({
      ...file.toObject(),
      signedUrl: generateSignedUrl(file.s3Key)
    }));
    res.json(filesWithSignedUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh signed URL for a specific file
router.get('/files/:id/signed-url', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const signedUrl = generateSignedUrl(file.s3Key);
    res.json({ signedUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file
router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from S3
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.s3Key
    }).promise();

    // Delete from database
    await File.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update file category
router.patch('/files/:id/category', async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    
    if (!category || !['home', 'film', 'models', 'tango'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const file = await File.findByIdAndUpdate(
      id, 
      { category }, 
      { new: true }
    );
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin authentication
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Get credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  // Check if environment variables are set
  if (!adminUsername || !adminPassword) {
    return res.status(500).json({ success: false, message: 'Admin credentials not configured' });
  }
  
  if (username === adminUsername && password === adminPassword) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router; 