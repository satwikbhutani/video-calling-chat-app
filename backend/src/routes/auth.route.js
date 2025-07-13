import express from 'express';
import {login, logout, signup, onboard} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);
router.post('/onboard', protectRoute, onboard);

router.get('/me', protectRoute, (req, res) => {
    return res.status(200).json({
        message: 'User fetched successfully',
        user: req.user
    });
});

export default router;