"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebook,
  faGooglePlay,
  faInstagram,
  faLinkedinIn,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import Pricing_ from "./helpers/pricing";
import Marquee from "./Marquee";
import { motion } from "framer-motion";
import VerticalGallery from "./helpers/sideSwipe";

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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 5000);

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
      clearInterval(timer);
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="xl:row hidden" key={i}>
          <div className="card card-left cursor-pointer">
            <img
              src={`/assets/images/img-${2 * i - 1}.jpg`}
              alt={`Card left ${i}`}
            />
            <div className="flex flex-col justify-center items-center rounded-[3px] backdrop-blur-md bg-white/10 text-white/50 font-bold absolute right-2 bottom-2 px-6 py-2">
              {i == 1 ? "1st Frame" : i == 2 ? "2nd Frame" : "3rd Frame"}
            </div>
          </div>
          <div className="card card-right cursor-pointer">
            <img
              src={`/assets/images/img-${2 * i}.jpg`}
              alt={`Card right ${i}`}
            />
            <div className="flex flex-col justify-center items-center rounded-[3px] backdrop-blur-md bg-white/10 text-white/50 font-bold absolute left-2 bottom-2 px-6 py-2">
              {i == 1 ? "1st Frame" : i == 2 ? "2nd Frame" : "3rd Frame"}
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
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="leftFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="first-section-logo text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white">
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[750px] w-full opacity-[.99] xl:rotate-3 absolute">
              <img
                src="/assets/mockups/profile.png"
                alt="Main logo"
                className={`${
                  isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[1000ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain xl:scale-[1] scale-[0.8] xl:ml-[450px]`}
              />
            </div>
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[750px] w-full opacity-[.99] xl:rotate-6 absolute">
              <img
                src="/assets/mockups/orders.png"
                alt="Main logo"
                className={`${
                  !isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[1000ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain scale-[0.7] xl:ml-[900px]`}
              />
            </div>
            <div className="w-[650px] xl:h-[650px] h-[350px] xl:flex xl:scale-[1] xl:relative absolute top-[-80px] pointer-events-none scale-[0.7] z-[4]">
              <img
                src="/assets/images/white_logo.png"
                alt="Main logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="first-section-text xl:flex hidden flex-col justify-center items-center w-[600px] h-[250px]">
            <div className="first-section-text flex flex-col justify-center items-start w-[390px] ml-[70px] h-[250px] mt-[-350px] mb-[70px]">
              <div className={`text-[50px] font-black`}>Need To Fuel</div>
              <div className="text-[16px] font-bold flex flex-col justify-center">
                <p>
                  Our exclusive mobile fueling service is already trusted by
                  Gauteng&apos;s most discerning professionals and businesses.
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
                <p>Need To Fuel&apos;s mobile app is</p>
                <p>now available at your store</p>
              </div>
              <div
                className={`min-w-2 min-h-2 flex flex-row justify-center ml-6 items-center z-[5]`}
              >
                {[
                  { icon: faApple, func: () => {} },
                  {
                    icon: faGooglePlay,
                    func: () => {
                      window.open("/assets/apps/app-release.apk");
                    },
                  },
                ].map((obj_, idx_) => {
                  return (
                    <div
                      key={idx_}
                      onClick={obj_.func}
                      className={`cursor-pointer mx-1 w-8 h-8 flex flex-col justify-center items-center border-white border-[1px] rounded-[50%]`}
                    >
                      <FontAwesomeIcon icon={obj_.icon} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div
            className={`w-[400px] opacity-0 relative bottom-[100px] ml-[95px] min-h-2 flex flex-col justify-center items-center scale-[0.8]`}
          >
            <Marquee />
          </div>
        </div>
      </section>

      <section className={`min-h-screen xl:scale-[1] scale-[1]`}>
        <Pricing_ />
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
          <div className="w-full h-full flex flex-col justify-center items-center absolute">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto p-12"
            >
              <div className="relative px-8">
                {/* Top quotes */}
                <span className="absolute -top-8 -left-4 text-yellow-400 text-6xl font-serif">
                  ❝
                </span>

                {/* Quote text */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight text-white mb-8"
                >
                  I can buy anything I want, basically, but I can&apos;t buy
                  time
                </motion.p>

                {/* Bottom quotes */}
                <span className="absolute -bottom-8 -right-4 text-yellow-400 text-6xl font-serif">
                  ❞
                </span>

                {/* Divider */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-12 h-0.5 bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-12 h-0.5 bg-yellow-400"></div>
                </div>

                {/* Attribution */}
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-white text-xl md:text-2xl font-medium"
                >
                  — Warren Buffett
                </motion.p>
              </div>
            </motion.div>
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

      <section
        ref={secondSectionRef}
        className="main w-full flex flex-col justify-start p-4 items-center xl:mt-[90px] xl:mb-[-150px] z-[4]"
      >
        <div
          className="absolute z-[0] top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: "url(/assets/images/main_logo.png)",
            backgroundSize: "100px",
            backgroundRepeat: "repeat",
            transform: "rotate(0deg)",
            pointerEvents: "none",
          }}
        />

        {generateRows()}
        <VerticalGallery />
      </section>

      <section className="footer text-[14px] text-white relative flex flex-col xl:justify-end justify-center items-center pb-8 xl:mt-[150px]">
        <div className={``}>
          <img
            className={`absolute xl:bottom-[-200px] w-[600px] opacity-5`}
            src="/assets/images/white_logo.png"
          />
        </div>
        <div
          className={`flex flex-row xl:justify-evenly justify-center items-center mb-8 w-full min-h-2`}
        >
          <div className={`flec flex-col relative right-[55px]`}>
            <p className={``}>The Green Room</p>
            <p className={``}>124 Normal Ave</p>
            <p className={`mb-4`}>7692, South Africa</p>

            <p className={``}>support@needtofuel.com</p>
            <p className={`mb-4`}>+27 71 220 4794</p>

            <p className={``}>
              Monday - Friday <span className={`ml-[8px]`}>08:00 - 23:00</span>
            </p>
            <p className={``}>
              Saturday <span className={`ml-[53px]`}>08:00 - 17:00</span>
            </p>
            <p className={`mb-4`}>
              Sunday <span className={`ml-[60px]`}>Closed</span>
            </p>
          </div>
          <div
            className={`min-w-2 min-h-2 xl:flex hidden flex-row justify-center items-center`}
          ></div>
          <div
            className={`min-w-2 min-h-2 xl:flex hidden flex-row justify-center items-center`}
          ></div>
        </div>
        <div className={`w-[80%] h-[1px] bg-white/20 mb-4`} />
        <div
          className={`flex xl:flex-row flex-col justify-evenly items-center w-full min-h-2`}
        >
          <p className={`xl:mb-0 mb-4`}>© 2025 - Need To Fuel</p>
          <div
            className={`min-w-2 min-h-2 flex flex-row justify-center items-center xl:mb-0 mb-4`}
          >
            <FontAwesomeIcon
              icon={faFacebook}
              className={`text-[18px] mx-1 cursor-pointer xl:mr-0 mr-4`}
            />
            <FontAwesomeIcon
              icon={faLinkedinIn}
              className={`text-[18px] mx-1 cursor-pointer xl:mr-0 mr-4`}
            />
            <FontAwesomeIcon
              icon={faInstagram}
              className={`text-[18px] mx-1 cursor-pointer xl:mr-0 mr-4`}
            />
            <FontAwesomeIcon
              icon={faTiktok}
              className={`text-[18px] mx-1 cursor-pointer`}
            />
          </div>
          <div
            className={`min-w-2 min-h-2 flex flex-row justify-center items-center`}
          >
            <p className={`mx-2`}>Terms & Conditions</p>
            <p className={`mx-2`}>Privacy Ploicy</p>
          </div>
        </div>
      </section>
    </ReactLenis>
  );
};

export default Hero_;
