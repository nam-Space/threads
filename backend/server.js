const express = require('express');
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { v2: cloudinary } = require('cloudinary');
const { app, server } = require('./socket/socket');

require('dotenv').config()

connectDB()

const PORT = process.env.PORT || 5000

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({ limit: "1gb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`))