require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const filesRouter = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api', filesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 