const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);
router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

// router.get('/sign-up', usersController.signUp);
// router.get('/sign-in', usersController.signIn);

router.post("/sign-up", usersController.signUp);

// use passport as a middleware to authenticate
router.post("/sign-in", usersController.signIn);

router.get("/sign-out", usersController.logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
//scope means data we wnt to fetch from google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.signIn
);

module.exports = router;
