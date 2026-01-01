import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling async operations
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, data, and error.
  // useCallback ensures the function is not recreated on each render
  const execute = useCallback(() => {
    setStatus('pending');
    setData(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setData(response);
        setStatus('success');
        return response;
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);

  // Call execute if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error, isLoading: status === 'pending' };
}

export default useAsync;