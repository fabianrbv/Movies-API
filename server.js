require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moviesRoutes = require('./routes/moviesRoutes');
const categoriesRoutes = require('./routes/categories');

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('DB Connection Error:', err));

// Routes
app.use('/categories', categoriesRoutes);
app.use('/movies', moviesRoutes);

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
