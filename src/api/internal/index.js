import express from 'express';

import users from './users';

const router = express.Router();

/**
 * Internal API
 */
router.use('/users', users);

export default router;
