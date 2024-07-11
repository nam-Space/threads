const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { io, getRecipientSocketId } = require("../socket/socket");
const { v2: cloudinary } = require('cloudinary')

const sendMessage = async (req, res) => {
    try {
        const { recipientId, message } = req.body
        let { img } = req.body
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        })

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
            await conversation.save()
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || ''
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])

        const recipientSocketId = getRecipientSocketId(recipientId)
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params
        const userId = req.user._id
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] }
        })

        if (!conversation) {
            return res.status(400).json({ error: 'Conversation not found' })
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 })

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getConversations = async (req, res) => {
    try {
        const userId = req.user._id
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: 'participants',
            select: 'username profilePic'
        })
        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(participant => {
                return participant._id.toString() !== userId.toString()
            })
        })
        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

module.exports = {
    sendMessage,
    getMessages,
    getConversations
}