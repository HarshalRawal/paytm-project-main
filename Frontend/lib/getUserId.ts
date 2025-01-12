import axios from 'axios';


export async function getUserId(token: string): Promise<{ userId: string; } | null> {
  try {
    const response = await axios.get('http://localhost:6001/check', {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      },
    });

    if (response) {
      // Extract userId and walletId from the response
      const { userId, walletId } = response.data;
      return userId
    } else {
      console.error('Unexpected response ', response);
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching userId:', error.response?.data || error.message);
    return null;
  }
}