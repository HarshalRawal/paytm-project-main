import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Define the proxy middleware
export const topUpProxy = createProxyMiddleware({
  target: 'http://localhost:5007', // Replace with the actual Top-Up Service URL
  changeOrigin: true,
  selfHandleResponse: true, // Ensure we handle the response manually
  on: {
    proxyReq: (proxyReq, req: Request) => {
      const idempotencyKey =  req.headers['idempotency-key'];
      console.log("Request received in API Gateway:", req.body);
      console.log("Forwarding request to Payment Service");

      // Ensure that the proxy request forwards the body correctly
      if (req.body) {

       const bodyWithIdempotancyKey = {
         ...req.body,
         idempotencyKey
       }

        const bodyData = JSON.stringify(bodyWithIdempotancyKey);
        // Update the headers in the proxy request
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // Write the body to the proxy request
        proxyReq.write(bodyData);
      }
    },
    proxyRes: async (proxyRes, req: Request, res: Response) => {
      let body: Uint8Array[] = []; // Use Uint8Array to handle binary data
    
      // Collect the response data from the Payment Service
      proxyRes.on('data', (chunk) => {
        body.push(chunk);
      });
    
      // Once the response is complete, process the data
      proxyRes.on('end', () => {
        const responseData = Buffer.concat(body).toString(); // Concatenate all chunks into a single string
    
        // Check Content-Type header to determine response type (JSON or plain text)
        const contentType = proxyRes.headers['content-type'] || '';
        const isJson = contentType.includes('application/json');
    
        try {
          if (isJson) {
            // Parse the JSON response from Payment Service
            const responseJson = JSON.parse(responseData);
    
            // Log the response for debugging
            console.log("Response from Payment Service (JSON):", responseJson);
    
            // Set response headers and send JSON response back to client
            Object.keys(proxyRes.headers).forEach((key) => {
              res.setHeader(key, proxyRes.headers[key] as string);
            });
            res.status(proxyRes.statusCode ?? 200).json(responseJson);
          } else {
            // If the response is plain text, treat it as such
            console.log("Response from Payment Service (Text):", responseData);
    
            // Set response headers and send plain text response back to client
            Object.keys(proxyRes.headers).forEach((key) => {
              res.setHeader(key, proxyRes.headers[key] as string);
            });
            res.status(proxyRes.statusCode ?? 200).send(responseData);
          }
        } catch (error) {
          // Handle JSON parse error or unexpected issues
          console.error("Error parsing response from Payment Service:", error);
    
          // Send error response back to the client
          if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
      });
    
      // Handle errors during response handling
      proxyRes.on('error', (err) => {
        console.error("Error in proxy response:", err);
    
        // Ensure the client receives a proper error response
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to process response from Payment Service' });
        }
      });
    }
    
  }
});
