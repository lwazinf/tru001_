"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import Pricing_ from "./helpers/pricing";
import Marquee from "./Marquee";
import { motion } from "framer-motion";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import TermsModal from "./helpers/termsModal";
import { PolicyState } from "./atoms/atoms";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface CardElement extends HTMLElement {
  style: CSSStyleDeclaration;
}

const Hero_ = () => {
  const searchParams = useSearchParams();
  const firstSectionRef = useRef(null);
  const thirdSectionRef = useRef(null);
  const mainImgRef = useRef(null);
  const heroImgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [, setPolicy] = useAtom(PolicyState);

  useEffect(() => {
    const path = searchParams.get('path');
    
    switch (path) {
      case 'privacy':
        setPolicy({ isOpen: true, section: 'privacy' });
        break;
      case 'terms':
        setPolicy({ isOpen: true, section: 'terms' });
        break;
    }
  }, [searchParams, setPolicy]);

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

    // Logo and content animations
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

    // Last section zoom
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

  const handleTermsClick = () => {
    window.history.pushState({}, '', '/?path=terms');
    setPolicy({ isOpen: true, section: 'terms' });
  };

  const handlePrivacyClick = () => {
    window.history.pushState({}, '', '/?path=privacy');
    setPolicy({ isOpen: true, section: 'privacy' });
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
                      className={`min-w-8 h-8 px-4 text-[12px] text-white bg-orange-600 font-semibold flex flex-col justify-center items-center rounded-[20px]`}
                    >
                      {obj_}
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
        <div
          className={`flex flex-col justify-center items-center w-full min-h-2 text-white text-center`}
        >
          <img
            src="/assets/mockups/profile.png"
            alt=""
            className={`${
              isVisible
                ? "opacity-0 duration-[1000ms]"
                : "opacity-100 duration-[200ms]"
            } xl:opacity-100 floating-image animate-float transition-all h-[450px] object-contain scale-[0.5]`}
          />
          <img
            src="/assets/mockups/orders.png"
            alt=""
            className={`${
              !isVisible
                ? "opacity-0 duration-[1000ms]"
                : "opacity-100 duration-[200ms]"
            } xl:opacity-100 floating-image animate-float transition-all h-[450px] object-contain scale-[0.5] absolute top-4`}
          />
          <div
            className={`flex flex-col justify-center items-center w-full min-h-2 text-white text-center`}
          >
            <div className={`tinos-regular text-white/80 text-[13px] p-8`}>
              At Need To Fuel, we understand that time is your most valuable
              asset. That&apos;s why we&apos;ve crafted a suite of bespoke services—mobile
              refueling, vehicle valet, tyre inspections, and roadside
              assistance—designed to offer you unparalleled convenience and
              peace of mind, all at the touch of a button.</div>
            <img
              onClick={() => {
                window.open(
                  "https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30"
                );
              }}
              className={`my-1 scale-[0.7]`}
              src={`/assets/icons/PlayStore.png`}
            />
            <img
              className={`my-1 scale-[0.7] opacity-20`}
              src={`/assets/icons/AppStore.png`}
            />
          </div>
        </div>
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
              className="max-w-4xl mx-auto p-12 relative bottom-[150px]"
            >
              <div className="relative px-8">
                <span className="absolute -top-8 -left-4 text-yellow-400 text-6xl font-serif">
                  ❝
                </span>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-4xl md:text-5xl lg:text-6xl font-light tracking-wide leading-tight text-white lobster mb-8"
                >
                  I can buy anything I want, basically, but I can&apos;t buy
                  time
                </motion.p>

                <span className="absolute -bottom-8 -right-4 text-yellow-400 text-6xl font-serif">
                  ❞
                </span>

                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-12 h-0.5 bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-12 h-0.5 bg-yellow-400"></div>
                </div>

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
            you to focus on what truly matters—whether it&apos;s your business, your
            passions, or your loved ones. Because for those who demand
            excellence, time should never be a compromise.
          </p>
        </div>
      </section>

      <section className={`xl:hidden flex`}>
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

      <section className={`min-h-screen xl:scale-[1] scale-[1]`}>
        <Pricing_ />
      </section>

      <section className="footer text-[14px] text-white relative flex flex-col xl:justify-end justify-center items-center pb-8 xl:mt-[150px]">
        <div className={`pointer-events-none`}>
          <img
            className={`absolute xl:bottom-[-200px] w-[600px] opacity-5`}
            src="/assets/images/white_logo.png"
          />
        </div>
        <div
          className={`flex flex-row xl:justify-evenly justify-center items-center mb-8 w-full min-h-2`}
        >
          <div className={`flec flex-col relative right-[55px]`}>
            <p className={``}>97 Sun valley place</p>
            <p className={``}>Oakdene, Johannesburg</p>
            <p className={`mb-4`}>2190 - South Africa</p>

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
            <a
              href={"https://www.facebook.com/needtofuel"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faFacebook}
                className={`text-[18px] mx-4 cursor-pointer xl:mr-0 mr-4`}
              />
            </a>
            <a
              href={"https://www.linkedin.com/needtofuel"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faLinkedinIn}
                className={`text-[18px] mx-4 cursor-pointer xl:mr-0 mr-4`}
              />
            </a>
            <a
              href={"https://www.instagram.com/needtofuel_"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faInstagram}
                className={`text-[18px] mx-4 cursor-pointer xl:mr-0 mr-4`}
              />
            </a>
            <a
              href={"https://www.tiktok.com/@needtofuel"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={faTiktok}
                className={`text-[18px] mx-4 cursor-pointer`}
              />
            </a>
          </div>
          <div
            className={`min-w-2 min-h-2 flex flex-row justify-center items-center`}
          >
            <p
              onClick={handleTermsClick}
              className={`mx-2 cursor-pointer`}
            >
              Terms & Conditions
            </p>
            <p
              onClick={handlePrivacyClick}
              className={`mx-2 cursor-pointer`}
            >
              Privacy Policy
            </p>
          </div>
        </div>
      </section>
      <TermsModal />
    </ReactLenis>
  );
};

export default Hero_;