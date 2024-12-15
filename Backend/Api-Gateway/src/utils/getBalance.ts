import axios from 'axios';


export async function getBalance(userId: string) {
  try {
    const response = await axios.post<number>(
      `http://localhost:8086/getBalance/`,{
        userId
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Error getting balance');
  }
}

