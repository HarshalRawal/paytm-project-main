// import { useWebSocketStore } from "@/store/webSocketStore"; // Assuming the store is in /store/webSocketStore
// import { useBalance } from "./useBalance"; // Your balance state hook
// import { usePaginationStore } from "./usePaginationState"; // Your pagination state hook

// const useWebSocket = (userId: string) => {
//   const { socket, isConnected, connect, disconnect, sendMessage } = useWebSocketStore();
  
//   // Connect to WebSocket when the hook is called
//   if (!userId) {
//     console.error("User ID is required for WebSocket connection.");
//     return { isConnected, sendMessage, socket };
//   }

//   if (!isConnected) {
//     connect(userId);
//   }

//   // Handle incoming WebSocket messages
//   const handleMessage = (event: MessageEvent) => {
//     try {
//       const message = JSON.parse(event.data);
//       console.log("Received WebSocket message:", message);
      
//       switch (message.event) {
//         case "wallet-notification": {
//           const { setBalance } = useBalance.getState();
//           const { setTransactions, setLoading, setCursor, setHasNextPage } = usePaginationStore.getState();

//           // Start by setting loading to true while processing the message
//           setLoading(true);

//           if (message.data?.currentBalance !== undefined) {
//             console.log("Wallet notification:", message.data);
//             setBalance(message.data.currentBalance);
//           }

//           if (message.data?.transactions) {
//             console.log("New transactions:", message.data.transactions);
//             // Replace transactions with the new data
//             setTransactions(message.data.transactions);
//           }

//           if (message.data?.nextCursor) {
//             console.log("Next cursor:", message.data.nextCursor);
//             setCursor(message.data.nextCursor);
//           } else {
//             setCursor(null); // Clear the cursor if not provided
//           }

//           // Update hasNextPage based on the presence of nextCursor
//           setHasNextPage(!!message.data.nextCursor);

//           // Once all updates are done, set loading to false
//           setLoading(false);
//           break;
//         }

//         case "Bank-Token": {
//           if (message.data?.redirectUrl) {
//             // Show the loading spinner
//             const spinner = document.getElementById("loading-spinner");
//             if (spinner) spinner.classList.remove("hidden");

//             // Redirect after a short delay
//             setTimeout(() => {
//               window.location.href = message.data.redirectUrl;

//               // Optionally, hide the spinner after redirecting
//               if (spinner) spinner.classList.add("hidden");
//             }, 500); // Matches CSS animation time
//           }
//           break;
//         }

//         default:
//           console.log("Unknown event:", message.event);
//           break;
//       }
//     } catch (error) {
//       console.error("Error parsing WebSocket message:", error);
//     }
//   };

//   // Register the message handler if socket is connected
//   if (socket) {
//     socket.onmessage = handleMessage;
//   }

//   return {
//     isConnected,
//     sendMessage,
//     socket, // Expose socket for direct usage if needed
//     disconnect, // Expose disconnect in case the caller wants to disconnect manually
//   };
// };

// export default useWebSocket;
