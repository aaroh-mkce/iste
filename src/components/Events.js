import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiCode, HiPuzzle, HiDesktopComputer, HiDocumentText, HiChip, HiLightningBolt } from 'react-icons/hi';
import './Events.css';

const events = [
  {
    icon: <HiCode />,
    title: 'Coding Competitions',
    description: 'Challenge your programming skills in competitive coding events across multiple languages and difficulty levels.',
    tag: 'Popular',
  },
  {
    icon: <HiPuzzle />,
    title: 'Technical Quizzes',
    description: 'Test your knowledge in engineering, science, and technology through engaging quiz competitions.',
    tag: 'Regular',
  },
  {
    icon: <HiDesktopComputer />,
    title: 'Workshops',
    description: 'Hands-on workshops covering IoT, Arduino prototyping, web development, and emerging technologies.',
    tag: 'Featured',
  },
  {
    icon: <HiDocumentText />,
    title: 'Paper Presentations',
    description: 'Present your research and innovative ideas to peers and experts in structured academic sessions.',
    tag: 'Academic',
  },
  {
    icon: <HiChip />,
    title: 'IoT Prototyping',
    description: 'Build real-world prototypes with Arduino. Our flagship workshop attracted 400+ registrations.',
    tag: 'Flagship',
  },
  {
    icon: <HiLightningBolt />,
    title: 'Monsoon Event',
    description: 'Our signature annual event featuring multiple domains — coding, quizzes, and creative challenges.',
    tag: 'Annual',
  },
];

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
            From coding sprints to technical workshops, our events are designed to improve logic,
            problem-solving, and creativity in every participant.
          </p>
        </motion.div>

        <div className="events__grid">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              className="events__card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="events__card-header">
                <div className="events__card-icon">{event.icon}</div>
                <span className="events__card-tag">{event.tag}</span>
              </div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="events__card-shine" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
