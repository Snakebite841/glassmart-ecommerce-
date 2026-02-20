import express from 'express';
import { verifyToken, checkRole, ROLES } from '../middlewares/authMiddleware.js';
import { db } from '../config/firebase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();

        // Check if empty, maybe generate defaults if dev environment needs it, but we can just return empty array.
        const products = [];
        snapshot.forEach(doc => {
            products.push(doc.data());
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products from Firebase' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('products').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

router.post('/', verifyToken, checkRole([ROLES.ADMIN, ROLES.VENDOR]), async (req, res) => {
    const { name, category, price, stock, image_url, description } = req.body;
    try {
        const productRef = db.collection('products').doc();
        const product = {
            id: productRef.id,
            name,
            category,
            price,
            stock,
            image_url,
            description,
            vendor_id: req.user.id,
            created_at: new Date().toISOString()
        };

        await productRef.set(product);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product in Firebase' });
    }
});

router.delete('/:id', verifyToken, checkRole([ROLES.ADMIN, ROLES.VENDOR]), async (req, res) => {
    try {
        await db.collection('products').doc(req.params.id).delete();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// PUBLIC Buy Now endpoint for demonstration (Writes directly to Firebase Database)
router.post('/:id/buy', async (req, res) => {
    try {
        const { amount, productName } = req.body;
        const ordersRef = db.collection('orders').doc();

        const newOrder = {
            id: ordersRef.id,
            product_id: req.params.id,
            product_name: productName || 'Unknown Product',
            amount: amount || 0,
            currency: 'GHC',
            status: 'PAID',
            created_at: new Date().toISOString()
        };

        // Write directly to Firebase
        await ordersRef.set(newOrder);

        res.status(201).json({ message: 'Purchase successful! Order recorded in Firebase.', order: newOrder });
    } catch (error) {
        console.error("Firebase Buy Error", error);
        res.status(500).json({ error: 'Failed to complete purchase in Firebase' });
    }
});

export default router;
