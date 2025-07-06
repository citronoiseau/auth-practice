const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

const validateUser = [
  body("first_name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be 2 to 30 characters"),
  body("last_name")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be 2 to 30 characters"),
  body("username")
    .trim()
    .toLowerCase()
    .matches(/^[a-zA-Z0-9_]{3,20}$/)
    .withMessage(
      "Username must be 3–20 characters and contain only letters, numbers, and underscores"
    )
    .custom(async (value) => {
      const user = await db.findUserByUserName(value);
      if (user) {
        throw new Error("Username already in use");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const signUp = [
  ...validateUser,
  asyncHandler(async (req, res) => {
    console.log("Received form data:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (!errors.isEmpty()) {
        return res.status(400).render("sign_up_form", {
          errors: errors.array(),
        });
      }
    }
    const { first_name, last_name, username, password } = req.body;
    const isAdmin = req.body.isAdmin === 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.addUser(first_name, last_name, username, hashedPassword, isAdmin);
    res.redirect("/");
  }),
];

module.exports = { signUp };
