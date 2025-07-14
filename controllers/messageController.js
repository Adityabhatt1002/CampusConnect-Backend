const Message = require("../model/Message");

const sendMessage = async (req, res) => {
  const { message: content } = req.body;
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const newMessage = await Message.create({
      content,
      sender: userId,
      groupId,
    });
    const populatedMessage = await newMessage.populate("sender", "name");
    res.status(201).json({ message: populatedMessage });
  } catch (err) {
    console.error("Send Message Error", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).populate("sender", "name");
    res.status(200).json(messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const sendFileMessage = async (req, res) => {
  console.log("Incoming file:", req.file);

  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const fileUrl = req.file.path;
    const originalName = req.file.originalname;
    
    const newMessage = await Message.create({
      content: `File: ${originalName}`,
      sender: userId,
      groupId,
      fileUrl,
      fileName: originalName,
    });
    const populatedMessage = await newMessage.populate("sender", "name");
    res.status(201).json({
      message: populatedMessage,
    });
  } catch (err) {
    console.error("File Upload error", err);
    res.status(500).json({
      message: "Failed to upload file",
    });
  }
};

module.exports = { sendMessage, getGroupMessages, sendFileMessage};
