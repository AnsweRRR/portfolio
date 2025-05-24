import { useNavigate } from 'react-router-dom';

interface ServerError {
  response?: {
    status: number;
  };
}

export const handleServerError = (error: ServerError | Error) => {
  const serverError = error as ServerError;
  if (!navigator.onLine || (serverError?.response?.status ?? 0) >= 500) {
    window.location.href = '/error';
  }
  throw error;
};

export const useErrorHandler = () => {
  const navigate = useNavigate();

  const handleError = (error: ServerError | Error) => {
    const serverError = error as ServerError;
    if (!navigator.onLine || (serverError?.response?.status ?? 0) >= 500) {
      navigate('/error');
    }
    throw error;
  };

  return handleError;
}; 