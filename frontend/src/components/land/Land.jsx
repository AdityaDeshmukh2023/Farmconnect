import './land.css'

import  { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Land() {
 
    const imagess = ['/assets/landing-page/box1_image.jpg','/assets/landing-page/box2_image.jpg','/assets/landing-page/box3_image.jpg','/assets/landing-page/box4_image.jpg','/assets/landing-page/box5_image.jpg','/assets/landing-page/box6_image.jpg','/assets/landing-page/box7_image.jpg','/assets/landing-page/box8_image.jpg']
    useEffect(() => {
        const boxes = document.querySelectorAll('.box');
    
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = 1;
              entry.target.style.transform = 'translateY(0)';
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
    
        boxes.forEach(box => {
          box.style.opacity = 0;
          box.style.transform = 'translateY(50px)';
          box.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          observer.observe(box);
        });
      }, []);
  return (
    <div className='landing-page'>
        <div className="hero-section" style={{ backgroundImage: `url('/assets/landing-page/hero_image.png')` }}>
          <div className="hero-msg">
            <p>
              Our Site Is Available In Many Languages
              <Link to="/change-language">Click here to change the language</Link>
            </p>

          </div>
        </div>
       
        <div className="shop-section">
          {['Weather Forecasting', 'News & Schemes', 'GreenScan Diagnostics', 'AgriLoop(Reel)', 'Community Sharing ', 'Expert Connections', 'Market Analysis', 'Diary & Poultry Guidance'].map((category, index) => (
            <div className="box" key={index}>
              <div className="box-content">
                <h2>{category}</h2>
                <div className="box-img" style={{ backgroundImage: `url(${imagess[index]})` }}></div>
                {/* <p>See more</p> */}
              </div>
            </div>
          ))}
        </div>
       
    </div>
  )
    
}
