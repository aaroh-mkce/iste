import React from 'react';
import './Marquee.css';

export default function Marquee({ children, speed = 40, direction = 'left', className = '', pauseOnHover = true }) {
  const style = {
    '--marquee-speed': `${speed}s`,
  };

  return (
    <div
      className={`marquee ${direction === 'right' ? 'marquee--reverse' : ''} ${pauseOnHover ? 'marquee--pause-hover' : ''} ${className}`}
      style={style}
    >
      <div className="marquee__track">
        <div className="marquee__content">{children}</div>
        <div className="marquee__content" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
