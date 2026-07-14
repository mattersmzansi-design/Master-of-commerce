import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";
import { DEFAULT_LAYOUT } from "./widgets";

export function usePreferences() {
  const { user } = useAuth();
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [hidden, setHidden] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLayout(DEFAULT_LAYOUT);
      setHidden([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("preferences")
      .select("layout,hidden")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setLayout(data?.layout?.length ? data.layout : DEFAULT_LAYOUT);
        setHidden(data?.hidden ?? []);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const persist = useCallback((nextLayout, nextHidden) => {
    setLayout(nextLayout);
    setHidden(nextHidden);
    if (!user) return;
    supabase.from("preferences").upsert({
      user_id: user.id,
      layout: nextLayout,
      hidden: nextHidden,
      updated_at: new Date().toISOString(),
    });
  }, [user]);

  const toggleHidden = (id) => {
    const next = hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id];
    persist(layout, next);
  };

  const moveWidget = (id, direction) => {
    const idx = layout.indexOf(id);
    const swapWith = idx + direction;
    if (idx === -1 || swapWith < 0 || swapWith >= layout.length) return;
    const next = [...layout];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    persist(next, hidden);
  };

  return { layout, hidden, loading, toggleHidden, moveWidget };
}
