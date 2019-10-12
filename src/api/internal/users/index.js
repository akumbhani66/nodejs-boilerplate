import express from 'express';
import users from './users.controller';

const router = express.Router();

router.use('/', users);

export default router;
