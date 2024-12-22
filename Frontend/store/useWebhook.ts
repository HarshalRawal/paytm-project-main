import {  useEffect } from "react";
import { useBalance } from "./useBalance";
import { usePaginationStore } from "./usePaginationState";
import { Transaction } from "./usePaginationState";
const useWebSocket = (userId: string) => {
  useEffect(() => {
    // Ensure userId is passed as part of the WebSocket URL or in a message
    const socket = new WebSocket(`ws://localhost:8080?userId=${encodeURIComponent(userId)}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);
        switch (message.event){
          case 'wallet-notification':
            const { setBalance } = useBalance.getState();
            const { setTransactions, setLoading, setCursor, setHasNextPage } = usePaginationStore.getState();
          
            // Start by setting loading to true while processing the message
            setLoading(true);
          
            if (message.data?.currentBalance !== undefined) {
              console.log('Wallet notification:', message.data);
              setBalance(message.data.currentBalance);
            }
          
            if (message.data?.transactions) {
              console.log('New transactions:', message.data.transactions as Transaction[]);
              // Replace transactions with the new data
              setTransactions(message.data.transactions);
            }
          
            if (message.data?.nextCursor) {
              console.log('Next cursor:', message.data.nextCursor);
              setCursor(message.data.nextCursor);
            } else {
              setCursor(null); // Clear the cursor if not provided
            }
          
            // Update hasNextPage based on the presence of nextCursor
            setHasNextPage(!!message.data.nextCursor);
          
            // Once all updates are done, set loading to false
            setLoading(false);
            break;
              case 'Bank-Token':
                if (message.data?.redirectUrl) {
                  // Show the loading spinner
                  const spinner = document.getElementById('loading-spinner');
                  if (spinner) spinner.classList.remove('hidden');
              
                  // Redirect after a short delay
                  setTimeout(() => {
                    window.location.href = message.data.redirectUrl;
              
                    // Optionally, hide the spinner after redirecting (not strictly necessary)
                    if (spinner) spinner.classList.add('hidden');
                  }, 500); // Matches CSS animation time
                }
                break;
              
          default:
            console.log('Unknown event:', message.event);  
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }// Access the data from the event
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userId]); // Re-run effect if userId changes
};

export default useWebSocket;
