import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export function useUserRows(table, { orderBy = "created_at", ascending = false } = {}) {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from(table)
      .select("*")
      .eq("user_id", user.id)
      .order(orderBy, { ascending })
      .then(({ data }) => {
        setRows(data ?? []);
        setLoading(false);
      });
  }, [user, table, orderBy, ascending]);

  useEffect(() => { reload(); }, [reload]);

  const insert = async (values) => {
    const { data, error } = await supabase
      .from(table)
      .insert({ ...values, user_id: user.id })
      .select()
      .single();
    if (!error) setRows(r => (ascending ? [...r, data] : [data, ...r]));
    return { data, error };
  };

  const update = async (id, values) => {
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq("id", id)
      .select()
      .single();
    if (!error) setRows(r => r.map(row => (row.id === id ? data : row)));
    return { data, error };
  };

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (!error) setRows(r => r.filter(row => row.id !== id));
    return { error };
  };

  return { rows, loading, insert, update, remove, reload };
}
