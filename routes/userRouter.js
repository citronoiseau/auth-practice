const { Router } = require("express");
const {giveMembership} = require("../controllers/usersController");
const { isAuth  } = require("./authMiddleware");
const userRouter = Router();

userRouter.get("/:id/membership",isAuth, (req, res, next) => {
  res.render("member_form");
});

userRouter.post("/:id/membership", isAuth, giveMembership);


module.exports = userRouter;