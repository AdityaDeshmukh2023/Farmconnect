import './agroloop.css'
import  { useEffect, useRef } from 'react';


export default function AgroLoop() {
  const videoUrls = ['/assets/agro-loop/v1.mp4','/assets/agro-loop/v2.mp4'];
  const videoRefs = useRef([]);

  const handleIntersection = (entries) => {
      entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && video.paused) {
              video.play().catch((error) => console.error("Error playing video:", error));
          } else if (!entry.isIntersecting && !video.paused) {
              video.pause();
          }
      });
  };

  const handleClick = (index) => {
      const video = videoRefs.current[index];
      if (video) {
          video.muted = !video.muted; 
      }
  };

  useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
          threshold: 0.75, 
      });

      videoRefs.current.forEach((video) => {
          if (video) observer.observe(video);
      });

      return () => {
          observer.disconnect(); 
      };
  }, []);

  return (
      <div className='containerofreel'>
          
          <div className='header'>
              <h1>Agro~Loop</h1>
          </div>
          <div className='r-container'>
              <div className='reel-container'>
                  {videoUrls.map((url, index) => (
                      <div key={index} className="video-wrapper">
                          <video
                              src={url}
                              controls
                              loop
                              muted
                              className="reel-video"
                              ref={(el) => (videoRefs.current[index] = el)}
                              onClick={() => handleClick(index)}
                          ></video>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  )
}
