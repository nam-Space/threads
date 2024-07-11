const express = require('express')
const { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile, getAllUsers, getSuggestedUsers, freezeAccount, getUserById } = require('../controllers/userController')
const protectRoute = require('../middlewares/protectRoute')

const router = express.Router()

router.get('/get-all-users-chat', protectRoute, getAllUsers)
router.get('/suggested', protectRoute, getSuggestedUsers)
router.get('/find/:userId', getUserById)
router.get('/profile/:username', getUserProfile)
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', protectRoute, followUnFollowUser)
router.put('/update/:id', protectRoute, updateUser)
router.put('/freeze', protectRoute, freezeAccount)

module.exports = router