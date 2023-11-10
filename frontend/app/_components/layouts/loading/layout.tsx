import React from 'react';

export default function Loading() {
  return(
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}