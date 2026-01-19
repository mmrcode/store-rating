const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Mock Supabase
// Mock Supabase
jest.mock('../src/db', () => ({
    rpc: jest.fn(),
    from: jest.fn(() => ({
        select: jest.fn(() => ({
            eq: jest.fn(() => ({
                single: jest.fn()
            })),
            match: jest.fn(() => ({ // For submitRating unique check
                single: jest.fn()
            })),
            insert: jest.fn(() => ({
                select: jest.fn()
            })),
            update: jest.fn(() => ({
                eq: jest.fn()
            }))
        }))
    })),
    auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        updateUser: jest.fn()
    }
}));

const supabase = require('../src/db');

describe('Auth Endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should return 400 if validation fails (short password)', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'test@test.com',
                    password: '123'
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBeDefined(); // Should have validation error
        });
    });

});
