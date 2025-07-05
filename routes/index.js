const router = require("express").Router();
const passport = require("passport");
const pool = require("../config/database");
const { isAuth, isAdmin } = require("./authMiddleware");

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query("insert into users (username, password) values ($1, $2)", [
      req.body.username,
      hashedPassword,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
  const form = `
    <h1>Register Page</h1>
    <form method="post" action="sign-up">
      Enter Username: <br>
      <input type="text" name="username"><br>
      Enter Password: <br>
      <input type="password" name="password"><br><br>
      <input type="submit" value="Submit">
    </form>
  `;
  res.send(form);
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
