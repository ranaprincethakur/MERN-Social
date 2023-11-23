import ChatModel from "../Modals/chatModel.js";

export const createChat = async (req, res) => {
  try {
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    await newChat.save();
    res.status(200).send({
      success: true,
      message: "new chat created",
      newChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while creating chat",
    });
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).send({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
    });
  }
};
export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).send({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
    });
  }
};
