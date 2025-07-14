const Message = require("../model/Message");

const deleteMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(403).json({
        error: "Message not found",
      });
    }

    if (message.sender.toString() != userId.toString()) {
      console.log("Unauthorized Delete Attempt");
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this message" });
    }

    const now = new Date();
    const sentTime = new Date(message.createdAt);
    const diffHours = (now - sentTime) / (1000 * 60 * 60);

    if (diffHours > 24) {
      return res
        .status(403)
        .json({
          error:
            "Delete window expired. Messages can only be deleted within 24 hours.",
        });
    }

    // ✅ Instead of deleting, mark message as deleted
    message.content = "This message was deleted.";
    message.fileUrl = null;
    message.fileName = null;
    await message.save();
    console.log("Message deleted successfully");
    return res.json({
      success: true,
      message: "Message deleted sucessfully",
    });
  } catch (err) {
    console.error("Error deleting message:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
module.exports = { deleteMessageById };
