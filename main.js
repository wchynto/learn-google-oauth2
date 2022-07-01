const express = require("express");
const passport = require("passport");
const session = require("express-session");

require("dotenv").config();
require("./config/auth");

const app = express();
const PORT = 3000;

app.use(session({ secret: "rurururu nappi" }));
app.use(passport.initialize());
app.use(passport.session());

const isLogin = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/", (req, res) => {
  res.send('<a href="auth/google">Authenticate with google </a> ');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong");
});

app.get("/protected", isLogin, (req, res) => {
  res.send(`Hello ${req.user.displayName} <br> <a href="/logout">logout</a>`);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
