const router = require("express").Router();
const passport = require("../config/passport");

// Login con GitHub (usa scope)
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    res.redirect("/");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
