class SocketService {
    private static instance: SocketService;
    private socket: WebSocket | null = null;
  
    private constructor() {}
  
    public static getInstance(): SocketService {
      if (!SocketService.instance) {
        SocketService.instance = new SocketService();
      }
      return SocketService.instance;
    }
  
    public connect(url: string): void {
      if (this.socket) {
        console.log("WebSocket is already connected.");
        return;
      }
  
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => {
        console.log("WebSocket connected.");
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket disconnected.");
        this.socket = null;
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    public onMessage(callback: (message: unknown) => void): void {
      if (!this.socket) {
        console.error("WebSocket is not connected.");
        return;
      }
  
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  
    public send(data: unknown): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      } else {
        console.error("Cannot send message. WebSocket is not open.");
      }
    }
  
    public disconnect(): void {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
        console.log("WebSocket connection closed.");
      }
    }
  }
export default SocketService