const { Router } = require("express");
const { isAuth, isAdmin } = require("./authMiddleware");
const { addMessage, deleteMessage } = require("../controllers/messagesController");

const messageRouter = Router();

messageRouter.get("/add", isAuth, (req, res, next) => {
  res.render("message_form");
});
messageRouter.post("/add", isAuth, addMessage);

messageRouter.post("/:id/delete", isAdmin, deleteMessage);


module.exports = messageRouter;