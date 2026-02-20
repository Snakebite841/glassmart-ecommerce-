import express from 'express';
import { verifyToken, checkRole, ROLES } from '../middlewares/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

router.post('/initialize', verifyToken, async (req, res) => {
    const { amount, email, productId } = req.body;
    if (!amount || !email) {
        return res.status(400).json({ error: 'Amount and email are required' });
    }

    try {
        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy_paystack_key';
        const params = JSON.stringify({
            "email": email,
            "amount": amount * 100, // Amount is in pesewas (100 pesewas = 1 GHC)
            "currency": "GHS",
            "callback_url": process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/payment/verify` : 'http://localhost:5173/payment/verify',
            "metadata": {
                "productId": productId || "cart"
            }
        });

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json'
            },
            body: params
        });

        const data = await response.json();
        if (data.status) {
            res.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
        } else {
            res.status(400).json({ error: data.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

router.post('/verify', verifyToken, async (req, res) => {
    const { reference } = req.body;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy_paystack_key';

    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`
            }
        });

        const data = await response.json();

        if (data.status && data.data.status === 'success') {
            const amountGhc = data.data.amount / 100;

            const ordersRef = db.collection('orders').doc();
            const order = {
                id: ordersRef.id,
                user_id: req.user.id,
                amount: amountGhc,
                currency: 'GHS',
                reference: reference,
                status: 'PAID',
                metadata: data.data.metadata || {},
                created_at: new Date().toISOString()
            };

            await ordersRef.set(order);

            res.json({ message: 'Payment verified and order recorded in Firebase successfully', orderId: order.id });
        } else {
            res.status(400).json({ error: 'Payment was not successful', details: data.message });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error during verification' });
    }
});

export default router;
