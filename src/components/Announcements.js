import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiSpeakerphone } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './Announcements.css';

export default function Announcements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setAnnouncements(data);
    }
    fetch();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <section id="announcements" className="announcements" ref={ref}>
      <div className="announcements__container">
        <motion.div
          className="announcements__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Announcements</span>
          <h2 className="section-title">
            Latest <span className="gradient-text">Updates</span>
          </h2>
        </motion.div>

        <div className="announcements__list">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              className="announcements__card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <div className="announcements__icon">
                <HiSpeakerphone />
              </div>
              <div className="announcements__content">
                <h4>{a.title}</h4>
                <p>{a.description}</p>
                <span className="announcements__date">
                  {new Date(a.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
