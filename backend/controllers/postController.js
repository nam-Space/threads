const { default: mongoose } = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { v2: cloudinary } = require('cloudinary')

const getFeedPosts = async (req, res) => {
    try {
        const feedPosts = await Post.find().populate('postedBy', 'name username profilePic').sort({ createdAt: -1 })
        res.status(200).json(feedPosts)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ error: "Post not found" })
        }
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body
        let { img } = req.body

        if (!postedBy) {
            return res.status(400).json({ error: 'PostedBy are required' })
        }
        if (!text && !img) {
            return res.status(400).json({ error: 'Please type something' })
        }

        const user = await User.findById(postedBy)
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const maxLength = 500
        if (text.length > maxLength) {
            return res.status(400).json({
                error: `Text must be less than ${maxLength} characters`
            })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            postedBy,
            text,
            img
        })
        await newPost.save().then(p => p.populate('postedBy', 'name username profilePic'))
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(400).json({ error: "Post not found" })
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Promise.all(
            post.replies.map(async reply => {
                if (reply.img) {
                    const imgId = reply.img.split('/').pop().split('.')[0]
                    await cloudinary.uploader.destroy(imgId)
                }
            })
        )



        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Delete post successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params
        const userId = req.user._id

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ error: 'Post not found' })
        }

        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, {
                $pull: {
                    likes: userId
                }
            })
            res.status(200).json({ message: 'Unlike post successfully' })
        }
        else {
            post.likes.push(userId)
            await post.save()
            res.status(200).json({ message: 'Like post successfully' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const replyToPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username

        if (!text.trim() && !img) {
            return res.status(400).json({ error: 'Please type something...' })
        }

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ error: 'Post not found' })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const reply = { userId, text, userProfilePic, username, img, createdAt: new Date() }

        post.replies.push(reply)
        await post.save()

        res.status(200).json(reply)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getUserPosts = async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        const posts = await Post.find({ postedBy: user._id }).populate('postedBy', 'name username profilePic').sort({ createdAt: -1 })

        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const deleteUserReply = async (req, res) => {
    try {
        const { postId, replyId } = req.params;
        if (!postId || !replyId) {
            return res.status(400).json({ error: 'postId and replyId are required' })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ error: 'Post not found' })
        }

        const replies = await Post.aggregate([
            { $unwind: "$replies" },
            { $match: { "replies._id": new mongoose.Types.ObjectId(replyId) } },
            { $replaceRoot: { newRoot: "$replies" } }
        ]);
        const reply = replies[0]
        if (!reply) {
            return res.status(401).json({ error: "Reply not found" })
        }

        if (reply.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        if (reply.img) {
            const imgId = reply.img.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndUpdate(postId, { $pull: { replies: reply } })
        res.status(200).json({ message: 'Delete reply successfully', reply })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

module.exports = {
    getPost,
    createPost,
    deletePost,
    likeUnlikePost,
    replyToPost,
    getFeedPosts,
    getUserPosts,
    deleteUserReply
}