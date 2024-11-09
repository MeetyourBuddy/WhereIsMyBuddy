/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { Lucia } from 'lucia';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';
import connectToDatabase from './config/database.config.js';

let lucia;

export async function initializeLucia() {
  if (lucia) return lucia; // Skip initialization if already done

  try {
    await connectToDatabase();

    const User = mongoose.model(
      'User',
      new mongoose.Schema(
        {
          _id: { type: String, required: true }
        },
        { _id: false }
      )
    );

    const Session = mongoose.model(
      'Session',
      new mongoose.Schema(
        {
          _id: { type: String, required: true },
          user_id: { type: String, required: true },
          expires_at: { type: Date, required: true }
        },
        { _id: false }
      )
    );

    const adapter = new MongodbAdapter(
      mongoose.connection.collection('sessions'),
      mongoose.connection.collection('users')
    );

    lucia = new Lucia(adapter, {
      sessionCookie: {
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === 'production'
        }
      }
    });

    return lucia;
  } catch (error) {
    console.error('Error initializing Lucia:', error);
    throw error;
  }
}

export function luciaMiddleware() {
  if (!lucia) {
    throw new Error('Lucia is not initialized');
  }
  return lucia.middleware();
}

export { lucia };
