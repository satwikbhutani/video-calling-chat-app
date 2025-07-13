import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

export const recommendedUsers = async (req, res) => {
  try {
    const currUserId = req.user._id;
    const currUser = req.user;

    const usersWithSimilarInterests = await User.find({
      _id: { $nin: [currUserId, ...currUser.friends] },
      interests: { $in: currUser.interests }
    });

    const interestMatchedIds = usersWithSimilarInterests.map(user => user._id);

    const usersWithLangOrLocation = await User.find({
      _id: { $nin: [currUserId, ...currUser.friends, ...interestMatchedIds] },
      $or: [
        { nativeLanguage: currUser.nativeLanguage },
        { location: currUser.location }
      ]
    });

    const langLocMatchedIds = usersWithLangOrLocation.map(user => user._id);

    const otherUsers = await User.find({
      _id: {
        $nin: [
          currUserId,
          ...currUser.friends,
          ...interestMatchedIds,
          ...langLocMatchedIds
        ]
      }
    });

    const recUsers = [
      ...usersWithSimilarInterests,
      ...usersWithLangOrLocation,
      ...otherUsers
    ];

    return res.status(200).json(recUsers);
  } catch (error) {
    console.error('Error fetching recommended users:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const myFriends = async (req, res) => {
    try{
        const user= await User.findById(req.user._id)
            .select('friends')
            .populate('friends', 'name profilePic bio nativeLanguage location');
        return res.status(200).json(user.friends);
    }
    catch(error) {
        console.error('Error fetching friends:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const sendFriendRequest = async (req, res) => {
    try{
        const senderId = req.user._id;
        const { id:recipientId } = req.params;

        if(!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required' });
        }

        if(senderId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if(recipient.friends.includes(senderId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        const existingRequest=await FriendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        })

        if(existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const newRequest= await FriendRequest.create({
            sender: senderId,
            recipient: recipientId
        })

        return res.status(201).json({
            message: 'Friend request sent successfully',
            request: newRequest
        });
    }
    catch(error) {
        console.error('Error sending friend request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try{
        const{id: requestId} = req.params;
        const userId = req.user._id;

        if(!requestId) {
            return res.status(400).json({ message: 'Request ID is required' });
        }

        const request = await FriendRequest.findById(requestId);
        if(!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if(request.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only accept requests sent to you' });
        }

        const senderId = request.sender;

        request.status = 'accepted';
        await request.save();

        await User.findByIdAndUpdate(userId,
            { $addToSet: { friends: senderId } },
            { new: true }
        );

        await User.findByIdAndUpdate(senderId,
            { $addToSet: { friends: userId } },
            { new: true }
        );
    }
    catch(error) {
        console.error('Error accepting friend request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const rejectFriendRequest = async (req, res) => {
    try{
        const{id: requestId} = req.params;
        
        if(!requestId) {
            return res.status(400).json({ message: 'Request ID is required' });
        }

        const request = await FriendRequest.findByIdAndDelete(requestId);
        if(!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
    }
    catch(error) {
        console.error('Error accepting friend request:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const getFriendRequests = async (req, res) => {
    try{
        const userId = req.user._id;

        const incomingRequests = await FriendRequest.find({
            recipient: userId,
            status: 'pending'
        }).populate('sender', 'name profilePic nativeLanguage location interests');

        const acceptedRequests = await FriendRequest.find({
            sender: userId,
            status: 'accepted'
        }).populate('recipient', 'name profilePic');

        return res.status(200).json({incomingRequests, acceptedRequests});
    }
    catch(error) {
        console.error('Error fetching friend requests:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const outgoingRequests = async (req, res) => {
    try{
        const userId = req.user._id;

        const requests = await FriendRequest.find({
            sender: userId,
            status: 'pending'
        }).populate('recipient', 'name profilePic nativeLanguage location');

        return res.status(200).json(requests);
    }
    catch(error) {
        console.error('Error fetching outgoing friend requests:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}