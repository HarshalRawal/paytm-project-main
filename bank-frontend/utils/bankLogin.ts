import axios from 'axios';

export async function bankLogin({ username, password, token }: { username: string; password: string; token: string }) {
  try {
    const response = await axios.post(
      `http://localhost:4009/Demo-bank/net-banking/${token}`,
      { username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Bank login request sent successfully:", response);

    // Log the entire response to inspect its structure
    console.log("Response data:", response.data);

    const data = response.data;

    // Check what statusText is present in the response
    if (response.statusText && response.statusText === "OK") {
      console.log('Login successful, redirecting to wallet...');
      
      // Adding a small delay before redirecting to ensure the browser processes the response
      setTimeout(() => {
        window.location.href = "http://localhost:3000/wallet";  // Update this URL as needed
      }, 500); // 500 ms delay
    } else {
      console.error('Login failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error during bank login:', error);
  }
}
