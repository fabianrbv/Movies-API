require('dotenv').config();
const express = require('express');
const session = require("express-session");
const passport = require("./config/passport");
const mongoose = require('mongoose');
const cors = require('cors');
const moviesRoutes = require('./routes/moviesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const authRoutes = require("./routes/auth");
const path = require("path");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(cors());
app.use(express.json());

// Sessions required for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret123",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('DB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('API is running! Visit /api-docs');
});

// Auth Routes Google OAuth
app.use("/auth", authRoutes);

// Routes
app.use('/categories', categoriesRoutes);
app.use('/movies', moviesRoutes);

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
