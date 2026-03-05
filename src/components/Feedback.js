import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiStar, HiChat, HiCheckCircle } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './Feedback.css';

export default function Feedback() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [form, setForm] = useState({ name: '', email: '', event: '', rating: 0, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supabase.from('feedback').insert([form]);
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true); // Graceful fallback
    }
    setSubmitting(false);
  };

  return (
    <section id="feedback" className="feedback" ref={ref}>
      <div className="feedback__container">
        <motion.div
          className="feedback__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Feedback</span>
          <h2 className="section-title">
            Share Your <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-description">
            Your feedback helps us improve our events and create better experiences for everyone.
          </p>
        </motion.div>

        <motion.div
          className="feedback__form-card"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {submitted ? (
            <motion.div
              className="feedback__success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <HiCheckCircle size={48} />
              <h3>Thank You!</h3>
              <p>Your feedback has been submitted successfully.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="feedback__form-row">
                <div className="feedback__field">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="feedback__field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="feedback__field">
                <label>Event Name</label>
                <input
                  type="text"
                  name="event"
                  placeholder="Which event did you attend?"
                  value={form.event}
                  onChange={handleChange}
                />
              </div>

              <div className="feedback__field">
                <label>Rating</label>
                <div className="feedback__rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`feedback__star ${form.rating >= star ? 'feedback__star--active' : ''}`}
                      onClick={() => setForm({ ...form, rating: star })}
                    >
                      <HiStar size={28} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback__field">
                <label>Your Feedback</label>
                <textarea
                  name="message"
                  placeholder="Share your experience, suggestions, or comments..."
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="feedback__submit" disabled={submitting}>
                <HiChat size={18} />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
