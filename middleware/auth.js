/**
 * Basic API Key Authentication Middleware
 * Checks for generic 'x-api-key' header. For this demonstration, we accept a static key.
 */

// In a real application, this should be stored in environment variables.
const VALID_API_KEY = 'secret-index-key-123';

const authMiddleware = (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized: Missing x-api-key header' });
    }

    // Use a secure way to compare keys in a real app to prevent timing attacks
    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }

    next();
};

module.exports = authMiddleware;
