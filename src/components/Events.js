import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Marquee from './Marquee';
import './Events.css';

const events = [
  { title: 'Coding Competitions', description: 'Challenge your programming skills in competitive coding events across multiple languages.', tag: 'Popular' },
  { title: 'Technical Quizzes', description: 'Test your knowledge in engineering, science, and technology through quiz competitions.', tag: 'Regular' },
  { title: 'Workshops', description: 'Hands-on workshops covering IoT, Arduino, web development, and emerging technologies.', tag: 'Featured' },
  { title: 'Paper Presentations', description: 'Present your research and innovative ideas to peers and experts in academic sessions.', tag: 'Academic' },
  { title: 'IoT Prototyping', description: 'Build real-world prototypes with Arduino. Our flagship workshop attracted 400+ registrations.', tag: 'Flagship' },
  { title: 'Monsoon Event', description: 'Our signature annual event — coding, quizzes, and creative challenges across domains.', tag: 'Annual' },
];

const eventNames = events.map(e => e.title);

export default function Events() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="events" className="events" ref={ref}>
      <div className="events__container">
        <motion.div
          className="events__header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Events</span>
          <h2 className="section-title">
            What We <span className="gradient-text">Organize</span>
          </h2>
          <p className="section-description">
            From coding sprints to technical workshops — events designed to improve logic,
            problem-solving, and creativity.
          </p>
        </motion.div>

        <div className="events__grid">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="events__card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            >
              <div className="events__card-header">
                <h3>{event.title}</h3>
                <span className="events__card-tag">{event.tag}</span>
              </div>
              <p>{event.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="events__marquee-strip">
        <Marquee speed={30}>
          {eventNames.map((name, i) => (
            <span key={i} className="events__marquee-word">
              {name} <span className="events__marquee-dot">●</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
