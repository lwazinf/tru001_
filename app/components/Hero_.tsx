"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import Pricing_ from "./helpers/pricing";

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
        <div className="row" key={i}>
          <div className="card card-left">
            <img
              src={`/assets/images/img-${2 * i - 1}.jpg`}
              alt={`Card left ${i}`}
            />
          </div>
          <div className="card card-right">
            <img
              src={`/assets/images/img-${2 * i}.jpg`}
              alt={`Card right ${i}`}
            />
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
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="leftFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="first-section-logo text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white">
            <div className="first-section-text flex flex-row justify-center items-center h-[750px] w-full opacity-[.99] rotate-3 absolute">
              <img
                src="/assets/mockups/profile.png"
                alt="Main logo"
                className="w-full h-full object-contain ml-[450px]"
              />
            </div>
            <div className="w-[650px] h-[650px] z-[4]">
              <img
                src="/assets/images/white_logo.png"
                alt="Main logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="first-section-text flex flex-col justify-center items-center w-[600px] h-[250px]">
            <div className="first-section-text flex flex-col justify-center items-start w-[380px] ml-[70px] h-[250px] mt-[-120px] mb-[70px]">
              <div className="text-[16px] font-medium flex flex-col justify-center">
                <p>
                  Our exclusive mobile fueling service is already trusted by
                  Gauteng's most discerning professionals and businesses.
                  Experience the difference that comes with never having to
                  visit a fuel station again.
                </p>
              </div>
              <div
                className={`min-w-2 min-h-2 flex flex-row justify-center items-center mt-4`}
              >
                {["Get Started"].map((obj_, idx_) => {
                  return (
                    <div
                      key={idx_}
                      className={`min-w-8 h-8 px-4 text-[12px] text-black bg-white font-semibold flex flex-col justify-center items-center border-white border-[1px] rounded-[20px]`}
                    >
                      {obj_}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="first-section-text flex flex-row justify-center items-center w-[600px] h-[250px]">
              {/* <p className="text-[65px] font-black -rotate-90 text-yellow-700">
              Fuel
            </p> */}
              <div className="text-[16px] text-end font-medium flex flex-col justify-center items-end">
                <p>Need To Fuel's mobile app is</p>
                <p>now available at your store</p>
              </div>
              <div
                className={`min-w-2 min-h-2 flex flex-row justify-center ml-6 items-center`}
              >
                {[faApple, faGooglePlay].map((obj_, idx_) => {
                  return (
                    <div
                      key={idx_}
                      className={`mx-1 w-8 h-8 flex flex-col justify-center items-center border-white border-[1px] rounded-[50%]`}
                    >
                      <FontAwesomeIcon icon={obj_} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={secondSectionRef}
        className="main w-full flex flex-col justify-end items-center mt-[90px] mb-[-150px] z-[150]"
      >
        <div 
        className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          backgroundImage: 'url(/assets/images/main_logo.png)',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
          transform: 'rotate(0deg)',
          pointerEvents: 'none'
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
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white">
            Fuel
          </div>
          <div className="flex flex-row justify-center items-center w-[600px] h-[250px]">
            <p className="text-[65px] font-black -rotate-90 text-yellow-700">
              Fuel
            </p>
            <p className="text-[14px]">
              Whether you need a fill-up, detailed cleaning, or roadside
              assistance, our professional team comes to you. Get started today
              and experience car care that fits your lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className={``}>
        <Pricing_/>
      </section>

      <section className="footer" />
    </ReactLenis>
  );
};

export default Hero_;
