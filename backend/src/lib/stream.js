import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error('STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables');
}

const client = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser=async(userData) => {
    try {
        const {id, name, image} = userData;
        if(!id || !name) {
            throw new Error('User ID and name are required');
        }

        const user = {
            id,
            name,
            image: image || '',
        };

        await client.upsertUser(user);
        return user;
    } catch (error) {
        console.error('Error upserting Stream user:', error);
        throw error;
    }
}

export const generateStreamToken = (userId) => {
    if(!userId) {
        throw new Error('User ID is required to generate Stream token');
    }
    
    const userIdString = userId.toString();

    return client.createToken(userIdString);
}