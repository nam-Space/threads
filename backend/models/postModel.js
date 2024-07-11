const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    img: {
        type: String,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
            },
            img: {
                type: String,
            },
            userProfilePic: {
                type: String,
            },
            username: {
                type: String,
            },
            createdAt: {
                type: Date,
            }
        }
    ]
}, {
    timestamps: true,
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post