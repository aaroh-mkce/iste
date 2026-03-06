import { useState, useEffect, useCallback, useRef } from "react";
import supabase from "../lib/supabaseClient";

const PAGE_SIZE = 10;

/**
 * Generic infinite-scroll hook for any Supabase table.
 * @param {string} table - Supabase table name
 * @param {object} options - { select, order, filters, pageSize }
 */
export function useInfiniteScroll(table, options = {}) {
  const {
    select = "*",
    order = { column: "created_at", ascending: false },
    filters = [],
    pageSize = PAGE_SIZE,
  } = options;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const pageRef = useRef(0);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (page = 0, reset = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        let query = supabase
          .from(table)
          .select(select)
          .order(order.column, { ascending: order.ascending })
          .range(page * pageSize, page * pageSize + pageSize - 1);

        filters.forEach(({ column, op, value }) => {
          query = query.filter(column, op, value);
        });

        const { data, error: err } = await query;

        if (err) throw err;

        setItems((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === pageSize);
        pageRef.current = page + 1;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, select, JSON.stringify(order), JSON.stringify(filters), pageSize]
  );

  useEffect(() => {
    pageRef.current = 0;
    setItems([]);
    setHasMore(true);
    fetchPage(0, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchPage(pageRef.current);
    }
  }, [fetchPage, hasMore]);

  const refresh = useCallback(() => {
    pageRef.current = 0;
    setItems([]);
    setHasMore(true);
    fetchPage(0, true);
  }, [fetchPage]);

  return { items, loading, hasMore, error, loadMore, refresh };
}
