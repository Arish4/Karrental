const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get full Authorization header
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const token = authHeader.split(" ")[1]; // ✅ Extract only the token part
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};