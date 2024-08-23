const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

const Post = mongoose.model('Post', { title: String, body: String });

const app = express();

app.use(express.json());

PORT = 3000;
PRIVAVE_API_KEY = 'api_key';

app.get('/posts', async (_req, res) => {
    const posts = await Post.find();

    res.json(posts);
});

app.post('/posts/create', async (req, res) => {
    const {
        title,
        body,
    } = req.body;

    const newPost = Post.create({ title, body });

    return res.status(201).send(newPost);
});

app.post('/posts/delete', async (req, res) => {
    const {
        params: {
            id: _id,
        },
    } = req;

    const post = await Post.delete({ _id });

    return res.send();
});

app.get('/posts/:id', async (req, res) => {
    const {
        params: {
            id: _id,
        },
    } = req;

    const post = await Post.find({ _id });

    return res.json(post);
});

app.post('/posts/update', async (req, res) => {
    const {
        body: {
            id: _id,
            title,
            body,
        },
    } = req;

    const newPost = await Post.update({ _id: id }, { $set: { title, body } });

    return res.json(newPost);
})

app.listen(PORT, () => {
    console.log('Listening');
});
