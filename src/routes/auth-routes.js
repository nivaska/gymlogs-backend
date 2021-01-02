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
  res.statusMessage = "Authentication failed.";
  res.status(401).end();
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    message: "logged out successfully",
  });
});

router.post(
  "/google",
  passport.authenticate("google-id-token"),
  function (req, res) {
    if (req.user) {
      res.json({
        authenticated: true,
      });
    } else {
      res.statusMessage = "Authentication failed.";
      res.status(401).end();
    }
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/failure",
  }),
  function (req, res) {
    res.json({
      authenticated: true,
    });
  }
);

router.post("/register", async (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    res.statusMessage = "Incomplete information.";
    res.status(401).end();
    return;
  }

  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (user) {
    res.statusMessage = "The email account is already registered.";
    res.status(401).end();
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
      res.statusMessage = "An error occured while creating the account.";
      res.status(500).end();
    });
});

module.exports = router;
