'use client'

import ReactLenis from "lenis/react";
import { useEffect, useRef } from "react";

const Hero__ = () => {
    const imgRef = useRef(null);
    const firstSectionRef = useRef(null);
  
    useEffect(() => {
      const animations: (gsap.core.Tween | gsap.core.Timeline)[] = [];
  
      // Set initial scale
      gsap.set(imgRef.current, {
        scale: 1,
        transformOrigin: 'center center'
      });
  
      // Create zoom animation
      const zoomAnimation = gsap.to(imgRef.current, {
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: firstSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          pin: false,
          invalidateOnRefresh: true,
        }
      });
  
      animations.push(zoomAnimation);
  
      // Your other existing animations...
  
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        animations.forEach((animation) => animation.kill());
      };
    }, []);
  
    return (
      <ReactLenis root>
        <section ref={firstSectionRef} className="w-full h-screen relative para overflow-hidden">
          <img
            ref={imgRef}
            src="/assets/images/main.jpg"
            className="w-full h-full object-cover"
          />
          {/* Rest of your content */}
        </section>
        {/* Other sections */}
      </ReactLenis>
    );
  };

  export default Hero__;