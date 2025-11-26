const router = require("express").Router();
const passport = require("../config/passport");

router.use("/categoriesRoutes", require("./categoriesRoutes"));
router.use("/moviesRoutes", require("./moviesRoutes"));

router.get("/login", passport.authenticate("github"), (req, res) => {});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { 
      return next(err); 
    }
    res.redirect("/");
  });
});

module.exports = router;
