import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  HiCalendar, HiLocationMarker, HiUsers, HiClock, HiFilter,
  HiSearch, HiArrowRight,
} from 'react-icons/hi';
import './EventDetail.css';

function getEventStatus(dateStr) {
  if (!dateStr) return 'upcoming';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d - now;
  if (diff > 0) return 'upcoming';
  if (diff > -86400000) return 'live';
  return 'completed';
}

function Countdown({ targetDate }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      };
    };
    setLeft(calc());
    const t = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="event-countdown">
      {[
        { val: left.days, label: 'Days' },
        { val: left.hours, label: 'Hours' },
        { val: left.mins, label: 'Mins' },
        { val: left.secs, label: 'Secs' },
      ].map((u) => (
        <div key={u.label} className="event-countdown__unit">
          <span className="event-countdown__num">{String(u.val).padStart(2, '0')}</span>
          <span className="event-countdown__lbl">{u.label}</span>
        </div>
      ))}
    </div>
  );
}

export function EventsSection() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);
  const PAGE_SIZE = 10;

  const categories = ['All', 'Workshop', 'Hackathon', 'Seminar', 'Competition'];

  const fetchEvents = useCallback(async (reset = false) => {
    setLoading(true);
    const from = reset ? 0 : page * PAGE_SIZE;
    let q = supabase.from('events').select('*').order('event_date', { ascending: false });
    if (filter !== 'All') q = q.eq('category', filter);
    if (search) q = q.ilike('title', `%${search}%`);
    q = q.range(from, from + PAGE_SIZE - 1);
    const { data } = await q;
    if (data) {
      setEvents((prev) => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      setPage(reset ? 1 : (p) => p + 1);
    }
    setLoading(false);
  }, [filter, search, page]);

  useEffect(() => {
    fetchEvents(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) fetchEvents();
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading]);

  return (
    <section id="events" className="events-section">
      <div className="events-section__container">
        <div className="events-section__header">
          <span className="section-tag">Events</span>
          <h2 className="section-title">
            Explore Our <span className="gradient-text">Events</span>
          </h2>
          <p className="section-description">
            Workshops, hackathons, seminars and more — register and participate!
          </p>
        </div>

        <div className="events-section__toolbar">
          <div className="events-section__search">
            <HiSearch />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="events-section__filters">
            <HiFilter />
            {categories.map((c) => (
              <button
                key={c}
                className={`events-section__filter-btn ${filter === c ? 'events-section__filter-btn--active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="events-section__grid">
          {events.map((event, i) => {
            const status = getEventStatus(event.event_date);
            return (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.poster_image && (
                  <div className="event-card__image">
                    <img src={event.poster_image} alt={event.title} loading="lazy" />
                  </div>
                )}
                <div className="event-card__body">
                  <div className="event-card__top">
                    <span className={`event-card__status event-card__status--${status}`}>
                      {status}
                    </span>
                    <span className="event-card__category">{event.category}</span>
                  </div>
                  <h3 className="event-card__title">{event.title}</h3>
                  <p className="event-card__desc">
                    {event.description?.substring(0, 120)}
                    {event.description?.length > 120 ? '...' : ''}
                  </p>
                  <div className="event-card__meta">
                    {event.event_date && (
                      <span><HiCalendar /> {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    )}
                    {event.location && <span><HiLocationMarker /> {event.location}</span>}
                    {event.max_participants && <span><HiUsers /> {event.max_participants} seats</span>}
                  </div>
                  {status === 'upcoming' && event.event_date && <Countdown targetDate={event.event_date} />}
                  <button className="event-card__cta" onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}>
                    {status === 'upcoming' ? 'Register Now' : 'View Details'} <HiArrowRight />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {events.length === 0 && !loading && (
          <div className="events-section__empty">
            <HiClock size={40} />
            <p>No events found. Check back soon!</p>
          </div>
        )}

        <div ref={loaderRef} className="events-section__loader">
          {loading && <div className="events-section__spinner" />}
        </div>
      </div>
    </section>
  );
}

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const eventId = window.location.pathname.split('/events/')[1];

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (data) setEvent(data);
      setLoading(false);
    }
    if (eventId) fetch();
  }, [eventId]);

  if (loading) return <div className="event-detail__loading">Loading...</div>;
  if (!event) return <div className="event-detail__loading">Event not found.</div>;

  const status = getEventStatus(event.event_date);

  return (
    <div className="event-detail">
      <div className="event-detail__container">
        {event.poster_image && (
          <div className="event-detail__poster">
            <img src={event.poster_image} alt={event.title} />
          </div>
        )}
        <div className="event-detail__info">
          <div className="event-detail__badges">
            <span className={`event-card__status event-card__status--${status}`}>{status}</span>
            <span className="event-card__category">{event.category}</span>
          </div>
          <h1>{event.title}</h1>
          <p className="event-detail__desc">{event.description}</p>
          <div className="event-detail__meta">
            {event.event_date && (
              <div><HiCalendar /> {new Date(event.event_date).toLocaleString('en-IN')}</div>
            )}
            {event.location && <div><HiLocationMarker /> {event.location}</div>}
            {event.max_participants && <div><HiUsers /> {event.max_participants} seats</div>}
          </div>
          {status === 'upcoming' && event.event_date && <Countdown targetDate={event.event_date} />}
        </div>
      </div>
    </div>
  );
}
