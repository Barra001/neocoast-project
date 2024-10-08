const { Post } = require('./database');

class PostRepository {
    constructor() {
    }
    async createPost(title, body) {
        const newPost = await Post.create({ title, body });
        return newPost;
    }

    async getPosts() {
        const posts = await Post.find();
        return posts;
    }

    async getPostById(_id) {
        const postWithId = await Post.find({ _id });
        return postWithId;
    }

    async updatePost(_id, title, body) {
        const newPost = await Post.updateOne({ _id }, { $set: { title, body } });
        return newPost;
    }

    async deletePost(_id) {
        const deleteRequest = await Post.deleteOne({ _id });
        return deleteRequest;
    }
}


module.exports = {
    PostRepository,
};