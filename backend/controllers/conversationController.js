const Conversation = require("../models/Conversation");
const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const createConversation = asyncHandler(async (req, res) => {
  const receiverId = req.query.receiverId;
  const userId = req.user.email;

  // Check if a conversation already exists between the users
  const existingConversation = await Conversation.findOne({
    members: { $in: [[userId, receiverId], [receiverId, userId]] },
  });

  if (existingConversation) {
    // Conversation already exists, return its ID
    return res.status(200).json(existingConversation._id);
  }

  // If no existing conversation, create a new one
  const newConversation = new Conversation({
    members: [userId, receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation._id);
  } catch (err) {
    res.status(500).json(err);
  }
});

const getConversations = asyncHandler(async (req,res)=>{
    try {
        const conversations= await Conversation.find({
          members: { $in: [req.user.id] },
        });
        res.status(200).json(conversations);
      } catch (err) {
        res.status(500).json(err);
      }
})

const getConversation = asyncHandler(async (req,res)=>{
    try {
        const conversation = await Conversation.findOne({
          members: { $all: [req.user.id, req.query.receiverId] },
        });
        res.status(200).json(conversation)
      } catch (err) {
        res.status(500).json(err);
      }
    
})
const sendMessage = asyncHandler(async (req,res)=>{

  

    try {
      const savedMessage = await Message.create({
        conversationId:req.query.conversationId,
        sender:req.user.id,
        text:req.body.text
      });
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
})
const getMessages = asyncHandler(async (req,res)=>{
    try {
        const messages = await Message.find({
          conversationId: req.query.conversationId,
        });
        res.status(200).json(messages);
      } catch (err) {
        res.status(500).json(err);
      }
})
module.exports = {
    getConversation,getConversations,createConversation,getMessages,sendMessage
}