import axios from 'axios';

export const fetchSessionData = async () => {
    console.log("Request Reached fetchSessionData function ")
  try {
    const response = await axios.post('http://localhost:8080/api-gateway/get-session-data', {
      withCredentials: true, // Ensure cookies are sent with the request
    });

    console.log("In fetchData responseAxios fetch called ")
    const { userId, walletId } = response.data;
    console.log(response.data)
    return { userId, walletId };
  } catch (error) {
    console.log('Error fetching session data:', error);
    console.log('Session expired or invalid. Please log in again.');
    // window.location.href = '/signin';
    return null;
  }
};


