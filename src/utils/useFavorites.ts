import { Path } from "../types";
import { useLocalStorage } from "./useLocalStorage";

export default function useFavorites(): [Path[], (value: Path[] | ((val: Path[]) => Path[])) => void] {
    const [favorites, setFavorites] = useLocalStorage<Path[]>('favorites', []);
    return [favorites, setFavorites];
  }
  