require('dotenv').config();
const express = require('express');
const session = require("express-session");
const passport = require("./config/passport");  
const mongoose = require('mongoose');
const cors = require('cors');
const moviesRoutes = require('./routes/moviesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const authRoutes = require("./routes/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(cors({
  origin: "https://movies-api-gu0u.onrender.com",
  credentials: true
}));
app.use(express.json());

// Session + Passport
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://movies-api-gu0u.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// Rutas
app.use("/auth", require("./routes/auth.js"));
app.use('/categories', categoriesRoutes);
app.use('/movies', moviesRoutes);

app.get("/", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    return res.send(`Logged in as ${req.user.displayName}`);
  }

  res.send("Logged Out - Visit /api-docs");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB Connection Error:', err));

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
