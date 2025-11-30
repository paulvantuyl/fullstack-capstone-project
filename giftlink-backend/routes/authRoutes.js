const express = require('express');
const bcryptjs   = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');

// Create a Pino logger instance
const pinoLogger = require('../logger');

dotenv.config();

// Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

         // Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });
        
         // Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId,
            }
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        
        pinoLogger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (error) {
        pinoLogger.error('Error registering user: ' + error.message);
        return res.status(500).json({ error: error.message || 'Internal server error!' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const user = await collection.findOne({ email: req.body.email });

        // Check if the password matches the encrypyted password and send appropriate message on mismatch
        if (user) {
            let result = await bcryptjs.compare(req.body.password, user.password);
            
            if (!result) {
                pinoLogger.error('Password mismatch');
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            let payload = {
                user: {
                    id: user._id.toString(),
                },
            };

            const userName = user.firstName;
            const userEmail = user.email;
            const authtoken = jwt.sign(payload, JWT_SECRET);

            pinoLogger.info('User logged in successfully');
            return res.status(200).json({
                authtoken, 
                userEmail, 
                userName,
                firstName: user.firstName,
                lastName: user.lastName,
            });
        } else {
            pinoLogger.error('User not found');
            return res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        pinoLogger.error('Error logging in user: ' + error.message);
        return res.status(500).json({ error: error.message || 'Internal server error!' });
    }
});

// Update endpoint
router.put('/update', 
    [
        body('firstName').optional().trim().notEmpty(),
        body('lastName').optional().trim().notEmpty(),
        body('name').optional().trim().notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            pinoLogger.error('Validation error: ' + JSON.stringify(errors.array()));
            return res.status(400).json({ error: errors.array() });
        }

        try {
            // Verify JWT token
            const authtoken = req.headers.authorization?.split(' ')[1];
            if (!authtoken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            let decoded;
            try {
                decoded = jwt.verify(authtoken, JWT_SECRET);
            } catch (error) {
                pinoLogger.error('Invalid JWT token: ' + error.message);
                return res.status(401).json({ error: 'Invalid JWT token' });
            }

            const email = req.headers.email;
            if (!email) {
                pinoLogger.error('Email not found in the request headers');
                return res.status(400).json({ error: 'Email not found in the request headers' });
            }
            
            const db = await connectToDatabase();
            const collection = db.collection('users');

            const existingUser = await collection.findOne({ email });

            if (!existingUser) {
                pinoLogger.error('User not found');
                return res.status(400).json({ error: 'User not found' });
            }

            // Verify token belongs to current user
            if (decoded.user.id !== existingUser._id.toString()) {
                return res.status(403).json({ error: 'Unauthorized access' });
            }

            // Build update object from request body
            const updateFields = {};
            if (req.body.firstName) updateFields.firstName = req.body.firstName;
            if (req.body.lastName) updateFields.lastName = req.body.lastName;
            if (req.body.name) updateFields.name = req.body.name;
            updateFields.updatedAt = new Date();

            // Update user credentials in database
            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: updateFields },
                { returnDocument: 'after' }
            );

            if (!updatedUser) {
                return res.status(500).json({ error: 'Failed to update user' });
            }

            // Create JWT authentication using secret key from .env file
            const payload = {
                user: {
                    id: existingUser._id.toString(),
                },
            };
            const newAuthToken = jwt.sign(payload, JWT_SECRET);
            res.json({
                authtoken: newAuthToken,
                user: {
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    name: updatedUser.name,
                },
            });
        } catch (error) {
            pinoLogger.error('Error updating user: ' + error.message);
            return res.status(500).json({ error: error.message || 'Internal server error!' });
        }
    }
);

module.exports = router;
