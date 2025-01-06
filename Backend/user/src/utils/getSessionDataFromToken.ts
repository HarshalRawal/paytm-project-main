
import Redis from 'ioredis';
import  jwt  from 'jsonwebtoken';


const JWT_SECRET = 'your-secret-key';
const redis = new Redis(); // Defaults to localhost:6379
const getSessionDataFromToken = async (sessionId: string) => {
  try {
    console.log("this is the sessionId : " , sessionId)
    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) {
      throw new Error('Session not found');
    }
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error fetching session data:', error);
    throw error;
  }
};

  export default getSessionDataFromToken;
  