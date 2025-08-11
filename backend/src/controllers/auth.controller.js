import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";
import jwt from "jsonwebtoken";

const friendRequest= async(rId) => {
    try{
        const senderId = "6898f4488028ef83a68e4543";
        const recipientId = rId;
    
            if(!recipientId) {
                return res.status(400).json({ message: 'Recipient ID is required' });
            }
    
            if(senderId === recipientId) {
                return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
            }
    
            const sender = await User.findById(senderId);
            if(!sender) {
                return res.status(404).json({ message: 'Recipient not found' });
            }

            const recipient = await User.findById(recipientId);
            if(!recipient) {
                return res.status(404).json({ message: 'Recipient not found' });
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

            return;
        }
        catch(error) {
            console.error('Error sending friend request:', error);
            return;
        }
}

export const signup = async (req, res) => {
    const {name , email, password} = req.body;

    try{
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }   

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(401).json({message: "User already exists with this email"});
        }
        
        const idx = Math.floor(Math.random() * 100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User. create({
            name,
            email,
            password,
            profilePic: randomAvatar
        });

        const token= jwt.sign(
            {userId:newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '7d'}
        )

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.name,
            image: newUser.profilePic
        });

        console.log("User created and Stream user upserted successfully for user:", newUser.name);

        friendRequest(newUser._id);

        return res.status(200).json({
            message: 'User logged in successfully', newUser
        });
    }
    catch(error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }

    
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const token= jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '7d'}
        )

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: 'User logged in successfully', user
        });
    }
    catch(error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    return res.status(200).json({ message: 'User logged out successfully'});
}

export const onboard = async (req, res) => {
  const userId = req.user._id;
  const { name, profilePic, bio, nativeLanguage, location, interests } = req.body;

  try {
    if (
        !name ||
      !profilePic ||
      !bio || 
      !nativeLanguage || 
      !location
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (
        !Array.isArray(interests) || 
      interests.length < 5 || 
      !interests.every(item => typeof item === 'string' && item.trim() !== '')
    ){
        return res.status(400).json({ message: 'You should add atleast 5 interests!' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic,
        bio,
        nativeLanguage,
        location,
        interests,
        isOnboarded: true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User onboarded successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error during onboarding:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
