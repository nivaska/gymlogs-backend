const router = require("express").Router();
const passport = require("passport");

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      authenticated: true,
    });
  } else {
    res.redirect("/auth/login/failure");
  }
});

router.get("/login/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    message: "logged out successfully",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failure",
  })
);

module.exports = router;
