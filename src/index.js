const express = require('express');
const dotenv = require('dotenv');
const { PostRepository, connectToDB } = require('./database/database');
dotenv.config();

async function createExpressApp(postRepository) {
    const app = express();

    app.use(express.json());

    app.get('/posts', async (_req, res) => {
        try {
            const posts = await postRepository.getPosts();

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
            const newPost = await postRepository.createPost(title, body);

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
            const deleteRequest = await postRepository.deletePost(_id);

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
            const postWithId = await postRepository.getPostById(_id);

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
            const newPost = await postRepository.updatePost(_id, title, body);

            if (newPost.modifiedCount === 0) {
                return res.status(404).json({ message: "Post not found" });
            } else {
                return res.status(200)
                    .json({ message: "Successfully modified the post" });
            }

        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }


    })

    return app;
}

async function runServer() {
    await connectToDB();

    const postRepository = new PostRepository();

    const PORT = process.env.API_PORT;

    const app = await createExpressApp(postRepository);

    app.listen(PORT, () => {
        console.log('Listening on port', PORT);
    });

}

if (require.main === module) {
    runServer();
}

module.exports = {
    createExpressApp,
}



