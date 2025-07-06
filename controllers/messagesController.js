const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await db.getAllMessages();
    if (!messages) {
    throw new Error("Messages are not found");
  }
  res.render("index", { messages  });
});

module.exports = { getAllMessages };