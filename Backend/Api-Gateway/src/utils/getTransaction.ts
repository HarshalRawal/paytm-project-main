import axios from 'axios';

export const fetchTransactionsFromWalletServer = async (walletId: string, cursor: string | null, limit: number) => {
  try {
    const response = await axios.get('http://localhost:8086/transactions', {
      params: { walletId, cursor, limit }
    });

    // Check if the response data is a string and needs to be parsed
    if (typeof response.data === 'string') {
      return JSON.parse(response.data);  // Parse the stringified JSON response
    }

    // Return data as is if it's already an object
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions from wallet server:", error);
    throw new Error("Error fetching transactions from wallet server");
  }
};
