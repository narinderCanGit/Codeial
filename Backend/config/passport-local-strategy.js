const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
          req.flash("error", "Invalid credentials");
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        req.flash("error", err);
        return done(err);
      }
    }
  )
);

// If you're using JWT, you don’t need:
// express-session, passport.serializeUser,passport.deserializeUser

// serializing the user to decide which key is to be kept in the cookies for maintaining session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Serialization: Controls what data about the user is stored in the session.
// Deserialization: Converts the stored session data (e.g. user ID) back into a full user object on every request.
// Why: So you don’t have to manually look up the user in every route; Passport does it for you.

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"));
    }
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user --> Passport");
    return done(err);
  }
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
