const request = require('supertest');

const app = require('../..');
const db_test = require('../../config/db_test');

let authToken = '';

describe('Chat Endpoints', () => {
    beforeAll(async () => {
        await db_test.connect(); // Connect to test DB

        // Register a test user and get token
        await request(app).post('/api/users/register').send({
            fullName: 'Test User',
            email: 'chatuser@example.com',
            password: 'Password123',
        });

        const loginRes = await request(app).post('/api/users/login').send({
            email: 'chatuser@example.com',
            password: 'Password123',
        });

        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        await db_test.disconnect(); // Close DB connection
    });

    test('Send Message to ChatGPT', async () => {
        const res = await request(app)
            .post('/api/chat/send')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ message: 'What are the recommended exercises' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('userMessage', 'What are the recommended exercises');
        expect(res.body).toHaveProperty('botResponse');
        expect(typeof res.body.botResponse).toBe('string');
    });

    test('Get Chat History', async () => {
        const res = await request(app)
            .get('/api/chat/history')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toMatchObject({
            userMessage: expect.any(String),
            botResponse: expect.any(String),
            timestamp: expect.any(String),
        });
    });

    test('Unauthorized Access to Chat History', async () => {
        const res = await request(app).get('/api/chat/history');
        expect(res.statusCode).toBe(401);
    });

    test('Unauthorized Message Send Attempt', async () => {
        const res = await request(app).post('/api/chat/send').send({
            message: 'Is this unauthorized?',
        });
        expect(res.statusCode).toBe(401);
    });
});
