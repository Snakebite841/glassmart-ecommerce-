import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        let userRole = role;
        if (!['Customer', 'Vendor', 'Admin'].includes(userRole)) {
            userRole = 'Customer';
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if email exists
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const newUserRef = usersRef.doc();
        const newUser = {
            id: newUserRef.id,
            email,
            password_hash: hashedPassword,
            role: userRole,
            created_at: new Date().toISOString()
        };
        await newUserRef.set(newUser);

        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error("Firebase Registration Error", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        let user = null;
        snapshot.forEach(doc => { user = doc.data(); });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'supersecret_jwt_key_for_glassmart',
            { expiresIn: '1d' }
        );

        res.json({ message: 'Logged in successfully', token, user: { id: user.id, email, role: user.role } });
    } catch (error) {
        console.error("Firebase Login Error", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
