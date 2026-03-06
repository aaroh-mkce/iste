import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './RegistrationForm.css';

const initialForm = { name: '', email: '', phone: '', college: '', department: '', year: '' };

export default function RegistrationForm({ eventId, eventTitle }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('registrations').insert([
        { ...form, event_id: eventId },
      ]);
      if (err) throw err;
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div
        className="reg-form__success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <HiCheckCircle size={48} />
        <h3>Registration Successful!</h3>
        <p>You've been registered for <strong>{eventTitle}</strong>.</p>
      </motion.div>
    );
  }

  return (
    <div className="reg-form">
      <h3 className="reg-form__title">Register for this Event</h3>
      {error && <div className="reg-form__error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="reg-form__row">
          <div className="reg-form__field">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" />
          </div>
          <div className="reg-form__field">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" />
          </div>
        </div>
        <div className="reg-form__row">
          <div className="reg-form__field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 ..." />
          </div>
          <div className="reg-form__field">
            <label>College</label>
            <input name="college" value={form.college} onChange={handleChange} placeholder="Your institution" />
          </div>
        </div>
        <div className="reg-form__row">
          <div className="reg-form__field">
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} placeholder="CSE, ECE, etc." />
          </div>
          <div className="reg-form__field">
            <label>Year</label>
            <select name="year" value={form.year} onChange={handleChange}>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>
        <button type="submit" className="reg-form__submit" disabled={loading}>
          {loading ? 'Registering...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}
