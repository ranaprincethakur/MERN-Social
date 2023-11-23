import MessageModel from "../Modals/MessageModel.js";

export const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const result = await MessageModel.find({ chatId });
    res.status(200).send({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
    });
  }
};
