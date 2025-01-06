'use client'
import axios from 'axios';
import React from 'react';

export default function Check() {
  // Function to make the authenticated request
  const makeAuthenticatedRequest = async () => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No token found!');
      return;
    }

    try {
      // Make the authenticated request
      const response = await axios.get('http://localhost:6001/check', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error making authenticated request:', error);
    }
  };

  return (
    <div>
      <button onClick={makeAuthenticatedRequest}>Click to Check</button>
    </div>
  );
}