import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { recommendedUsers, myFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, outgoingRequests, rejectFriendRequest } from '../controllers/user.controller.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', recommendedUsers);
router.get('/friends', myFriends);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.put('/friend-request/:id/reject', rejectFriendRequest);
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-requests', outgoingRequests);
export default router;