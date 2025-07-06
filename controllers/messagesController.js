const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Title must be 2 to 30 characters"),
  body("content")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Last name must be 2 to 200 characters"),
];


const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await db.getAllMessages();
    if (!messages) {
    throw new Error("Messages are not found");
  }
  res.render("index", { messages  });
});

const addMessage = [
  ...validateMessage,
  asyncHandler(async (req, res) => {
    console.log("Received form data:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign_up_form", {
        errors: errors.array(),
      });
    }

    const { title, content } = req.body;
    const userId = req.user.id; 
    await db.addMessage(title, content, userId);
    res.redirect("/");
  }),
];

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
    const message = await db.getMessageById(id);
  if (!message) {
    return res.status(404).send("Message not found");
  }
  await db.deleteMessage(id);
  return res.redirect("/");
})

module.exports = { getAllMessages, addMessage, deleteMessage };