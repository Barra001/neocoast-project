// postRepository.mock.js

class PostRepositoryMock {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: 'Test Post 1',
                body: 'This is a test post',
            },
            {
                id: 2,
                title: 'Test Post 2',
                body: 'This is another test post',
            },
        ];
    }

    getAllPosts() {
        return this.posts;
    }

    addPost(post) {
        this.posts.push(post);
    }

    deletePost(postId) {
        this.posts = this.posts.filter(post => post.id !== postId);
    }
}

module.exports = PostRepositoryMock;