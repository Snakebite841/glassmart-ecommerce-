import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_for_glassmart');
        req.user = decoded; // Contains id, email, role
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Access Denied. Allowed roles: ${roles.join(', ')}` });
        }
        next();
    };
};

export const ROLES = {
    ADMIN: 'Admin',
    VENDOR: 'Vendor',
    CUSTOMER: 'Customer'
};
