// import npm packages
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// import my scripts
dotenv.config();
const passportSetup = require("./src/config/passport-setup");
const authRoutes = require("./src/routes/auth-routes");
const dataRoutes = require("./src/routes/data-routes");

const config = require("./src/config/config-vars");
const app = express();

//setup middlewares for express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//setup routes
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
    });
  } else {
    next();
  }
};

app.use("/auth", authRoutes);
app.use("/data", authCheck, dataRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "service available",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "resource not found",
  });
});

// config mongo connection
console.log("connecting to mongo db");
mongoose.connect(
  config.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongo db");
    app.listen(process.env.PORT || config.DEV_PORT, () => {
      console.log("server started");
    });
  }
);
