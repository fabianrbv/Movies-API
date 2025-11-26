const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
require("dotenv").config();

// Guardamos solo el ID del usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Obtenemos el usuario desde la DB cuando llega una sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Estrategia de login con GitHub
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si ya existe
        let existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Crear nuevo usuario
        const newUser = new User({
          githubId: profile.id,
          displayName: profile.displayName,
          username: profile.username,
          avatar: profile.photos?.[0]?.value,
          email: profile.emails?.[0]?.value,
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;