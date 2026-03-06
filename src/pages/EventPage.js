import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import EventDetailPage from '../components/EventDetail';
import RegistrationForm from '../components/RegistrationForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../components/EventDetail.css';

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase.from('events').select('*').eq('id', eventId).single();
      if (data) setEvent(data);
      setLoading(false);
    }
    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="events-section__spinner" />
      </div>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="event-detail__loading">
          <div>
            <h2 style={{ marginBottom: '1rem', fontFamily: 'Syne', color: '#09090b' }}>Event not found</h2>
            <Link to="/" style={{ color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const status = (() => {
    if (!event.event_date) return 'upcoming';
    const diff = new Date(event.event_date) - new Date();
    if (diff > 0) return 'upcoming';
    if (diff > -86400000) return 'live';
    return 'completed';
  })();

  return (
    <>
      <Navbar />
      <div className="event-detail">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link to="/" className="event-detail__back" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: '#6366f1', fontSize: '0.88rem', fontWeight: 500,
            marginBottom: '2rem', textDecoration: 'none',
          }}>
            <HiArrowLeft /> Back to Events
          </Link>
        </div>
        <EventDetailPage />
        {status === 'upcoming' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
            <RegistrationForm eventId={event.id} eventTitle={event.title} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
