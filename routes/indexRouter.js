const router = require("express").Router();
const passport = require("passport");
const { signUp } = require("../controllers/formController");
const { isAuth, isAdmin } = require("./authMiddleware");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/sign-up", signUp);

router.get("/", (req, res, next) => {
  res.send(
    '<h1>Homepage </h1> <p> Please <a href="/sign-up"> sign-up </a> <p> '
  );
});

router.get("/login", (req, res, next) => {
  const form = `
    <h1>Login Page</h1>
    <form method="POST" action="/login">
      Enter Username: <br>
      <input type="text" name="uname"><br>
      Enter Password: <br>
      <input type="password" name="pw"><br><br>
      <input type="submit" value="Submit">
    </form>
  `;
  res.send(form);
});

router.get("/sign-up", (req, res, next) => {
    res.render("sign_up_form");
});

router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
router.get("/login-success", (req, res, next) => {
  console.log(req.session);
  res.send("You successfully logged in.");
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
