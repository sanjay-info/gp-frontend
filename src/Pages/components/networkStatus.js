import { toast } from 'react-toastify';

export const monitorNetworkStatus = () => {
  const handleOnline = () => {
    toast.success('You are back online!');
  };

  const handleOffline = () => {
    toast.error('You have lost your internet connection.');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};