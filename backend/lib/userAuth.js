require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { omit } = require("lodash");
const { UserModel } = require("../models/User");
const userRepo = require("../repos/User");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// strategy for user signup with email and password
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, callback) => {
      // check if the user trying to login already exists in DB with the given email
      return userRepo
        .getByEmail(email)
        .then((user) => {
          if (user) {
            return callback(null, false, { message: "The user email has been taken already." });
          } else {
            const userAttributes = Object.keys(UserModel.schema.obj);
            const payload = {};
            userAttributes.forEach((key) => {
              if (req.body.hasOwnProperty(key)) payload[key] = req.body[key];
            });

            userRepo
              .create(payload)
              .then((data) => callback(null, omit(data.toJSON(), ["password"])))
              .catch((err) => callback(err));
          }
        })
        .catch((err) => callback(err));
    }
  )
);

// strategy for user login with email and password
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, callback) => {
      return userRepo
        .getByEmailAndPassword({ email, password })
        .then((user) => {
          if (!user) {
            return callback(null, false, { message: "Incorrect user email or password." });
          }
          return callback(null, user.toJSON(), {
            message: "The user has been logged in successfully",
          });
        })
        .catch((err) => callback(err));
    }
  )
);

// strategy for user authentication with a valid JWT token
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SERVER_JWT_SECRET,
    },
    function (jwtPayload, callback) {
      return userRepo
        .getById(jwtPayload.id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
