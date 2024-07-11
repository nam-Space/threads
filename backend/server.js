const path = require('path');
const express = require('express');
const connectDB = require('./db/connectDB');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { v2: cloudinary } = require('cloudinary');
const { app, server } = require('./socket/socket');
const job = require('./cron/cron');

require('dotenv').config()

connectDB()
job.start()

const PORT = process.env.PORT || 5000
const __dirname2 = path.resolve()

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

// http:localhost:5000 => backend, frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname2, '/frontend/dist')))

    // react app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname2, 'frontend', 'dist', 'index.html'))
    })
}

server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`))