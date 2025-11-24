const express = require('express');
const app = express();
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
            return res.status(200).json({ authtoken, userEmail, userName });
        } else {
            pinoLogger.error('User not found');
            return res.status(400).json({ error: 'User not found' });
        }
    } catch (error) {
        pinoLogger.error('Error logging in user: ' + error.message);
        return res.status(500).json({ error: error.message || 'Internal server error!' });
    }
});

module.exports = router;
