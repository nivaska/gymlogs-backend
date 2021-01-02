const passport = require("passport");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local").Strategy;
var GoogleTokenStrategy = require("passport-google-id-token");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize user"));
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return done(null, false, { message: "User Not Found." });
      }

      if (bcrypt.compareSync(password, user.password)) {
        done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password." });
      }
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
    },
    async (parsedToken, googleId, done) => {
      const user = await User.findOne({
        email: parsedToken.payload.email,
      });

      if (user) return done(null, user);

      const newUser = new User({
        userId: googleId,
        email: parsedToken.payload.email,
        name: parsedToken.payload.name,
        photo: parsedToken.payload.picture,
        provider: "google",
        created: new Date(),
      });

      newUser
        .save()
        .then((result) => {
          return done(null, newUser);
        })
        .catch((err) => {
          console.log(err)
          return done(err, false);
        });
    }
  )
);
