const { Router } = require("express");
const { isMember, isAdmin } = require("./authMiddleware");

const messageRouter = Router();

messageRouter.get("/add", isMember, (req, res, next) => {
  res.send("You can create messages!");
});

messageRouter.get("/:id/delete", isAdmin, (req, res, next) => {
  res.send("You can delete messages!");
});


module.exports = messageRouter;