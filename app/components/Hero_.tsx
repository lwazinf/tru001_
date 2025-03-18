"use client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
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
import { db } from "../../lib/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  increment,
  getDoc,
} from "firebase/firestore";
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

  // Track active section for navigation highlighting
  const [activeSection, setActiveSection] = useState("hero_section");

  // Track whether the user is currently scrolling
  const [isScrolling, setIsScrolling] = useState(false);

  // State for newsletter subscription form
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  // Handle newsletter subscription
  const handleSubscription = async () => {
    if (emailValue.trim() === "") return;

    try {
      // Check if user already exists in users collection
      const userEmail = emailValue.trim().toLowerCase();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const isMember = !querySnapshot.empty;

      // Save to subscriptions collection
      await addDoc(collection(db, "subscriptions"), {
        email: userEmail,
        date: serverTimestamp(),
        isMember: isMember,
      });

      console.log(
        `Subscription saved to Firestore. Member status: ${isMember}`
      );

      // Update UI state
      setIsSubscribed(true);

      // Reset the form after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmailValue("");
      }, 3000);
    } catch (error) {
      console.error("Error saving subscription: ", error);
    }
  };

  useEffect(() => {
    // Track visitor stats
    const trackVisitorStats = async () => {
      try {
        // Check if this visitor has been tracked before
        const visitorId = localStorage.getItem('ntf_visitor_id') || crypto.randomUUID();
        const isReturning = !!localStorage.getItem('ntf_visitor_id');
        
        // Save/update the visitor ID
        if (!isReturning) {
          localStorage.setItem('ntf_visitor_id', visitorId);
        }
        
        // Record session start time
        const sessionStartTime = new Date().getTime();
        localStorage.setItem('ntf_session_start', sessionStartTime.toString());
        
        // Get visitor IP and geolocation info via server API
        const response = await fetch('/api/visitor-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const { ipAddress, country, city, region } = await response.json();
          
          // Reference to this specific visitor's document
          const visitorRef = doc(db, "visitors", visitorId);
          const visitorSnap = await getDoc(visitorRef);
          
          // Create a session document to track this visit
          const sessionRef = await addDoc(collection(db, "sessions"), {
            visitorId: visitorId,
            startTime: serverTimestamp(),
            isActive: true,
            ipAddress,
            country,
            city,
            region,
            userAgent: navigator.userAgent,
            pathname: window.location.pathname
          });
          
          // Store session ID for later updates
          localStorage.setItem('ntf_current_session', sessionRef.id);
          
          // Add to stats collection
          await addDoc(collection(db, "stats"), {
            visitorId: visitorId,
            timestamp: serverTimestamp(),
            isNewVisitor: !isReturning,
            ipAddress,
            country,
            city,
            region,
            userAgent: navigator.userAgent,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            language: navigator.language,
            referrer: document.referrer || 'direct',
            pathname: window.location.pathname
          });
          
          // Update or create visitor document
          if (visitorSnap.exists()) {
            // Existing visitor - update stats
            await setDoc(visitorRef, {
              lastVisit: serverTimestamp(),
              visitCount: increment(1),
              ipAddress, // Update in case it changed
              country,   // Update location data
              lastUserAgent: navigator.userAgent
            }, { merge: true });
          } else {
            // New visitor - create record
            await setDoc(visitorRef, {
              firstVisit: serverTimestamp(),
              lastVisit: serverTimestamp(),
              visitCount: 1,
              ipAddress,
              country,
              city,
              region,
              userAgent: navigator.userAgent
            });
          }
        }
      } catch (error) {
        console.error("Error tracking visitor stats:", error);
      }
    };
    
    // Function to end the session and record duration
    const endSession = async () => {
      try {
        const sessionId = localStorage.getItem('ntf_current_session');
        const sessionStartTime = localStorage.getItem('ntf_session_start');
        
        if (sessionId && sessionStartTime) {
          const startTime = parseInt(sessionStartTime);
          const endTime = new Date().getTime();
          const durationMs = endTime - startTime;
          const durationSeconds = Math.round(durationMs / 1000);
          
          // Update the session with end time and duration
          const sessionRef = doc(db, "sessions", sessionId);
          await setDoc(sessionRef, {
            endTime: serverTimestamp(),
            isActive: false,
            durationSeconds: durationSeconds,
            durationFormatted: formatDuration(durationSeconds)
          }, { merge: true });
          
          // Clear the session data
          localStorage.removeItem('ntf_current_session');
          localStorage.removeItem('ntf_session_start');
        }
      } catch (error) {
        console.error("Error ending session:", error);
      }
    };
    
    // Helper function to format duration
    const formatDuration = (seconds: any) => {
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    };
    
    // Set up beforeunload event to track when users leave
    const handleBeforeUnload = () => {
      endSession();
    };
    
    // Call tracking function to initialize
    trackVisitorStats();
    
    // Add event listener for when the user leaves
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Also track session heartbeats every minute to handle cases
    // where beforeunload doesn't fire (browser crashes, etc.)
    const heartbeatInterval = setInterval(() => {
      // Update the active session with a heartbeat
      const updateSessionHeartbeat = async () => {
        try {
          const sessionId = localStorage.getItem('ntf_current_session');
          if (sessionId) {
            const sessionStartTime = localStorage.getItem('ntf_session_start');
            if (sessionStartTime) {
              const startTime = parseInt(sessionStartTime);
              const currentTime = new Date().getTime();
              const durationMs = currentTime - startTime;
              const durationSeconds = Math.round(durationMs / 1000);
              
              // Update the session with the current duration
              const sessionRef = doc(db, "sessions", sessionId);
              await setDoc(sessionRef, {
                lastHeartbeat: serverTimestamp(),
                currentDurationSeconds: durationSeconds
              }, { merge: true });
            }
          }
        } catch (error) {
          console.error("Error updating session heartbeat:", error);
        }
      };
      
      updateSessionHeartbeat();
    }, 60000); // Update every minute
    
    const timer = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 5000);

    // Add scroll event listener to update active section
    const handleScroll = () => {
      // Don't update the active section if the user is actively scrolling via a button
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 100; // Offset for better accuracy

      // Get all section positions
      const sections = [
        {
          id: "hero_section",
          position: document.getElementById("hero_section")?.offsetTop || 0,
        },
        {
          id: "services_section",
          position: document.getElementById("services_section")?.offsetTop || 0,
        },
        {
          id: "case_studies_section",
          position:
            document.getElementById("case_studies_section")?.offsetTop || 0,
        },
        {
          id: "pricing_section",
          position: document.getElementById("pricing_section")?.offsetTop || 0,
        },
        {
          id: "faq_section",
          position: document.getElementById("faq_section")?.offsetTop || 0,
        },
        {
          id: "contact_section",
          position: document.getElementById("contact_section")?.offsetTop || 0,
        },
      ];

      // Sort by position to handle potential overlaps
      const sortedSections = [...sections].sort(
        (a, b) => b.position - a.position
      );

      // Find the current section
      const currentSection = sortedSections.find(
        (section) => scrollPosition >= section.position
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);

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
        y: -50,
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

    // Clean up event listeners and intervals
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(heartbeatInterval);
      clearInterval(timer);
      // Call endSession when component unmounts
      endSession();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      animations.forEach((animation) => animation.kill());
    };
  }, [isScrolling]);

  // Function to smoothly scroll to a section
  const smoothScrollTo = (sectionId: string) => {
    // Set scrolling state to prevent active section updates during programmatic scrolling
    setIsScrolling(true);

    if (sectionId === "top" || sectionId === "hero_section") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("hero_section");
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -70; // Adjust for header height
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        setActiveSection(sectionId);
      }
    }

    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Approximate duration of smooth scroll
  };

  return (
    <div>
      {/* Main content */}
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
          <div className="first-section-logo text-[200px] w-full h-full flex flex-col justify-center items-center absolute font-black text-white pointer-events-none z-[1]">
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[650px] w-full opacity-[.99] pointer-events-none xl:rotate-3 xl:absolute hidden left-0">
              <img
                src="/assets/mockups/profile.png"
                className={`${
                  isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[200ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain xl:ml-[450px]`}
              />
            </div>
            <div className="first-section-text xl:flex flex-row justify-center items-center h-[650px] w-full opacity-[.99] pointer-events-none xl:rotate-6 xl:absolute hidden left-0">
              <img
                src="/assets/mockups/orders.png"
                className={`${
                  !isVisible
                    ? "opacity-0 duration-[1000ms]"
                    : "opacity-100 duration-[200ms]"
                } xl:opacity-100 floating-image animate-float transition-all w-full h-full object-contain xl:ml-[900px]`}
              />
            </div>
            <div className="mr-[0px] xl:bottom-[250px] w-[650px] xl:h-[650px] h-[350px] flex flex-col justify-center items-center xl:scale-[1] xl:hidden absolute pointer-events-none z-[4]">
              <div className="flex flex-row items-center mb-6">
                <img
                  src="/assets/images/white_logo.png"
                  alt="Need To Fuel"
                  className="h-28 mr-5 object-contain"
                />
                <h2 className="text-white text-2xl font-semibold">
                  Need To Fuel
                </h2>
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
                className={`xl:flex hidden text-[25px] font-black lobster text-white/80 gabarito w-[350px]`}
              >
                Your one stop mobile shop for all your vehicles needs.
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
                      onClick={() => router.push("/auth")}
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
                ${isVisible ? "visible" : ""}
                animate-float
                w-[250px]
                sm:w-[300px]
                md:w-[340px]
                object-contain
                z-10
              `}
              style={{
                transitionProperty: "all",
                transitionDuration: "1000ms",
              }}
            />
            <img
              src="/assets/mockups/orders.png"
              alt="Need To Fuel mobile app orders screen"
              className={`
                absolute
                floating-image
                ${!isVisible ? "visible" : ""}
                animate-float
                w-[250px]
                sm:w-[300px]
                md:w-[340px]
                object-contain
                z-10
              `}
              style={{
                transitionProperty: "all",
                transitionDuration: "1000ms",
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
              asset. That&apos;s why we&apos;ve crafted a suite of bespoke
              services—mobile refueling, vehicle valet, tyre inspections, and
              roadside assistance—designed to offer you unparalleled convenience
              and peace of mind, all at the touch of a button.
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
                  alert("iOS app coming soon!");
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
              "https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/WhatsApp%20Image%202025-02-24%20at%2012.44.01.jpeg?alt=media&token=e2987821-bd17-41e2-b757-244e05697273",
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
            you to focus on what truly matters—whether it&apos;s your business,
            your passions, or your loved ones. Because for those who demand
            excellence, time should never be a compromise.
          </p>
        </div>
      </section>

      {/* Case Studies Section - Refreshed Design */}
      <section
        id="case_studies_section"
        className="w-full py-24 bg-gradient-to-b from-black via-amber-950/10 to-gray-900 relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/assets/images/main_logo.png')] bg-repeat opacity-[0.02] bg-[length:300px_300px]"></div>

        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(217,119,6,0.05) 40%, rgba(0,0,0,0) 70%)",
            }}
          ></div>
        </div>

        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-500/40 animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-amber-500/30 animate-float-medium"></div>
          <div className="absolute top-2/3 left-1/2 w-2 h-2 rounded-full bg-amber-500/50 animate-float-fast"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-amber-400/60 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header with amber accent */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative inline-block">
              Success Stories
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/70 to-amber-500/0"></div>
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              Discover how our premium mobile fuel delivery service is
              transforming operations, saving time, and creating value for our
              clients.
            </p>
          </div>

          {/* Featured Success Stories Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main featured story - left side (5 columns) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-black/80 to-amber-950/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 h-full group">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/5980746/pexels-photo-5980746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Executive checking schedule while mobile fuel service fills car"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-3 group-hover:bg-amber-500/30 transition-all duration-500">
                        <img
                          src="/assets/images/white_logo.png"
                          alt="Need To Fuel"
                          className="w-5 h-5"
                        />
                      </div>
                      <span className="text-white/90 font-medium">
                        Need To Fuel
                      </span>
                      <span className="mx-2 text-white/40">•</span>
                      <span className="text-white/60 text-sm">
                        Executive Success
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                    &ldquo;I reclaimed 5+ hours of productive time every
                    week&rdquo; — CEO testimonial
                  </h3>

                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    John Mitchell, CEO of Evergreen Financial Group, shares how
                    Need To Fuel&apos;s premium services transformed his
                    schedule, creating more time for strategic work and family,
                    while eliminating weekly fuel station visits.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-amber-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/50 text-xs flex items-center group-hover:text-amber-400 transition-colors">
                      Read Full Story
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side articles (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top story */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-2/5">
                    <div className="relative h-48 sm:h-full overflow-hidden">
                      <img
                        src="https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg"
                        alt="Corporate office building with Need To Fuel truck"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent sm:bg-gradient-to-t"></div>
                    </div>
                  </div>
                  <div className="sm:w-3/5 p-5">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2">
                        <img
                          src="/assets/images/white_logo.png"
                          alt="Need To Fuel"
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-white/80 text-sm font-medium">
                        Need To Fuel
                      </span>
                      <span className="mx-2 text-white/40">•</span>
                      <span className="text-white/50 text-xs">1 hour ago</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      Corporate client reduces fleet costs by 15% with scheduled
                      delivery program
                    </h3>

                    <p className="text-white/60 text-sm mb-3 line-clamp-2">
                      A leading logistics company eliminated fuel station trips
                      for their entire fleet, reducing idle time and optimizing
                      operations.
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        Business
                      </span>
                      <span className="text-white/50 text-xs">5 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row of smaller stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2">
                        <img
                          src="/assets/images/white_logo.png"
                          alt="Need To Fuel"
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-white/80 text-sm font-medium">
                        Need To Fuel
                      </span>
                      <span className="mx-2 text-white/40">•</span>
                      <span className="text-white/50 text-xs">2 hours ago</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      Luxury event company partners with Need To Fuel for VIP
                      services
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        Partners
                      </span>
                      <span className="text-white/50 text-xs">3 min read</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mr-2">
                        <img
                          src="/assets/images/white_logo.png"
                          alt="Need To Fuel"
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-white/80 text-sm font-medium">
                        Need To Fuel
                      </span>
                      <span className="mx-2 text-white/40">•</span>
                      <span className="text-white/50 text-xs">1 day ago</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      Need To Fuel maintains service during extreme weather,
                      ensuring business continuity
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                        Service
                      </span>
                      <span className="text-white/50 text-xs">4 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View All Stories Button */}
          <div className="text-center mt-12">
            <button className="bg-white/5 backdrop-blur-sm hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center mx-auto group">
              <span className="group-hover:text-amber-400 transition-colors">
                View All Success Stories
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 text-amber-500 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section
        id="pricing_section"
        className="third-section w-full min-h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden"
      >
        <Pricing_ />
      </section>

      <section
        id="faq_section"
        className="w-full py-24 bg-gradient-to-b from-black via-amber-950/10 to-black relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/assets/images/main_logo.png')] bg-repeat opacity-[0.015] bg-[length:200px_200px]"></div>

        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(217,119,6,0.12) 0%, rgba(217,119,6,0.04) 40%, rgba(0,0,0,0) 70%)",
            }}
          ></div>
        </div>

        {/* Ambient particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber-500/40 animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-amber-500/30 animate-float-medium"></div>
          <div className="absolute top-2/3 left-1/2 w-2 h-2 rounded-full bg-amber-500/50 animate-float-fast"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-amber-400/60 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative inline-block">
              Frequently Asked Questions
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"></div>
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              Here are the most asked questions about our mobile fuel delivery
              service. If you can&apos;t find what you&apos;re looking for,
              please contact our support team.
            </p>
          </div>

          {/* FAQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                What is Need to Fuel?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Need to Fuel is a premium mobile fuel delivery and royal valet
                car wash service. We bring fuel directly to your vehicle, saving
                you time and hassle from having to visit a fuel station.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                How does the fuel delivery service work?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                It&apos;s simple! You place an order through our website or app.
                We then deliver the fuel to your vehicle at your chosen
                location, whether at home, work, or anywhere else within our
                service area. No need to be present during delivery.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Is the fuel you deliver high quality?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We source our fuel directly from reputable suppliers, ensuring
                top-quality Diesel 50ppm and Unleaded 95 for your vehicle. Our
                fuel meets all South African regulatory standards and is
                regularly tested to ensure quality and purity.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                What type of fuel do you deliver?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We deliver Diesel 50ppm and Unleaded 95 to your vehicle. Both
                fuel types are sourced from major refineries and meet the
                highest quality standards, ensuring optimal performance for your
                vehicle.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                What does the service cost?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We offer subscription packages starting at R3000 and R5000 per
                month. These packages include regular scheduled deliveries based
                on your needs. Individual pricing for one-time refuels may vary
                based on current fuel rates and your delivery location.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-500 group-hover:bg-amber-500/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Is mobile refueling safe?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Absolutely. Our service adheres to all safety regulations and is
                performed by certified technicians. Our vehicles are equipped
                with specialized fuel delivery systems, spill containment
                equipment, and all necessary permits and certifications to
                ensure a safe refueling process.
              </p>
            </div>
          </div>

          {/* Additional Questions Link */}
          <div className="text-center mt-10">
            <div className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer">
              <p className="text-white/80 text-sm group-hover:text-white transition-colors mr-2">
                Have more questions about our services?
              </p>
              <a
                href="mailto:support@needtofuel.com"
                className="text-amber-500 text-sm font-medium group-hover:text-amber-400 transition-colors flex items-center"
              >
                Email us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact_section"
        className="footer-section relative bg-gradient-to-b from-black to-gray-900 pt-24 pb-12"
      >
        {/* Enhanced diagonal gradient top border with animation */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500/0 via-amber-500/80 to-amber-500/0">
          <div className="absolute top-0 left-0 right-0 h-full bg-white/20 animate-shimmer"></div>
        </div>

        {/* Enhanced animated background particles */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-amber-500 animate-float-slow"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-amber-500/30 animate-float-medium"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-amber-500/50 animate-float-fast"></div>
          <div className="absolute top-1/2 right-1/2 w-1 h-1 rounded-full bg-amber-500/70 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-amber-500/20 animate-float-slow"></div>
          <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-amber-500/10 animate-float-medium"></div>
          <div className="absolute bottom-1/2 right-1/3 w-2 h-2 rounded-full bg-amber-500/30 animate-float-fast"></div>
        </div>

        {/* Enhanced background logo watermark with subtle rotation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
          <img
            src="/assets/images/white_logo.png"
            alt=""
            className="w-[900px] max-w-none animate-slow-spin"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Enhanced back to top button with improved animation */}
          <div
            onClick={() => smoothScrollTo("hero_section")}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 group overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                smoothScrollTo("hero_section");
              }
            }}
            aria-label="Back to top"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 transform group-hover:-translate-y-1 transition-transform duration-300 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7H3"
              />
            </svg>
          </div>

          {/* Main footer content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 mb-16">
            {/* Company info - 4 columns on desktop, full width on mobile */}
            <div className="md:col-span-4">
              <div className="mb-8 flex flex-col items-center md:items-start">
                {/* Updated logo with company name on the right - increased size */}
                <div className="flex flex-row items-center mb-6">
                  <img
                    src="/assets/images/white_logo.png"
                    alt="Need To Fuel"
                    className="h-[150px] object-cover"
                  />
                  <h2 className="text-white text-2xl font-semibold">
                    Need To Fuel
                  </h2>
                </div>

                <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500/50 to-amber-500/0 mb-6 hidden md:block"></div>
                <p className="text-white/70 text-sm leading-relaxed text-center md:text-left max-w-xs mx-auto md:mx-0 mb-6">
                  Premium fuel delivery service for executives and businesses
                  who value time and convenience. Experience the luxury of time
                  saved.
                </p>
              </div>

              {/* Enhanced social media icons with improved hover effects */}
              <div className="flex space-x-4 justify-center md:justify-start mt-4 mb-8 md:mb-0">
                <a
                  href="https://www.facebook.com/needtofuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
                  aria-label="Follow us on Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="text-white/70 hover:text-amber-500 transition-colors"
                  />
                </a>
                <a
                  href="https://www.instagram.com/needtofuel_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
                  aria-label="Follow us on Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="text-white/70 hover:text-amber-500 transition-colors"
                  />
                </a>
                <a
                  href="https://www.tiktok.com/@needtofuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
                  aria-label="Follow us on TikTok"
                >
                  <FontAwesomeIcon
                    icon={faTiktok}
                    className="text-white/70 hover:text-amber-500 transition-colors"
                  />
                </a>
                <a
                  href="https://wa.me/27723127869"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
                  aria-label="Contact us on WhatsApp"
                >
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className="text-white/70 hover:text-amber-500 transition-colors"
                  />
                </a>
              </div>
            </div>

            {/* Contact info - 3 columns on desktop, stack on mobile */}
            <div className="sm:col-span-1 md:col-span-3 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                Contact Us
                <span className="absolute left-0 right-0 bottom-0 mx-auto md:mx-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/0 mt-2"></span>
              </h3>

              <div className="space-y-5">
                <div className="flex gap-x-3 items-start justify-center md:justify-start group">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 flex items-start justify-center text-amber-500 group-hover:text-amber-400 transition-colors transform group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="group-hover:text-white transition-colors">
                    <p className="text-white/80 text-sm">
                      {/* 97 Sun valley place
                      <br />
                      Oakdene, Johannesburg
                      <br />
                      2190 - South Africa */}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-3 items-center justify-center md:justify-start group">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-amber-500 group-hover:text-amber-400 transition-colors transform group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <a
                      href="tel:+27723127869"
                      className="text-white/80 text-sm hover:text-amber-400 transition-colors"
                    >
                      +27 72 312 7869
                    </a>
                  </div>
                </div>

                <div className="flex gap-x-3 items-center justify-center md:justify-start group">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-amber-500 group-hover:text-amber-400 transition-colors transform group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <a
                      href="mailto:support@needtofuel.com"
                      className="text-white/80 text-sm hover:text-amber-400 transition-colors"
                    >
                      support@needtofuel.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours with enhanced styling */}
            <div className="sm:col-span-1 md:col-span-3 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                Business Hours
                <span className="absolute left-0 right-0 bottom-0 mx-auto md:mx-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/0 mt-2"></span>
              </h3>

              <div className="space-y-4 max-w-[220px] mx-auto md:mx-0">
                <div className="flex justify-between items-center hover:bg-white/5 transition-colors p-2 rounded-lg group border border-transparent hover:border-white/5">
                  <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                    Monday - Saturday:
                  </span>
                  <span className="text-amber-500 font-medium text-sm">
                    7am - 7:30pm
                  </span>
                </div>
                <div className="flex justify-between items-center hover:bg-white/5 transition-colors p-2 rounded-lg group border border-transparent hover:border-white/5">
                  <span className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                    Sunday & Public:
                  </span>
                  <span className="text-amber-500 font-medium text-sm">
                    8am - 2pm
                  </span>
                </div>
              </div>
            </div>

            {/* Quick links with enhanced active state indicators */}
            <div className="sm:col-span-1 md:col-span-2 text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                Quick Links
                <span className="absolute left-0 right-0 bottom-0 mx-auto md:mx-0 w-20 h-0.5 bg-gradient-to-r from-amber-500 to-amber-500/0 mt-2"></span>
              </h3>

              <ul className="space-y-3 mb-6">
                <li>
                  <a
                    href="#hero_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("hero_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "hero_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "hero_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Home
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("services_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "services_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "services_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Services
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#case_studies_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("case_studies_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "case_studies_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "case_studies_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Success Stories
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("pricing_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "pricing_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "pricing_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Pricing
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("faq_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "faq_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "faq_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      FAQs
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/auth");
                    }}
                    className="text-white/80 hover:text-amber-400 text-sm transition-all flex items-center group"
                  >
                    <span className="w-0 h-[2px] bg-amber-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Sign In
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#contact_section"
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo("contact_section");
                    }}
                    className={`text-sm transition-all flex items-center group ${
                      activeSection === "contact_section"
                        ? "text-amber-500 font-medium"
                        : "text-white/80 hover:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-[2px] bg-amber-500 transition-all duration-300 rounded-full ${
                        activeSection === "contact_section"
                          ? "w-3 mr-2"
                          : "w-0 mr-0 group-hover:w-2 group-hover:mr-2"
                      }`}
                    ></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      Contact
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Enhanced newsletter subscription form */}
          <div className="bg-gradient-to-r from-black/50 to-amber-950/10 p-8 rounded-xl mb-10 backdrop-blur-sm border border-white/5 shadow-lg transform hover:shadow-amber-500/5 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-2 text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  Join Our Newsletter
                </h4>
                <p className="text-white/60 text-sm">
                  Stay updated with our latest offers, services, and fuel tips.
                  We promise not to spam your inbox!
                </p>
              </div>
              <div className="md:col-span-5">
                {isSubscribed ? (
                  <div className="h-full flex items-center justify-center text-amber-400 font-medium animate-fade-in">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Thanks for subscribing!</span>
                    </div>
                  </div>
                ) : (
                  <form
                    className="flex flex-col sm:flex-row gap-3 animate-fade-in"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubscription();
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex-grow"
                      required
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                    />
                    <div
                      onClick={handleSubscription}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium rounded-full px-5 py-2 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center select-none shadow-md hover:shadow-amber-500/20"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSubscription();
                        }
                      }}
                      aria-label="Subscribe to newsletter"
                    >
                      <span className="mr-1">Subscribe</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced footer bottom with better responsive layout */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-8 h-8 mr-2 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-white/80 text-xs">©</span>
                </div>
                <p className="text-white/60 text-sm">
                  2025 Need To Fuel. All rights reserved.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <div
                  onClick={() => setIsOpen(true)}
                  className="text-white/60 text-sm hover:text-amber-400 cursor-pointer transition-colors flex items-center group"
                >
                  <span className="h-[1px] w-0 bg-amber-500 mr-0 group-hover:w-2 group-hover:mr-1 transition-all"></span>
                  Terms & Conditions
                </div>
                <div
                  onClick={() => setIsOpen(true)}
                  className="text-white/60 text-sm hover:text-amber-400 cursor-pointer transition-colors flex items-center group"
                >
                  <span className="h-[1px] w-0 bg-amber-500 mr-0 group-hover:w-2 group-hover:mr-1 transition-all"></span>
                  Privacy Policy
                </div>
                <a
                  href="https://www.needtofuel.com/careers"
                  className="text-white/60 text-sm hover:text-amber-400 cursor-pointer transition-colors flex items-center group"
                >
                  <span className="h-[1px] w-0 bg-amber-500 mr-0 group-hover:w-2 group-hover:mr-1 transition-all"></span>
                  Careers
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TermsModal />

      {/* Enhanced WhatsApp Support Bubble with better visual effects */}
      <a
        href="https://wa.me/27723127869"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-green-500/30 transition-all duration-300 z-50 hover:scale-110 group"
        aria-label="Contact support via WhatsApp"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl relative z-10" />
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </a>

      {/* Add enhanced animation styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes slow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-slow-spin {
          animation: slow-spin 240s linear infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Hero_;
