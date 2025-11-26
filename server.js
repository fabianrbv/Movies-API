require('dotenv').config();
const express = require('express');
const session = require("express-session");
const passport = require("./config/passport");  // ESTA ES LA ÚNICA CONFIG PASSPORT
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
app.use(cors());
app.use(express.json());

// Session + Passport
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// CORS Headers (solo una vez)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, OPTIONS, DELETE"
  );
  next();
});

// Rutas
app.use("/", require("./routes/auth.js"));
app.use('/categories', categoriesRoutes);
app.use('/movies', moviesRoutes);

app.get("/", (req, res) => {
  if (req.user) {
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
