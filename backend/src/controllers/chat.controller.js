import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        const userId = req.user._id;
        const token = generateStreamToken(userId);
        
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating Stream Chat token:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}