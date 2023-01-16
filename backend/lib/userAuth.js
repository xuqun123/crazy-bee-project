const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { UserModel } = require("../models/User");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, callback) => {
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      return UserModel.findOne({ email, password })
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

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    function (jwtPayload, callback) {
      return UserModel.findById(jwtPayload.id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
