/* eslint-disable no-undef */

const { Post } = require('../src/database/database');
const { PostRepository } = require('../src/database/postRepository');

jest.mock('../src/database/database', () => ({
    Post: {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        updateOne: jest.fn(),
        deleteOne: jest.fn(),
    },
}));

describe('PostRepository', () => {
    let postRepository;

    beforeEach(() => {
        postRepository = new PostRepository();
        jest.clearAllMocks();
    });

    it('should create a new post', async () => {
        const mockPost = { _id: '123', title: 'Test Title', body: 'Test Body' };
        Post.create.mockResolvedValue(mockPost);

        const result = await postRepository
            .createPost(mockPost.title, mockPost.body);

        expect(Post.create)
            .toHaveBeenCalledWith({ title: mockPost.title, body: mockPost.body });
        expect(result).toEqual(mockPost);
    });

    it('should get all posts', async () => {
        const mockPosts = [
            { _id: '123', title: 'Test Title 1', body: 'Test Body 1' },
            { _id: '124', title: 'Test Title 2', body: 'Test Body 2' },
        ];
        Post.find.mockResolvedValue(mockPosts);

        const result = await postRepository.getPosts();

        expect(Post.find).toHaveBeenCalled();
        expect(result).toEqual(mockPosts);
    });

    it('should get a post by ID', async () => {
        const mockPost = { _id: '123', title: 'Test Title', body: 'Test Body' };
        Post.find.mockResolvedValue([mockPost]);

        const result = await postRepository.getPostById(mockPost._id);

        expect(Post.find).toHaveBeenCalledWith({ _id: mockPost._id });
        expect(result).toEqual([mockPost]);
    });

    it('should update a post by ID', async () => {
        const mockUpdatedPost = { n: 1, nModified: 1, ok: 1 };
        const someId = "123";
        const someTitle = "Updated Title";
        const someBody = "Updated Body";
        Post.updateOne.mockResolvedValue(mockUpdatedPost);

        const result = await postRepository
            .updatePost(someId, someTitle, someBody);

        expect(Post.updateOne).toHaveBeenCalledWith(
            { _id: someId },
            { $set: { title: someTitle, body: someBody } }
        );
        expect(result).toEqual(mockUpdatedPost);
    });

    it('should delete a post by ID', async () => {
        const mockDeleteResult = { deletedCount: 1, ok: 1 };
        Post.deleteOne.mockResolvedValue(mockDeleteResult);
        const someId = "123";
        const result = await postRepository.deletePost(someId);

        expect(Post.deleteOne).toHaveBeenCalledWith({ _id: someId });
        expect(result).toEqual(mockDeleteResult);
    });
});
