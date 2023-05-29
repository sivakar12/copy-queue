import { useState, useEffect } from 'react';
import { Path } from '../App';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if(item && JSON.parse(item) !== storedValue){
      setValue(JSON.parse(item));
    }
  }, [key]);

  return [storedValue, setValue];
}

export function useFavorites(): [Path[], (value: Path[] | ((val: Path[]) => Path[])) => void] {
  const [favorites, setFavorites] = useLocalStorage<Path[]>('favorites', []);
  return [favorites, setFavorites];
}
