"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import Pricing_ from "./helpers/pricing";
import Marquee from "./Marquee";
import { motion } from "framer-motion";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import TermsModal from "./helpers/termsModal";
import { PolicyState } from "./atoms/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
// import VerticalGallery from "./helpers/sideSwipe";

gsap.registerPlugin(ScrollTrigger);

interface CardElement extends HTMLElement {
  style: CSSStyleDeclaration;
}

const Hero_ = () => {
  const firstSectionRef = useRef(null);
  // const secondSectionRef = useRef(null);
  const [, setIsOpen] = useAtom(PolicyState);
  const router = useRouter();
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

  return (
    <ReactLenis root>
      <section
        ref={firstSectionRef}
        id="hero_section"
        className="w-full h-screen relative para overflow-hidden"
      >
        <img
          ref={mainImgRef}
          src="/assets/images/main.jpg"
          className="w-full h-full object-cover grayscale-[0.6]"
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="leftFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute top-0 w-full h-full flex flex-col justify-end items-start text-white">
          <div className="first-section-logo text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white z-[1]">
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[650px] w-full opacity-[.99] xl:rotate-3 xl:absolute hidden left-0">
              <img
                src="/assets/mockups/profile.png"
                alt="Phone"
                className={`${
                  isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[200ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain xl:ml-[450px]`}
              />
            </div>
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[650px] w-full opacity-[.99] xl:rotate-6 xl:absolute hidden left-0">
              <img
                src="/assets/mockups/orders.png"
                alt="Phone"
                className={`${
                  !isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[200ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain xl:ml-[900px]`}
              />
            </div>
            <div className="mr-[0px] xl:bottom-[250px] w-[650px] xl:h-[650px] h-[350px] flex flex-col justify-center items-center xl:scale-[1] xl:hidden absolute pointer-events-none z-[4]">
              <img
                src="/assets/images/main_logo.png"
                alt="Main logo"
                className="w-[450px] h-[250px] object-cover"
              />
              <div className="flex flex-col justify-center items-start min-w-[450px] h-[150px] rounded-[6px] bg-white/15 backdrop-blur-sm">
                <img
                  src="/assets/images/logoText.png"
                  alt="Main logo"
                  className="w-[450px] object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-col justify-center items-center w-full min-h-screen z-[0] relative right-[200px] xl:flex hidden">
            <div className="flex flex-col justify-center items-start min-w-[450px] ml-[150px] min-h-[250px] p-4 pl-12 rounded-[6px] bg-white/10 backdrop-blur-lg">
              <div
                className={`relative h-[200px] w-[200px] overflow-hidden flex flex-col justify-center items-center ml-[50px]`}
              >
                <img
                  src="/assets/images/main_logo.png"
                  alt="Main logo"
                  className="w-[300px] h-[300px] object-cover scale-[1.8]"
                />
              </div>
              <div
                className={`xl:flex hidden text-[35px] font-black lobster text-white/80 gabarito w-[350px]`}
              >
                All your vehicles needs met.
              </div>
              <div
                className={`text-[60px] xl:flex hidden font-black lobster bg-gradient-to-r from-orange-500/80 to-[#9f2d01] bg-clip-text text-transparent`}
              >
                You&apos;re covered!
              </div>
              <div className="text-[16px] xl:flex hidden flex-col w-[350px] relative justify-center tinos-regular">
                <p>
                  Our exclusive mobile fueling service is already trusted by
                  Gauteng&apos;s most discerning professionals and businesses.
                  Experience the difference that comes with never having to
                  visit a fuel station again.
                </p>
              </div>
              <div
                className={`min-w-2 min-h-2 flex-row justify-center items-center mt-4 xl:flex hidden`}
              >
                {["Get Started"].map((obj_, idx_) => {
                  return (
                    <div
                      key={idx_}
                      className={`min-w-8 h-8 px-4 text-[12px] text-white bg-orange-600 font-semibold flex flex-col justify-center items-center rounded-[20px] cursor-pointer`}
                      onClick={() => router.push('/auth')}
                    >
                      {obj_}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div className="first-section-text xl:flex hidden flex-row justify-center items-center w-[600px] h-[250px]">
              <p className="text-[65px] font-black -rotate-90 text-yellow-700">
              Fuel
              </p>
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
                      window.open(
                        "https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30"
                      );
                    },
                  },
                ].map((obj_, idx_) => {
                  return (
                    <div
                      key={idx_}
                      onClick={obj_.func}
                      className={`cursor-pointer mx-1 w-8 h-8 flex flex-col justify-center items-center border-orange-500 text-orange-500 border-[1px] rounded-[50%]`}
                    >
                      <FontAwesomeIcon icon={obj_.icon} />
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
          <div
            className={`w-[400px] opacity-0 relative bottom-[100px] ml-[95px] min-h-2 flex flex-col justify-center items-center scale-[0.8]`}
          >
            <Marquee />
          </div>
          <div className={`w-full min-h-2 px-6 mb-10 block xl:hidden`}>
            {["Learn About Our App.."].map((obj_, idx_) => {
              return (
                <div
                  key={idx_}
                  className={`min-w-8 h-12 px-4 text-[12px] text-white flex flex-row justify-center font-semibold items-center`}
                >
                  <p className={`mr-2`}>{obj_}</p>
                  <FontAwesomeIcon
                    icon={faAngleDoubleDown}
                    className="text-orange-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={thirdSectionRef}
        className="w-full h-screen relative xl:hidden overflow-hidden flex flex-col justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center w-full min-h-2 text-white text-center px-4">
          {/* Images Container */}
          <div className="relative w-full flex justify-center items-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
            <img
              src="/assets/mockups/profile.png"
              alt="Need To Fuel mobile app profile screen"
              className={`
                absolute
                floating-image
                ${isVisible ? 'visible' : ''}
                animate-float
                w-[250px]
                sm:w-[300px]
                md:w-[340px]
                object-contain
                z-10
              `}
              style={{
                transitionProperty: 'all',
                transitionDuration: '1000ms'
              }}
            />
            <img
              src="/assets/mockups/orders.png"
              alt="Need To Fuel mobile app orders screen"
              className={`
                absolute
                floating-image
                ${!isVisible ? 'visible' : ''}
                animate-float
                w-[250px]
                sm:w-[300px]
                md:w-[340px]
                object-contain
                z-10
              `}
              style={{
                transitionProperty: 'all',
                transitionDuration: '1000ms'
              }}
            />
          </div>

          {/* Text and Buttons Container */}
          <div className="flex flex-col justify-center items-center w-full max-w-2xl px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-white">
              Mobile App Features
            </h2>
            <div className="tinos-regular text-white/80 text-sm sm:text-base px-2 sm:px-8 leading-relaxed mb-6">
              At Need To Fuel, we understand that time is your most valuable
              asset. That&apos;s why we&apos;ve crafted a suite of bespoke services—mobile
              refueling, vehicle valet, tyre inspections, and roadside
              assistance—designed to offer you unparalleled convenience and
              peace of mind, all at the touch of a button.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-6 mb-8">
              <a 
                href="https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30"
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 sm:w-48 hover:scale-105 transition-transform shadow-lg rounded-lg overflow-hidden"
                aria-label="Download Android App"
              >
                <img
                  src="/assets/icons/PlayStore.png"
                  alt="Get it on Google Play"
                  className="w-full h-auto"
                />
              </a>
              <a 
                href="#"
                className="w-40 sm:w-48 hover:scale-105 transition-transform shadow-lg rounded-lg overflow-hidden relative"
                aria-label="Download iOS App - Coming Soon"
                onClick={(e) => {
                  e.preventDefault();
                  alert('iOS app coming soon!');
                }}
              >
                <img
                  src="/assets/icons/AppStore.png"
                  alt="Download on App Store"
                  className="w-full h-auto opacity-20"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  Coming Soon
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={thirdSectionRef}
        id="services_section"
        className="w-full h-screen min-h-screen relative para overflow-hidden bg-white"
      >
        <img
          ref={heroImgRef}
          src="/assets/images/hero.jpg"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="topFade absolute top-0 w-full h-full" />
        <div className="rotate-180 topFade absolute top-0 w-full h-full" />
        <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center text-white">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto p-4 sm:p-6 md:p-12"
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
                  className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight text-white lobster mb-8"
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
                  className="text-center text-white/50 text-xl md:text-2xl font-medium tinos-regular-italic"
                >
                  — Warren Buffett
                </motion.p>
              </div>
            </motion.div>
          </div>
          {/* <div className="flex flex-row justify-center items-center w-[600px] h-[250px]">
            <p className="text-[14px]">
              Whether you need a fill-up, detailed cleaning, or roadside
              assistance, our professional team comes to you. Get started today
              and experience car care that fits your lifestyle.
            </p>
          </div> */}
        </div>
        <div
          className={`absolute top-0 xl:flex hidden flex-col justify-end items-center w-full h-full`}
        >
          <div
            className={`flex xl:flex-row w-full h-full justify-center items-end `}
          >
            {[
              "https://images.pexels.com/photos/6873123/pexels-photo-6873123.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://images.pexels.com/photos/20500734/pexels-photo-20500734/free-photo-of-distributor-on-a-petrol-station.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
              "https://images.pexels.com/photos/3807167/pexels-photo-3807167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            ].map((obj_, idx_) => {
              return (
                <div
                  key={idx_}
                  className="first-section-text flex flex-col justify-center items-start w-[390px] text-center h-[250px] mx-2 text-white"
                >
                  <div
                    className={`w-[400px] h-[750px] rounded-[6px] flex flex-col justify-center items-center relative overflow-hidden bg-white/5 backdrop-blur-sm`}
                  >
                    <img className={`w-full h-full object-cover`} src={obj_} />
                  </div>
                </div>
              );
            })}
          </div>
          <p
            className={`text-center text-white/60 w-[600px] font-medium opacity-80 tinos-regular xl:scale-[1] scale-[0.8] relative top-[0px]`}
          >
            Our commitment is to provide exceptional, seamless service, allowing
            you to focus on what truly matters—whether it’s your business, your
            passions, or your loved ones. Because for those who demand
            excellence, time should never be a compromise.
          </p>
        </div>
      </section>

      <section 
        id="services_section"
        className="xl:hidden flex"
      >
        <div
          className={`flex flex-col justify-center items-center w-full h-full`}
        >
          <div
            className={`flex flex-col w-full h-full justify-center items-center relative`}
          >
            {[
              "https://images.pexels.com/photos/6873123/pexels-photo-6873123.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://images.pexels.com/photos/20500734/pexels-photo-20500734/free-photo-of-distributor-on-a-petrol-station.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
              "https://images.pexels.com/photos/3807167/pexels-photo-3807167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            ].map((obj_, idx_) => {
              return (
                <div
                  key={idx_}
                  className="flex flex-col justify-center items-start w-[390px] text-center h-[250px] my-2 text-white"
                >
                  <div
                    className={`w-[400px] h-[750px] rounded-[6px] flex flex-col justify-center items-center relative overflow-hidden bg-white/5 backdrop-blur-sm`}
                  >
                    <img className={`w-full h-full object-cover`} src={obj_} />
                  </div>
                </div>
              );
            })}
          </div>
          <p
            className={`text-[30px] font-black text-orange-500 tinos-regular-italic`}
          >
            Our Commitment
          </p>
          <p
            className={`text-center text-white/80 text-[13px] font-medium tinos-regular p-4 relative top-[0px]`}
          >
            Our commitment is to provide exceptional, seamless service, allowing
            you to focus on what truly matters—whether it&apos;s your business, your
            passions, or your loved ones. Because for those who demand
            excellence, time should never be a compromise.
          </p>
        </div>
      </section>

      <section
        id="pricing_section"
        className="third-section w-full min-h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden"
      >
        <Pricing_ />
      </section>

      {/* <section
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
      </section> */}

      <section 
        id="contact_section"
        className="footer-section relative bg-black pt-24 pb-12"
      >
        {/* Subtle top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>
        
        {/* Background logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
          <img
            src="/assets/images/white_logo.png"
            alt=""
            className="w-[900px] max-w-none"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
            {/* Company info - 4 columns on desktop, full width on mobile */}
            <div className="md:col-span-4">
              <div className="mb-8 flex flex-col items-center md:items-start">
                {/* Logo section with both image logo and text logo */}
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg">
                    <img 
                      src="/assets/images/main_logo.png" 
                      alt="Need To Fuel" 
                      className="w-full h-full object-cover rounded-full bg-black p-1"
                    />
                  </div>
                  <img 
                    src="/assets/images/logoText.png" 
                    alt="Need To Fuel" 
                    className="h-10"
                  />
                </div>
                
                <div className="w-16 h-0.5 bg-amber-500 mb-6 hidden md:block"></div>
                <p className="text-white/70 text-sm leading-relaxed text-center md:text-left max-w-xs mx-auto md:mx-0 mb-6">
                  Premium fuel delivery service for executives and businesses who value time and convenience. Experience the luxury of time saved.
                </p>
              </div>
              
              {/* Social media icons - centered on mobile, left aligned on desktop */}
              <div className="flex space-x-4 justify-center md:justify-start mt-4 mb-8 md:mb-0">
                <a 
                  href="https://www.facebook.com/needtofuel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all transform hover:-translate-y-1"
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-white/70 hover:text-amber-500" />
                </a>
                <a 
                  href="https://www.instagram.com/needtofuel_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all transform hover:-translate-y-1"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-white/70 hover:text-amber-500" />
                </a>
                <a 
                  href="https://www.tiktok.com/@needtofuel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all transform hover:-translate-y-1"
                >
                  <FontAwesomeIcon icon={faTiktok} className="text-white/70 hover:text-amber-500" />
                </a>
              </div>
            </div>
            
            {/* Contact info - 3 columns on desktop, stack on mobile */}
            <div className="md:col-span-3 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:mx-auto md:after:mx-0 after:w-16 after:h-0.5 after:bg-amber-500/50 pb-2">
                Contact Us
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-x-3 items-start justify-center md:justify-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 flex items-start justify-center text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">97 Sun valley place<br />Oakdene, Johannesburg<br />2190 - South Africa</p>
                  </div>
                </div>
                
                <div className="flex gap-x-3 items-center justify-center md:justify-start">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <a href="tel:+27712204794" className="text-white/80 text-sm hover:text-amber-400 transition-colors">+27 71 220 4794</a>
                  </div>
                </div>
                
                <div className="flex gap-x-3 items-center justify-center md:justify-start">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <a href="mailto:support@needtofuel.com" className="text-white/80 text-sm hover:text-amber-400 transition-colors">support@needtofuel.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hours */}
            <div className="md:col-span-3 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:mx-auto md:after:mx-0 after:w-16 after:h-0.5 after:bg-amber-500/50 pb-2">
                Business Hours
              </h3>
              
              <div className="space-y-4 max-w-[200px] mx-auto md:mx-0">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="text-white">08:00 - 23:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="text-white">08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-white">Closed</span>
                </div>
              </div>
            </div>
            
            {/* Quick links - 2 columns on desktop, centered on mobile */}
            <div className="md:col-span-2 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:mx-auto md:after:mx-0 after:w-16 after:h-0.5 after:bg-amber-500/50 pb-2">
                Quick Links
              </h3>
              
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-amber-400 text-sm transition-colors">Home</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-amber-400 text-sm transition-colors">Services</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-amber-400 text-sm transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-amber-400 text-sm transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-amber-400 text-sm transition-colors">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Footer bottom - Full responsive handling */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm mb-6 md:mb-0">&#169; 2025 Need To Fuel. All rights reserved.</p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-center">
                <p 
                  onClick={() => setIsOpen(true)} 
                  className="text-white/60 text-sm hover:text-amber-400 cursor-pointer transition-colors"
                >
                  Terms & Conditions
                </p>
                <p 
                  onClick={() => setIsOpen(true)} 
                  className="text-white/60 text-sm hover:text-amber-400 cursor-pointer transition-colors"
                >
                  Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TermsModal/>
      
      {/* WhatsApp Support Bubble */}
      <a 
        href="https://wa.me/27712204794" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 z-50 hover:scale-110"
        aria-label="Contact support via WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </a>
    </ReactLenis>
  );
};

export default Hero_;
