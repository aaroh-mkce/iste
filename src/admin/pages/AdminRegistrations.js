import React, { useState, useEffect, useCallback } from "react";
import supabase from "../../lib/supabaseClient";
import { SpinnerIcon } from "../../components/Icons";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

function exportCSV(rows, eventTitle) {
  if (!rows.length) return;
  const headers = ["Name", "Email", "Phone", "College", "Department", "Year", "Registered At"];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [r.name, r.email, r.phone, r.college, r.department, r.year,
        format(new Date(r.created_at), "dd/MM/yyyy HH:mm")]
        .map((v) => `"${(v || "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `registrations-${eventTitle || "all"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminRegistrations() {
  const [searchParams] = useSearchParams();
  const eventFilter = searchParams.get("event");

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(eventFilter || "");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("events").select("id,title").order("event_date", { ascending: false }).then(({ data }) => {
      setEvents(data || []);
    });
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("registrations").select("*, events(title)").order("created_at", { ascending: false });
    if (selectedEvent) query = query.eq("event_id", selectedEvent);
    const { data } = await query;
    setRegistrations(data || []);
    setLoading(false);
  }, [selectedEvent]);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const filtered = registrations.filter((r) =>
    !search ||
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  const currentEventTitle = events.find((e) => e.id === selectedEvent)?.title || "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white">Registrations</h1>
          <p className="text-white/40 text-sm mt-0.5">{filtered.length} registrations</p>
        </div>
        <button
          onClick={() => exportCSV(filtered, currentEventTitle)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5 hover:text-white transition"
        >
          <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40"
        >
          <option value="">All Events</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-brand-500/40 placeholder-white/30" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><SpinnerIcon className="w-8 h-8 text-brand-500" /></div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                  {["Name", "Email", "Phone", "College", "Department", "Year", "Event", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-white/70">{r.email}</td>
                    <td className="px-4 py-3 text-white/60">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{r.college || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{r.department || "—"}</td>
                    <td className="px-4 py-3 text-white/60">{r.year || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs">
                        {r.events?.title || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">
                      {format(new Date(r.created_at), "dd MMM yyyy")}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-white/30">No registrations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRegistrations;
