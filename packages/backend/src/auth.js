const express = require('express');
const mongoose = require('mongoose'); // Use require instead of import
const { Lucia } = require('lucia');
const { MongodbAdapter } = require('@lucia-auth/adapter-mongodb');
const connectToDatabase = require('./config/database.config'); // Use require instead of import

const app = express();

(async function initialize() {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Define the User and Session models
        const User = mongoose.model(
            'User',
            new mongoose.Schema(
                {
                    _id: {
                        type: String,
                        required: true
                    }
                },
                { _id: false }
            )
        );

        const Session = mongoose.model(
            'Session',
            new mongoose.Schema(
                {
                    _id: {
                        type: String,
                        required: true
                    },
                    user_id: {
                        type: String,
                        required: true
                    },
                    expires_at: {
                        type: Date,
                        required: true
                    }
                },
                { _id: false }
            )
        );

        // Initialize Lucia with the adapter
        const adapter = new MongodbAdapter(
            mongoose.connection.collection('sessions'),
            mongoose.connection.collection('users')
        );

        const lucia = new Lucia(adapter, {
            sessionCookie: {
                expires: false,
                attributes: {
                    secure: process.env.NODE_ENV === 'production'
                }
            }
        });

        // Middleware to handle Lucia authentication
        module.exports.luciaMiddleware = function () {
            return lucia.middleware();
        };

        module.exports.lucia = lucia;
    } catch (error) {
        console.error('Error initializing app:', error);
    }
})();
