import express from 'express';
const router = express.Router();
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

router.use(protectRoute);
router.get('/token', getStreamToken);

export default router;