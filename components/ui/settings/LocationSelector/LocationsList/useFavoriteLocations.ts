import { STORAGE_KEY } from "@/constants/keys";
import { ILocation } from "@/types/location.types";
import isValidLocationObject from "@/utils/locations/isValidLocationObject";
import { useCallback, useMemo, useSyncExternalStore } from "react";

// ---------- store externo (localStorage) ----------

const EMPTY: ILocation[] = [];
const listeners = new Set<() => void>();

// Cache para o getSnapshot devolver a mesma referência enquanto o valor não mudar
let cachedRaw: string | null = null;
let cachedParsed: ILocation[] = EMPTY;

function parse(raw: string | null): ILocation[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data.filter(isValidLocationObject);
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): ILocation[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY.FAV_LOCATIONS);
  } catch {
    return EMPTY; // localStorage indisponível (modo privado, bloqueado etc.)
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedParsed = parse(raw);
  }
  return cachedParsed;
}

function getServerSnapshot(): ILocation[] {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Sincroniza alterações feitas em outras abas
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY.FAV_LOCATIONS || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: ILocation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY.FAV_LOCATIONS, JSON.stringify(next));
  } catch {
    // cota excedida ou storage bloqueado: mantém o estado anterior
    return;
  }
  listeners.forEach((l) => l());
}

// ---------- hook ----------

export function useFavoriteLocations() {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  /** Alterna o favorito: remove se já existir, adiciona se não. */
  const toggleFavorite = useCallback((location: ILocation) => {
    if (!isValidLocationObject(location)) return;

    const current = getSnapshot();
    const exists = current.some((l) => l.geonameId === location.geonameId);

    write(
      exists
        ? current.filter((l) => l.geonameId !== location.geonameId)
        : [...current, location],
    );
  }, []);

  /** Verifica se o geonameId está nos favoritos. */
  const isFavorite = useCallback(
    (geonameId: number) => favorites.some((l) => l.geonameId === geonameId),
    [favorites],
  );

  /** Retorna todos os favoritos. */
  const getFavorites = useCallback(() => favorites, [favorites]);

  return useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      getFavorites,
    }),
    [favorites, toggleFavorite, isFavorite, getFavorites],
  );
}