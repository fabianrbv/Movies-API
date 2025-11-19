require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moviesRoutes = require('./routes/moviesRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB Error', err));

// Routes
app.use('/movies', moviesRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
