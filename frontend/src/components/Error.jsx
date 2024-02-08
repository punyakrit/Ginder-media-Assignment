import React from 'react';

function Error() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-6">Oops! Something went wrong...</h2>
        <p className="text-lg mb-4">We apologize, but an error occurred while processing your request.</p>
        <p className="text-lg">Please try again later or contact support for assistance.</p>
      </div>
    </div>
  );
}

export default Error;
