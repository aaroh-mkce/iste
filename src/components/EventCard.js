import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/outline";
import { format, isPast, isToday } from "date-fns";

const CATEGORY_COLORS = {
  Workshop: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Hackathon: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Seminar: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Competition: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function EventStatus({ date }) {
  const eventDate = new Date(date);
  if (isToday(eventDate)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
      </span>
    );
  }
  if (isPast(eventDate)) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
        Completed
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
      Upcoming
    </span>
  );
}

function Countdown({ date }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = new Date(date) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [date]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2 text-xs mt-2">
      {[["days", "d"], ["hours", "h"], ["minutes", "m"]].map(([key, label]) => (
        <span key={key} className="flex flex-col items-center">
          <span className="font-bold text-brand-400 text-base">{timeLeft[key]}</span>
          <span className="text-gray-500 dark:text-gray-400">{label}</span>
        </span>
      ))}
    </div>
  );
}

export function EventCard({ event, onClick }) {
  const posterUrl = event.poster_image || `https://picsum.photos/seed/${event.id}/400/225`;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(event)}
      className="cursor-pointer group bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-brand-500/10 border border-gray-100 dark:border-white/5 transition-all duration-300"
    >
      {/* Poster */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-900 to-purple-900">
        <img
          src={posterUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
            CATEGORY_COLORS[event.category] || "bg-gray-200 text-gray-700"
          }`}
        >
          {event.category}
        </span>
        <div className="absolute bottom-3 left-3">
          <EventStatus date={event.event_date} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2 mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {event.description}
        </p>

        <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            {format(new Date(event.event_date), "EEE, MMM d yyyy • h:mm a")}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              {event.location}
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
              Max {event.max_participants} participants
            </div>
          )}
        </div>

        {/* Countdown for upcoming */}
        {!isPast(new Date(event.event_date)) && <Countdown date={event.event_date} />}

        {/* Register button */}
        {!isPast(new Date(event.event_date)) && (
          <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(event); }}
            className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            Register Now
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default EventCard;
