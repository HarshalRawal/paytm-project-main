import { create } from "zustand";
import { useBalance } from "./useBalance"; // Your balance state hook
import { usePaginationStore } from "./usePaginationState"; // Your pagination state hook
interface WebSocketStore {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: string | null;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (message: unknown) => void;
  setConnectionStatus: (status: boolean) => void;
  handleMessage: (event: MessageEvent) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  userId: null,
  connect: (userId: string) => {
    // If already connected, do nothing
    if (get().isConnected) {
      console.log("WebSocket already connected");
      return;
    }
    const socket = new WebSocket(`ws://localhost:8080?userId=${encodeURIComponent(userId)}`);

    socket.onopen = () => {
      set({ isConnected: true, socket });
      console.log("WebSocket connected.");
    };

    socket.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log("WebSocket disconnected.");
      // Attempt to reconnect after a delay
      setTimeout(() => {
        get().connect(userId);
      }, 5000); // Reconnect after 5 seconds
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = get().handleMessage; // Register the message handler
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ isConnected: false, socket: null });
      console.log("WebSocket disconnected manually.");
    }
  },
  sendMessage: (message: unknown) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error("Cannot send message. WebSocket is not open.");
    }
  },
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
  handleMessage: (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Received WebSocket message:", message);

      switch (message.event) {
        case "wallet-notification": {
          console.log("Wallet notification:", message.data);
          const { setBalance } = useBalance.getState();
          const { setTransactions, setLoading, setCursor, setHasNextPage } = usePaginationStore.getState();

          // Start by setting loading to true while processing the message
          setLoading(true);

          if (message.data?.currentBalance !== undefined) {
            console.log("Wallet notification:", message.data);
            setBalance(message.data.currentBalance);
          }

          if (message.data?.transactions) {
            console.log("New transactions:", message.data.transactions);
            // Replace transactions with the new data
            setTransactions(message.data.transactions);
          }

          if (message.data?.nextCursor) {
            console.log("Next cursor:", message.data.nextCursor);
            setCursor(message.data.nextCursor);
          } else {
            setCursor(null); // Clear the cursor if not provided
          }

          // Update hasNextPage based on the presence of nextCursor
          setHasNextPage(!!message.data.nextCursor);

          // Once all updates are done, set loading to false
          setLoading(false);
          break;
        }

        case "Bank-Token": {
          if (message.data?.redirectUrl) {
            // Show the loading spinner
            const spinner = document.getElementById("loading-spinner");
            if (spinner) spinner.classList.remove("hidden");

            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = message.data.redirectUrl;

              // Optionally, hide the spinner after redirecting
              if (spinner) spinner.classList.add("hidden");
            }, 500); // Matches CSS animation time
          }
          break;
        }

        default:
          console.log("Unknown event:", message);
          break;
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  },
}));

