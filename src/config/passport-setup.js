const passport = require("passport");
const User = require("../models/user-model");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.HOST_URI}/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const currentUser = await User.findOne({
          userId: profile.id,
        });

        if (!currentUser) {
          const newUser = await new User({
            name: profile.displayName,
            userId: profile.id,
            profileImageUrl: profile.picture,
            email: profile.email,
            provider: profile.provider,
            created: new Date(),
          }).save();

          if (newUser) {
            done(null, newUser);
          }
        }
        done(null, currentUser);
      } catch (err) {
        done(null, false, "Error Occured");
      }
    }
  )
);
