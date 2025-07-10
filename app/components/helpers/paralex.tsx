'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = () => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Set initial scale
    gsap.set(imgRef.current, {
      scale: 1,
      transformOrigin: 'center center'
    });

    // Create zoom animation
    const zoomAnimation = gsap.to(imgRef.current, {
      scale: 1.5, // Adjust this value to control zoom intensity
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5, // Adjust this value to control smoothness
        pin: false,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      zoomAnimation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative overflow-hidden">
      <img
        ref={imgRef}
        src="/assets/images/main.jpg"
        className="w-full h-full object-cover"
        alt="Background"
      />
      {/* Your other content */}
    </div>
  );
};

export default ParallaxSection;