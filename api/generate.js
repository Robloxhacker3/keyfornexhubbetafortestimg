// api/generate.js - Vercel Serverless Function for Key Generation

export default async function handler(req, res) {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'POST') {
            const { key } = req.body;

            if (!key) {
                return res.status(400).json({
                    success: false,
                    message: 'No key provided'
                });
            }

            // Store key in database (simulated)
            const stored = await storeKeyInDatabase(key);

            if (stored) {
                res.status(200).json({
                    success: true,
                    message: 'Key stored successfully',
                    key: key,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to store key'
                });
            }

        } else if (req.method === 'GET') {
            // Generate a new key
            const newKey = generateUniqueKey();
            
            // Store the generated key
            const stored = await storeKeyInDatabase(newKey);

            if (stored) {
                res.status(200).json({
                    success: true,
                    message: 'Key generated successfully',
                    key: newKey,
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to generate key'
                });
            }

        } else {
            res.status(405).json({
                success: false,
                message: 'Method not allowed'
            });
        }

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Generate a unique key
function generateUniqueKey() {
    const timestamp = Date.now();
    const random1 = Math.random().toString(36).substring(2, 8);
    const random2 = Math.random().toString(36).substring(2, 8);
    return `KEY_${timestamp}_${random1}_${random2}`.toUpperCase();
}

// Simulate storing key in database
async function storeKeyInDatabase(key) {
    // In a real implementation, you would store this in a database like:
    // - MongoDB
    // - PostgreSQL
    // - Firebase
    // - Supabase
    // etc.
    
    try {
        // Simulate database operation
        console.log(`Storing key: ${key}`);
        
        // For demo purposes, we'll just return true
        // In production, implement actual database storage here
        
        return true;
    } catch (error) {
        console.error('Database error:', error);
        return false;
    }
}

// Example database integration with MongoDB:
/*
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

async function storeKeyInDatabase(key) {
    try {
        await client.connect();
        const db = client.db('key_system');
        const collection = db.collection('keys');
        
        const result = await collection.insertOne({
            key: key,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            used: false
        });
        
        return result.acknowledged;
    } catch (error) {
        console.error('Database error:', error);
        return false;
    } finally {
        await client.close();
    }
}
*/

// Example database integration with Supabase:
/*
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function storeKeyInDatabase(key) {
    try {
        const { data, error } = await supabase
            .from('keys')
            .insert([
                {
                    key: key,
                    created_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    used: false
                }
            ]);

        return !error;
    } catch (error) {
        console.error('Database error:', error);
        return false;
    }
}
*/
