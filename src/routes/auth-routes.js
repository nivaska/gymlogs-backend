const router = require("express").Router();
const passport = require("passport");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const config = require("../config/config-vars");

router.get("/success", (req, res) => {
  if (req.user) {
    res.json({
      authenticated: true,
    });
  } else {
    res.redirect("/auth/failure");
  }
});

router.get("/failure", (req, res) => {
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
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/failure",
  })
);

router.post("/register", async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(500).json({
      accountCreated: false,
      message: "invalid information",
    });
    return;
  }

  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (user) {
    res.status(500).json({
      accountCreated: false,
      message: "user already exists",
    });
    return;
  }

  const passwordHash = bcrypt.hashSync(
    req.body.password,
    config.BCRYPT_SALT_ROUNDS
  );
  const newUser = new userModel({
    email: req.body.email,
    name: req.body.name,
    password: passwordHash,
    provider: "email",
    created: new Date(),
  });

  newUser
    .save()
    .then((result) => {
      res.json({
        accountCreated: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        accountCreated: false,
      });
    });
});

module.exports = router;
