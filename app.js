const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function runServer() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const Post = mongoose.model('Post', { title: String, body: String });

    const app = express();

    app.use(express.json());

    const PORT = process.env.API_PORT;

    app.get('/posts', async (_req, res) => {
        try {
            const posts = await Post.find();

            res.status(200).json(posts);
        } catch {

            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.post('/posts', async (req, res) => {
        const {
            title,
            body,
        } = req.body;

        try {
            const newPost = await Post.create({ title, body });

            res.status(201).json(newPost);
        } catch {

            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.delete('/posts/:id', async (req, res) => {

        const {
            params: {
                id: _id,
            },
        } = req;

        try {
            const deleteRequest = await Post.deleteOne({ _id });

            if (deleteRequest.deletedCount === 0) {
                return res.status(404).json({ message: "Post not found" });
            } else {
                return res.status(200).json({ message: "Successfully deleted the post" });
            }

        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    app.get('/posts/:id', async (req, res) => {
        const {
            params: {
                id: _id,
            },
        } = req;

        try {
            const postWithId = await Post.find({ _id });

            res.status(200).json(postWithId);
        } catch {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.put('/posts', async (req, res) => {
        const {
            body: {
                id: _id,
                title,
                body,
            },
        } = req;

        try {
            const newPost = await Post.updateOne({ _id }, { $set: { title, body } });

            if (newPost.modifiedCount === 0) {
                return res.status(404).json({ message: "Post not found" });
            } else {
                return res.status(200).json({ message: "Successfully modified the post" });
            }

        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }


    })

    app.listen(PORT, () => {
        console.log('Listening on port', PORT);
    });

}

runServer();



