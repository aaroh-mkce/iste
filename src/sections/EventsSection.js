import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AnimatedSection } from "../components/AnimatedSection";
import { EventCard } from "../components/EventCard";
import { InfiniteSentinel } from "../components/InfiniteSentinel";
import { RegistrationForm } from "../components/RegistrationForm";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SpinnerIcon } from "../components/Icons";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CATEGORIES = ["All", "Workshop", "Hackathon", "Seminar", "Competition"];

export function EventsSection({ type = "upcoming" }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filters = [];
  if (selectedCategory !== "All") {
    filters.push({ column: "category", op: "eq", value: selectedCategory });
  }

  const { items: events, loading, hasMore, loadMore } = useInfiniteScroll("events", {
    order: { column: "event_date", ascending: type === "upcoming" },
    filters,
  });

  const now = new Date();
  const filteredEvents = events.filter((e) => {
    const date = new Date(e.event_date);
    const matchType = type === "upcoming" ? date >= now : date < now;
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const sectionId = type === "upcoming" ? "events" : "past-events";
  const title = type === "upcoming" ? "Upcoming Events" : "Past Events";

  return (
    <section id={sectionId} className={`py-24 ${type === "upcoming" ? "bg-white dark:bg-dark-900" : "bg-gray-50 dark:bg-dark-800"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 text-sm font-medium mb-4">
            {type === "upcoming" ? "Don't Miss Out" : "Our Journey"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {type === "upcoming"
              ? "Register for our next events and boost your technical career."
              : "A look back at what we've accomplished together."}
          </p>
        </AnimatedSection>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500/50 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-brand-600 to-purple-600 text-white border-transparent shadow-md"
                    : "bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-brand-500/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 && !loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-3">📅</div>
            <p>No {type} events found.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} onClick={setSelectedEvent} />
            ))}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center mt-8">
            <SpinnerIcon className="w-8 h-8 text-brand-500" />
          </div>
        )}

        {/* Infinite sentinel */}
        {hasMore && !loading && (
          <InfiniteSentinel onVisible={loadMore} loading={loading} />
        )}
      </div>

      {/* Registration modal */}
      <AnimatePresence>
        {selectedEvent && (
          <RegistrationForm event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
