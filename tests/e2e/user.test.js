const request = require('supertest');

const app = require('../..');
const db_test = require('../../config/db_test');

let authToken = '';
let userId = '';

describe('User Endpoints', () => {
    beforeAll(async () => {
        await db_test.connect(); // Connect to test DB
    });

    afterAll(async () => {
        await db_test.disconnect(); // Clean up DB connection
    });


    test('User Registration', async () => {
        const res = await request(app).post('/api/users/register').send({
            fullName: 'Test User',
            email: 'testuser@example.com',
            password: 'Password123',
            role: 'mother'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('userId');
    });

    test('User Login', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: 'testuser@example.com',
            password: 'Password123',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token;
    });

    test('Get User Profile (Authenticated)', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', 'testuser@example.com');
    });

    test('Update User Profile', async () => {
        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ fullName: 'Updated User' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User profile updated successfully');
        expect(res.body.user).toHaveProperty('fullName', 'Updated User');
    });

    test('Get All Users (Admin)', async () => {
        const res = await request(app)
            .get('/api/users/all-users')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        userId = res.body.find((user) => user.email === 'testuser@example.com')._id;
    });

    test('Delete User (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
    });
});
