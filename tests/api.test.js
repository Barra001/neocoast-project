/* eslint-disable no-undef */
const request = require('supertest');
const { PostRepository } = require('../src/database/postRepository');
const { createExpressApp } = require('../src/index');

let app;
let mockRepository;
const createPostTitle = 'Test Post';
const createPostBody = 'This is a test';
const getPostFirstTitle = 'Test Title 1';
const getPostFirstBody = 'Test Body 1';

jest.mock('../src/database/postRepository', () => {
    return {
        PostRepository: jest.fn().mockImplementation(() => ({
            createPost: jest.fn().mockResolvedValue({ _id: '1', title: createPostTitle, body: createPostBody }),
            getPosts: jest.fn().mockResolvedValue([
                { _id: '1', title: getPostFirstTitle, body: getPostFirstBody },
                { _id: '2', title: 'Test Title 2', body: 'Test Body 2' }
            ]),
            getPostById: jest.fn().mockResolvedValue({ _id: '1', title: createPostTitle, body: 'Test Body' }),
            updatePost: jest.fn().mockResolvedValue({ acknowledged: true, modifiedCount: 1 }),
            deletePost: jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 }),
        }))
    };
});

describe('Posts API', () => {
    beforeAll(async () => {
        mockRepository = new PostRepository();
        app = await createExpressApp(mockRepository);
    });

    it('should create a new post', async () => {
        const someTitle = 'Some Title';
        const someBody = 'Some Body';
        const res = await request(app)
            .post('/posts')
            .send({ title: someTitle, body: someBody });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe(createPostTitle);
        expect(mockRepository.createPost).toHaveBeenCalledWith(someTitle, someBody);
    });

    it('should try to create a new post and then send a 500 internal error message', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'createPost').mockRejectedValueOnce(new Error('Database error'));
        const someTitle = 'Some Title';
        const someBody = 'Some Body';
        const res = await request(app)
            .post('/posts')
            .send({ title: someTitle, body: someBody });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });
        expect(mockRepository.createPost).toHaveBeenCalledWith(someTitle, someBody);
        createPostSpy.mockRestore();
    });

    it('should retrieve all posts', async () => {
        const res = await request(app).get('/posts');

        expect(res.statusCode).toBe(200);
        expect(mockRepository.getPosts).toHaveBeenCalled();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe(getPostFirstTitle);
    });

    it('should try to retrieve all posts and then send a 500 internal error message', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'getPosts').mockRejectedValueOnce(new Error('Database error'));
        const res = await request(app).get('/posts');

        expect(res.statusCode).toBe(500);
        expect(mockRepository.getPosts).toHaveBeenCalled();
        expect(res.body).toEqual({ message: "Internal server error" });

        createPostSpy.mockRestore();
    });

    it('should retrieve a post by ID', async () => {
        const someId = '1';
        const res = await request(app).get(`/posts/${someId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(createPostTitle);
        expect(mockRepository.getPostById).toHaveBeenCalledWith(someId);
    });

    it('should try to retrieve a post by ID and then send a 500 internal error message', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'getPostById').mockRejectedValueOnce(new Error('Database error'));
        const someId = '1';
        const res = await request(app).get(`/posts/${someId}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });
        expect(mockRepository.getPostById).toHaveBeenCalledWith(someId);
        createPostSpy.mockRestore();
    });

    it('should update a post by ID', async () => {
        const newTitle = 'Updated Title';
        const newBody = 'Updated Body';
        const someId = '1';
        const res = await request(app)
            .put('/posts')
            .send({ id: someId, title: newTitle, body: newBody });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Successfully modified the post" });
        expect(mockRepository.updatePost).toHaveBeenCalledWith(someId, newTitle, newBody);
    });

    it('should try to update a post by ID and then send a 500 internal error message', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'updatePost').mockRejectedValueOnce(new Error('Database error'));
        const newTitle = 'Updated Title';
        const newBody = 'Updated Body';
        const someId = '1';
        const res = await request(app)
            .put('/posts')
            .send({ id: someId, title: newTitle, body: newBody });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });
        expect(mockRepository.updatePost).toHaveBeenCalledWith(someId, newTitle, newBody);
        createPostSpy.mockRestore();
    });

    it('should delete a post by ID', async () => {
        const someId = '1';
        const res = await request(app).delete(`/posts/${someId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Successfully deleted the post' });
        expect(mockRepository.deletePost).toHaveBeenCalledWith(someId);
    });

    it('should try to delete a post by ID and then send a 500 internal error message', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'deletePost').mockRejectedValueOnce(new Error('Database error'));
        const someId = '1';
        const res = await request(app).delete(`/posts/${someId}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal server error" });
        expect(mockRepository.deletePost).toHaveBeenCalledWith(someId);
        createPostSpy.mockRestore();
    });

    it('should return 404 when deleting a non-existent post', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'deletePost').mockResolvedValue({ acknowledged: true, deletedCount: 0 });
        const someInvalidId = 'invalidid';
        const res = await request(app).delete(`/posts/${someInvalidId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Post not found" });
        expect(mockRepository.deletePost).toHaveBeenCalledWith(someInvalidId);
        createPostSpy.mockRestore();
    });

    it('should return 404 when updating a non-existent post', async () => {
        const createPostSpy = jest.spyOn(mockRepository, 'updatePost').mockResolvedValue({ acknowledged: true, modifiedCount: 0 });
        const someInvalidId = 'invalidid';
        const someBody = 'Non-existent Body';
        const someTitle = 'Non-existent Title';
        const res = await request(app)
            .put('/posts')
            .send({ id: someInvalidId, title: someTitle, body: someBody });

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Post not found" });
        expect(mockRepository.updatePost).toHaveBeenCalledWith(someInvalidId, someTitle, someBody);
        createPostSpy.mockRestore();
    });
});
