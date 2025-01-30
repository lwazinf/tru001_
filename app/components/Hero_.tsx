"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faFacebook, faGooglePlay, faInstagram, faLinkedinIn, faTiktok } from "@fortawesome/free-brands-svg-icons";
import Pricing_ from "./helpers/pricing";
import Marquee from "./Marquee";

gsap.registerPlugin(ScrollTrigger);

interface CardElement extends HTMLElement {
  style: CSSStyleDeclaration;
}

const Hero_ = () => {
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const thirdSectionRef = useRef(null);
  const mainImgRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const scrollTriggerSettings = {
      trigger: ".main",
      start: "top 75%",
      toggleActions: "play reverse play reverse",
    };

    const animations: (gsap.core.Tween | gsap.core.Timeline)[] = [];

    // First section zoom and parallax
    gsap.set(mainImgRef.current, {
      scale: 1,
      transformOrigin: "center center",
    });

    const firstSectionZoom = gsap.to(mainImgRef.current, {
      scale: 1.5,
      ease: "none",
      scrollTrigger: {
        trigger: firstSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
    animations.push(firstSectionZoom);

    // First section content animations
    const firstSectionTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: firstSectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    firstSectionTimeline
      .to(".first-section-logo", {
        scale: 0.8,
        y: -100,
        ease: "none",
      })
      .to(
        ".first-section-text",
        {
          y: -50,
          ease: "none",
        },
        "<"
      );

    animations.push(firstSectionTimeline);

    // Card animations
    gsap.utils.toArray<Element>(".row").forEach((row: Element) => {
      const rowElement = row as HTMLElement;
      const cardLeft = rowElement.querySelector<CardElement>(".card-left");
      const cardRight = rowElement.querySelector<CardElement>(".card-right");

      if (cardLeft && cardRight) {
        // Set initial positions
        gsap.set(cardLeft, {
          x: "-100vw",
          opacity: 0,
          rotate: -15,
        });

        gsap.set(cardRight, {
          x: "100vw",
          opacity: 0,
          rotate: 15,
        });

        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rowElement,
            start: "top center+=100",
            end: "center center",
            scrub: 1,
          },
        });

        // Animate cards inward with fade
        cardTimeline
          .to(cardLeft, {
            x: 0,
            opacity: 1,
            rotate: 0,
            ease: "power2.out",
            duration: 1,
          })
          .to(
            cardRight,
            {
              x: 0,
              opacity: 1,
              rotate: 0,
              ease: "power2.out",
              duration: 1,
            },
            "<"
          );

        animations.push(cardTimeline);
      }
    });

    // Logo and content animations in middle section
    const logoAnimation = gsap.to(".logo", {
      scale: 3,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });
    animations.push(logoAnimation);

    const lineAnimation = gsap.to(".line p", {
      y: 0,
      stagger: 0.1,
      duration: 1.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });
    animations.push(lineAnimation);

    const buttonAnimation = gsap.to("button", {
      y: 0,
      opacity: 1,
      delay: 0.25,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });
    animations.push(buttonAnimation);

    // Last section zoom and animations
    gsap.set(heroImgRef.current, {
      scale: 1,
      transformOrigin: "center center",
    });

    const lastSectionZoom = gsap.to(heroImgRef.current, {
      scale: 1.3,
      ease: "none",
      scrollTrigger: {
        trigger: thirdSectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
    animations.push(lastSectionZoom);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      animations.forEach((animation) => animation.kill());
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="row flex flex-col md:flex-row gap-4 mb-8 px-4 md:px-0" key={i}>
          <div className="card card-left cursor-pointer w-full md:w-1/2 relative">
            <img
              src={`/assets/images/img-${2 * i - 1}.jpg`}
              alt={`Card left ${i}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="flex flex-col justify-center items-center rounded-[3px] backdrop-blur-md bg-white/10 text-white/50 font-bold absolute right-2 bottom-2 px-4 md:px-6 py-2 text-sm md:text-base">
              {i == 1 ? '1st Frame' : i == 2 ? '2nd Frame' : '3rd Frame'}
            </div>
          </div>
          <div className="card card-right cursor-pointer w-full md:w-1/2 relative">
            <img
              src={`/assets/images/img-${2 * i}.jpg`}
              alt={`Card right ${i}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="flex flex-col justify-center items-center rounded-[3px] backdrop-blur-md bg-white/10 text-white/50 font-bold absolute left-2 bottom-2 px-4 md:px-6 py-2 text-sm md:text-base">
              {i == 1 ? '1st Frame' : i == 2 ? '2nd Frame' : '3rd Frame'}
            </div>
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <ReactLenis root>
      <section
        ref={firstSectionRef}
        className="w-full h-screen relative para overflow-hidden"
      >
        <img
          ref={mainImgRef}
          src="/assets/images/main.jpg"
          className="w-full h-full object-cover"
          alt="Main background"
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="leftFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="first-section-logo text-[100px] md:text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white">
            <div className="first-section-text flex flex-row justify-center items-center h-[350px] md:h-[750px] w-full opacity-[.99] rotate-3 absolute">
              <img
                src="/assets/mockups/profile.png"
                alt="Profile mockup"
                className="w-full h-full object-contain ml-0 md:ml-[450px]"
              />
            </div>
            <div className="first-section-text flex flex-row justify-center items-center h-[350px] md:h-[750px] w-full opacity-[.99] rotate-6 absolute">
              <img
                src="/assets/mockups/orders.png"
                alt="Orders mockup"
                className="w-full h-full object-contain scale-[0.5] md:scale-[0.7] ml-[200px] md:ml-[900px]"
              />
            </div>
            <div className="w-[250px] md:w-[650px] h-[250px] md:h-[650px] z-[4]">
              <img
                src="/assets/images/white_logo.png"
                alt="White logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="first-section-text flex flex-col justify-center items-center w-full md:w-[600px] px-4 md:px-0 h-auto md:h-[250px]">
            <div className="first-section-text flex flex-col justify-center items-start w-full md:w-[390px] md:ml-[70px] h-auto md:h-[250px] mt-[-150px] md:mt-[-350px] mb-[30px] md:mb-[70px]">
              <div className="text-[36px] md:text-[50px] font-black">
                Need To Fuel
              </div>              
              <div className="text-[14px] md:text-[16px] font-bold flex flex-col justify-center">
                <p>
                  Our exclusive mobile fueling service is already trusted by
                  Gauteng&apos;s most discerning professionals and businesses.
                  Experience the difference that comes with never having to
                  visit a fuel station again.
                </p>
              </div>
              <div className="min-w-2 min-h-2 flex flex-row justify-center items-center mt-4">
                <div className="min-w-8 h-8 px-4 text-[12px] text-black bg-white font-semibold flex flex-col justify-center items-center border-white border-[1px] rounded-[20px]">
                  Get Started
                </div>
              </div>
            </div>

            <div className="first-section-text flex flex-col md:flex-row justify-center items-center w-full md:w-[600px] h-auto md:h-[250px] space-y-4 md:space-y-0">
              <div className="text-[14px] md:text-[16px] text-center md:text-end font-medium flex flex-col justify-center items-center md:items-end">
                <p>Need To Fuel&apos;s mobile app is</p>
                <p>now available at your store</p>
              </div>
              <div className="min-w-2 min-h-2 flex flex-row justify-center md:ml-6 items-center">
                {[faApple, faGooglePlay].map((obj_, idx_) => (
                  <div
                    key={idx_}
                    className="mx-1 w-8 h-8 flex flex-col justify-center items-center border-white border-[1px] rounded-[50%]"
                  >
                    <FontAwesomeIcon icon={obj_} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-[400px] relative bottom-[50px] md:bottom-[100px] md:ml-[95px] min-h-2 flex flex-col justify-center items-center scale-[0.7] md:scale-[0.8]">
            <Marquee />
          </div>
        </div>
      </section>

      <section
        ref={secondSectionRef}
        className="main w-full flex flex-col justify-end items-center mt-[45px] md:mt-[90px] mb-[-75px] md:mb-[-150px] z-[4]"
      >
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: "url(/assets/images/main_logo.png)",
            backgroundSize: "100px",
            backgroundRepeat: "repeat",
            transform: "rotate(0deg)",
            pointerEvents: "none",
          }}
        />
        {generateRows()}
      </section>

      <section
        ref={thirdSectionRef}
        className="w-full h-screen relative overflow-hidden"
      >
        <img
          ref={heroImgRef}
          src="/assets/images/hero.jpg"
          className="w-full h-full object-cover"
          alt="Hero background"
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="text-[100px] md:text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white">
            Fuel
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-[600px] h-auto md:h-[250px] px-4 md:px-0 pb-8 md:pb-0">
            <p className="text-[45px] md:text-[65px] font-black md:-rotate-90 text-yellow-700 mb-4 md:mb-0">
              Fuel
            </p>
            <p className="text-[14px] text-center md:text-left">
              Whether you need a fill-up, detailed cleaning, or roadside
              assistance, our professional team comes to you. Get started today
              and experience car care that fits your lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section>
        <Pricing_ />
      </section>

      <section className="footer text-[14px] text-white relative flex flex-col justify-end items-center pb-8 px-4 md:px-8">
        <div>
          <img 
            className="absolute bottom-[-200px] w-[300px] md:w-[600px] opacity-5" 
            src="/assets/images/white_logo.png"
            alt="Footer logo"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-evenly items-center mb-8 w-full min-h-2 space-y-6 md:space-y-0">
          <div className="flex flex-col text-center md:text-left md:relative md:right-[55px]">
            <p>The Green Room</p>
            <p>124 Normal Ave</p>
            <p className="mb-4">7692, South Africa</p>

            <p>support@needtofuel.com</p>
            <p className="mb-4">+27 71 220 4794</p>

            <div className="space-y-1">
              <p className="flex flex-col md:flex-row items-center">
                Monday - Friday 
                <span className="ml-0 md:ml-[8px]">08:00 - 23:00</span>
              </p>
              <p className="flex flex-col md:flex-row items-center">
                Saturday 
                <span className="ml-0 md:ml-[53px]">08:00 - 17:00</span>
              </p>
              <p className="flex flex-col md:flex-row items-center mb-4">
                Sunday 
                <span className="ml-0 md:ml-[60px]">Closed</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[80%] h-[1px] bg-white/20 mb-4" />
        
        <div className="flex flex-col md:flex-row justify-evenly items-center w-full min-h-2 space-y-4 md:space-y-0">
          <p className="text-center">© 2025 - Need To Fuel</p>
          
          <div className="flex flex-row justify-center items-center space-x-3">
            <FontAwesomeIcon icon={faFacebook} className="text-[18px] cursor-pointer hover:text-white/80 transition-colors"/>
            <FontAwesomeIcon icon={faLinkedinIn} className="text-[18px] cursor-pointer hover:text-white/80 transition-colors"/>
            <FontAwesomeIcon icon={faInstagram} className="text-[18px] cursor-pointer hover:text-white/80 transition-colors"/>
            <FontAwesomeIcon icon={faTiktok} className="text-[18px] cursor-pointer hover:text-white/80 transition-colors"/>
          </div>
          
          <div className="flex flex-row justify-center items-center space-x-4">
            <p className="hover:text-white/80 transition-colors cursor-pointer">Terms</p>
            <p className="hover:text-white/80 transition-colors cursor-pointer">Privacy</p>
          </div>
        </div>
      </section>
    </ReactLenis>
  );
};

export default Hero_;