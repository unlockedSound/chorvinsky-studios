const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  s3Key: { type: String, required: true },
  s3Url: { type: String, required: true },
  fileSize: { type: Number, required: true }, // File size in bytes
  category: { type: String, required: true, enum: ['home', 'film', 'models', 'tango'] },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema); 