/* eslint-disable no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { PostRepositoryMock } = require('./postRepository.mock');
const { createExpressApp } = require('../src/index');

let app;
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const postRepositoryMock = new PostRepositoryMock();

    app = createExpressApp(postRepositoryMock);

});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Post API', () => {
    it('should create a new post', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ title: 'Test Post', body: 'This is a test' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Post');
    });

    it('should retrieve all posts', async () => {
        const res = await request(app).get('/posts');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should retrieve a post by ID', async () => {
        const newPost = await request(app)
            .post('/posts')
            .send({ title: 'Post to Retrieve', body: 'Retrieving this post by ID' });

        const res = await request(app).get(`/posts/${newPost.body._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0]._id).toBe(newPost.body._id);
    });

    it('should update a post by ID', async () => {
        const newPost = await request(app)
            .post('/posts')
            .send({ title: 'Post to Update', body: 'This post will be updated' });

        const res = await request(app)
            .put('/posts')
            .send({ id: newPost.body._id, title: 'Updated Title', body: 'Updated Body' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Successfully modified the post');
    });

    it('should delete a post by ID', async () => {
        const newPost = await request(app)
            .post('/posts')
            .send({ title: 'Post to Delete', body: 'This post will be deleted' });

        const res = await request(app).delete(`/posts/${newPost.body._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Successfully deleted the post');
    });

    it('should return 404 when deleting a non-existent post', async () => {
        const res = await request(app).delete('/posts/invalidid');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Post not found');
    });

    it('should return 404 when updating a non-existent post', async () => {
        const res = await request(app)
            .put('/posts')
            .send({ id: 'invalidid', title: 'Non-existent Title', body: 'Non-existent Body' });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Post not found');
    });
});
