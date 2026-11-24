import { createContext, useCallback, useContext, useEffect, useState, type JSX, type ReactNode } from "react";
import { fetchPortfolio, readCached } from "./api";
import type { Portfolio } from "./types";

interface State {
  data: Portfolio | null;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<State | null>(null);

/** One fetch shared by every tab: cached copy first, then live data. */
export function PortfolioProvider({ children }: { children: ReactNode }): JSX.Element {
  const [data, setData] = useState<Portfolio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setData(await fetchPortfolio());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Cached copy first (instant, offline), then the live fetch.
    readCached()
      .then((cached) => cached && setData((d) => d ?? cached))
      .finally(() => void refresh());
  }, [refresh]);

  return <PortfolioContext.Provider value={{ data, error, refreshing, refresh }}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): State {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}
