const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// /api/users routes
router.use('/users', userRoutes);

// /api/thoughts routes
router.use('/thoughts', thoughtRoutes);

module.exports = router;