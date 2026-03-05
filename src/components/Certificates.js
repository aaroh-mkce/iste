import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiAcademicCap, HiDownload, HiSearch } from 'react-icons/hi';
import { supabase } from '../lib/supabase';
import './Certificates.css';

export default function Certificates() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('participant_id', searchId.trim())
        .single();
      if (data && !error) {
        setResult(data);
      } else {
        setResult(null);
      }
    } catch (err) {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <section id="certificates" className="certificates" ref={ref}>
      <div className="certificates__container">
        <motion.div
          className="certificates__content"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag">Certificates</span>
          <h2 className="section-title">
            Verify Your <span className="gradient-text">Certificate</span>
          </h2>
          <p className="section-description">
            Participated in our events or workshops? Search for your certificate using your
            participant ID to download and verify it.
          </p>

          <div className="certificates__types">
            <div className="certificates__type">
              <HiAcademicCap />
              <span>Event Participation</span>
            </div>
            <div className="certificates__type">
              <HiAcademicCap />
              <span>Workshop Completion</span>
            </div>
            <div className="certificates__type">
              <HiAcademicCap />
              <span>Competition Winners</span>
            </div>
          </div>

          <form className="certificates__search" onSubmit={handleSearch}>
            <div className="certificates__search-input-wrap">
              <HiSearch className="certificates__search-icon" />
              <input
                type="text"
                placeholder="Enter your Participant ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="certificates__search-input"
              />
            </div>
            <button type="submit" className="certificates__search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searched && !loading && (
            <motion.div
              className="certificates__result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {result ? (
                <div className="certificates__found">
                  <div className="certificates__found-info">
                    <h4>{result.name}</h4>
                    <p>{result.event_name} — {result.date}</p>
                  </div>
                  {result.certificate_url && (
                    <a
                      href={result.certificate_url}
                      className="certificates__download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HiDownload /> Download
                    </a>
                  )}
                </div>
              ) : (
                <p className="certificates__not-found">
                  No certificate found for this ID. Please check and try again.
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
