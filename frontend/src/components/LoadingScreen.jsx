import React from 'react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
