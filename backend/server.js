import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet()); // Protects against common web vulnerabilities by setting HTTP headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// DDoS and Bot Protection - Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all requests
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Base route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>GlassMart API Server</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #0b0c10;
                        color: white;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        padding: 40px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 16px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                        max-width: 600px;
                    }
                    h1 {
                        background: linear-gradient(135deg, #ff4d8d, #5c62ff);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 10px;
                    }
                    p {
                        color: #a0a5b1;
                        font-size: 1.1rem;
                        line-height: 1.6;
                    }
                    .badge {
                        display: inline-block;
                        background: rgba(0, 242, 254, 0.2);
                        color: #00f2fe;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        font-weight: bold;
                        margin-top: 20px;
                        border: 1px solid rgba(0, 242, 254, 0.3);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>GlassMart API Server</h1>
                    <p>The backend infrastructure is securely running and connected to Firebase. All systems are operational.</p>
                    <p>Use the frontend application at <strong>http://localhost:5173</strong> to interact with the database.</p>
                    <div class="badge">● Live & Secured</div>
                </div>
            </body>
        </html>
    `);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
