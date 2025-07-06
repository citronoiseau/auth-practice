const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');
const indexRouter = require("./routes/indexRouter");
const messageRouter = require("./routes/indexRouter");
const pool = require("./db/database");
require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

require("./controllers/passport");
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
  res.locals.errors = req.flash("error"); 
  next();
});


app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/messages", messageRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
