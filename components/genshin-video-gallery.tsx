"use client";

import { useState } from "react";

// Titles verified on YouTube; rounded view milestones checked October 9, 2026.
const videos = [
  { id: "YCZDF-mJo_g", title: "Rickrolling random coop people", views: "124K+" },
  { id: "XH8EY3DaMYI", title: "57k HP Zhongli Tank Build Denying Damage", views: "6K+" },
  { id: "xO2RFpQqoEU", title: 'Get "Friends the World Over" Achievement Much Easier Using This Method (Genshin Impact)', views: "2.9K+" },
];

export function GenshinVideoGallery() {
  const [index, setIndex] = useState(0);
  const video = videos[index];
  return (
    <section className="genshin-gallery" aria-label="Genshin video gallery">
      <div className="genshin-gallery-heading">
        <h4>Videos I’ve made</h4>
        <div className="genshin-gallery-controls">
          <button type="button" aria-label="Previous video" onClick={() => setIndex((current) => (current + videos.length - 1) % videos.length)}>
            <span aria-hidden="true">‹</span>
          </button>
          <span className="genshin-gallery-count">{index + 1} / {videos.length}</span>
          <button type="button" aria-label="Next video" onClick={() => setIndex((current) => (current + 1) % videos.length)}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
      <iframe
        key={video.id}
        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
        title={video.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <div className="genshin-gallery-caption" aria-live="polite" aria-atomic="true">
        <a href={`https://youtu.be/${video.id}`} target="_blank" rel="noopener noreferrer">
          <strong>{video.title}</strong>
          <span>{video.views} views · YouTube <span aria-hidden="true">↗</span></span>
        </a>
      </div>
    </section>
  );
}
