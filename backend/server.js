const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-interview')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error (ensure mongodb is running if using local):', err));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
