import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Obtener valor inicial del localStorage o usar el valor por defecto
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Guardar en localStorage cuando cambie el valor
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Limpiar el valor del localStorage
  const clearValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue, clearValue] as const;
}

// Hook para limpiar todos los datos de la app
export function useClearAllData() {
  const clearAll = useCallback(() => {
    const keys = ['drinks-manager-supplies', 'drinks-manager-drinks', 'drinks-manager-sales'];
    keys.forEach(key => {
      window.localStorage.removeItem(key);
    });
  }, []);

  return clearAll;
}
