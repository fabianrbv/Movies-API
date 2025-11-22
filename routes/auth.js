const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    res.redirect("/auth/success");
  }
);

router.get("/success", (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Failed to authenticate." });
});

router.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
