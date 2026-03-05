import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiUser } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './Team.css';

const fallbackTeam = [
  { name: 'President', role: 'President', department: 'Leadership' },
  { name: 'Vice President', role: 'Vice President', department: 'Leadership' },
  { name: 'Technical Lead', role: 'Technical Lead', department: 'Technical' },
  { name: 'Creative Lead', role: 'Creative Lead', department: 'Creative' },
  { name: 'Event Coordinator', role: 'Event Coordinator', department: 'Events' },
  { name: 'Developer', role: 'Developer', department: 'Technical' },
];

export default function Team() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [team, setTeam] = useState(fallbackTeam);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase.from('team').select('*').order('order', { ascending: true });
        if (data && !error && data.length > 0) {
          setTeam(data);
        }
      } catch (e) {
        // Use fallback data
      }
    }
    fetchTeam();
  }, []);

  return (
    <section id="team" className="team" ref={ref}>
      <div className="team__container">
        <motion.div
          className="team__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Our Team</span>
          <h2 className="section-title">
            Meet the <span className="gradient-text">Leaders</span>
          </h2>
          <p className="section-description">
            The passionate individuals driving ISTE-SIST Chapter forward — organizing events,
            building community, and inspiring the next generation of engineers.
          </p>
        </motion.div>

        <div className="team__grid">
          {team.map((member, i) => (
            <motion.div
              key={member.name + i}
              className="team__card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="team__card-avatar">
                {member.image_url ? (
                  <img src={member.image_url} alt={member.name} />
                ) : (
                  <HiUser size={32} />
                )}
              </div>
              <h4 className="team__card-name">{member.name}</h4>
              <p className="team__card-role">{member.role}</p>
              {member.department && (
                <span className="team__card-dept">{member.department}</span>
              )}
              <div className="team__card-glow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
