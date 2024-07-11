const express = require('express')
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController')
const protectRoute = require('../middlewares/protectRoute')
const router = express.Router()

router.get('/conversations', protectRoute, getConversations);
router.post('/', protectRoute, sendMessage)
router.get('/:otherUserId', protectRoute, getMessages)

module.exports = router