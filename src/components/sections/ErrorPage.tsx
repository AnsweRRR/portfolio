import { useEffect, useState } from 'react';
import { RaspberryCanvas } from '../canvas';

const ErrorPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const testOfflineMode = () => {
    window.dispatchEvent(new Event('offline'));
  };

  const testServerError = async () => {
    try {
      const response = await fetch('/api/test-error');
      if (!response.ok) {
        throw new Error('Server error');
      }
    } catch {
      window.location.href = '/error';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary dark:bg-primary bg-primary-light">
      <div className="w-64 h-64 mb-8">
        <RaspberryCanvas />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">
        Ooops...Looks like my Raspberry server is down
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        {isOnline 
          ? "The server is currently unavailable. Please try again later."
          : "You're currently offline. Some features may be limited."}
      </p>
      
      {import.meta.env.DEV && (
        <div className="flex gap-4">
          <button
            onClick={testOfflineMode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Test Offline Mode
          </button>
          <button
            onClick={testServerError}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Test Server Error
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorPage; 