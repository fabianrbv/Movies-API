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
const GithubStrategy = require("passport-github2").Strategy;

const app = express();

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware global
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

// Rutas base
app.use("/", require("./routes/auth.js"));

// Passport GitHub Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Login status
app.get('/', (req, res) => {
  res.send(
    req.session.user
      ? `Logged in as ${req.session.user.displayName}`
      : "Logged Out API is running! Visit /api-docs"
  );
});

// Callback GitHub
app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Conexion a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB Connection Error:', err));

// API Routes
app.use('/categories', categoriesRoutes);
app.use('/movies', moviesRoutes);
app.use('/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
