import { faArrowRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Pricing_ = () => {
  const y = useMotionValue(0);
  const yRange = useTransform(y, [0, 2.5], [0, 100]);

  return (
    <div
      className={`w-full xl:h-[90vh] min-h-screen flex flex-col justify-center items-center top_fade`}
    >
      <div
        className={`w-full min-h-2 flex flex-col mt-[30px] mb-[60px] justify-center items-center`}
      >
        <p
          className={`text-white text-[50px] tinos-regular-italic text-center font-black`}
        >
          Exclusive Offers
        </p>
      </div>
      <motion.div
        className={`flex xl:flex-row flex-col justify-center items-center w-full min-h-2 mb-2`}
        style={{ y: yRange }}
        // onMouseMove={(e) => y.set(e.clientY / window.innerHeight)}
      >
        <motion.div
          className={`h-[475px] w-[350px] m-2 rounded-[5px] flex flex-col justify-start items-center bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-200 relative overflow-hidden border-[1px] border-black/5`}
          style={{ y: yRange }}
        >
          <div className={`h-[10px]`}></div>
          <div className={`flex flex-row justify-between items-center w-full`}>
            <div
              className={`h-[100px] w-full tinos-regular-italic mb-[-20px] flex flex-col justify-center items-start px-4 text-black text-[20px] font-bold`}
            >
              Gold
            </div>
            <div
              className={`text-black/80 px-4 text-[13px] font-bold w-[250px] tinos-regular-italic relative top-[13px]`}
            >
              R2,999.99{" "}
              <span className={`text-black/80 font-medium`}>/month</span>
            </div>
          </div>
          <div className={`h-[300px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-black/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-col justify-center items-center relative`}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut", // Ensure this is a valid easing function or use `easeInOut` from Framer Motion's predefined easings
                }}
                className={`flex flex-col justify-center items-center p-4 opacity-[0.1]`}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                onClick={() => {}}
              >
                <img
                  src={`/assets/images/main_logo.png`}
                  className={`w-[200px] object-cover relative`}
                />
              </motion.div>
              <div className={`w-full h-full absolute p-1`}>
                <div
                  className={`h-full w-full flex flex-col items-start justify-start pl-4 pt-8`}
                >
                  {[
                    {
                      feature: "2 vehicles registered",
                      status: true,
                    },
                    {
                      feature: "4 Royal Valet washes",
                      status: true,
                    },
                    {
                      feature: "On-demand & scheduled fuel delivery",
                      status: true,
                    },
                    {
                      feature: "Interior steam clean & detailing",
                      status: true,
                    },
                    {
                      feature: "Full exterior high pressure foam wash",
                      status: true,
                    },
                  ].map((obj_, idx_) => {
                    return (
                      <div
                        className={`flex flex-row justify-start items-center w-full min-h-2 mb-1 tinos-regular`}
                        key={idx_}
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={`mx-1 mr-2 text-[12px]`}
                        />
                        <p className={`text-[13px]`}>{obj_.feature}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-full h-full overflow-y-auto absolute">
                <div className="p-8">
                  <div className="max-w-3xl space-y-8"></div>
                </div>
              </div>
            </div>
          </div>
          <div className={`h-[75px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-black/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-row justify-between items-center`}
            >
              <div
                className={`text-black/80 px-4 text-[13px] font-bold tinos-regular-italic`}
              >
                Limited to 50 members
              </div>
              <div
                className={`min-w-[100px] h-[30px] mr-4 bg-black rounded-[15px] flex flex-row justify-center items-center cursor-pointer`}
              >
                <div
                  className={`min-w-[100px] h-[30px] scale-[0.3] opacity-50 absolute hover:animate-ping bg-whit rounded-[15px] flex flex-row justify-center items-center cursor-pointer z-[0]`}
                />
                <p
                  className={`text-white/80 font-medium text-[12px] pointer-events-none z-[1] tinos-regular-italic`}
                >
                  Start Now
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={`text-white/80 ml-2 text-[12px] pointer-events-none z-[1]`}
                />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className={`h-[475px] w-[360px] m-2 rounded-[5px] flex flex-col justify-start items-center bg-[#131313] relative overflow-hidden`}
          style={{ y: yRange }}
        >
          <div className={`h-[10px]`}></div>
          <div className={`flex flex-row justify-between items-center w-full`}>
            <div
              className={`h-[100px] tinos-regular-italic w-full mb-[-20px] flex flex-col justify-center items-start px-6 text-white/50 text-[20px] font-bold`}
            >
              Black
            </div>
            <div
              className={`text-white/50 tinos-regular-italic px-6 text-[13px] font-bold w-[250px] relative top-[13px]`}
            >
              R4,999.99{" "}
              <span className={`text-white/20 font-medium`}>/month</span>
            </div>
          </div>
          <div className={`h-[300px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-white/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-col justify-center items-center relative`}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut", // Ensure this is a valid easing function or use `easeInOut` from Framer Motion's predefined easings
                }}
                className={`flex flex-col justify-center items-center p-4 opacity-[0.1]`}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                onClick={() => {}}
              >
                <img
                  src={`/assets/images/main_logo.png`}
                  className={`w-[200px] object-cover relative`}
                />
              </motion.div>
              <div className={`w-full h-full absolute p-1`}>
                <div
                  className={`h-full w-full flex flex-col items-start justify-start pl-4 pt-8`}
                >
                  {[
                    {
                      feature: "4 vehicles registered",
                      status: true,
                    },
                    {
                      feature: "8 Royal Valet washes",
                      status: true,
                    },
                    {
                      feature: "On-demand & scheduled fuel delivery",
                      status: true,
                    },
                    {
                      feature: "Interior steam clean & detailing",
                      status: true,
                    },
                    {
                      feature: "Full exterior high pressure foam wash",
                      status: true,
                    },
                  ].map((obj_, idx_) => {
                    return (
                      <div
                        className={`flex flex-row justify-start items-center w-full tinos-regular min-h-2 mb-1 text-white`}
                        key={idx_}
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={`mx-1 mr-2 text-[12px]`}
                        />
                        <p className={`text-[13px]`}>{obj_.feature}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={`h-[75px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-white/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-row justify-between items-center`}
            >
              <div
                className={`text-white/50 px-6 text-[13px] tinos-regular-italic font-bold`}
              >
                Limited to 50 members
              </div>
              <div
                className={`min-w-[100px] h-[30px] mr-6 bg-orange-600 rounded-[15px] flex flex-row justify-center items-center cursor-pointer`}
              >
                <div
                  className={`min-w-[100px] h-[30px] scale-[0.3] opacity-50 absolute hover:animate-ping bg-orange-600 rounded-[15px] flex flex-row justify-center items-center cursor-pointer z-[0]`}
                />
                <p
                  className={`text-white/80 font-medium text-[12px] tinos-regular-italic z-[1] pointer-events-none`}
                >
                  Start Now
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={`text-white/80 ml-2 text-[12px] z-[1] pointer-events-none`}
                />
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className={`h-[475px] w-[360px] m-2 rounded-[5px] flex flex-col justify-start items-center bg-[#7C0A01] relative overflow-hidden`}
          style={{ y: yRange }}
        >
          <div className={`h-[10px]`}></div>
          <div className={`flex flex-row justify-between items-center w-full`}>
            <div
              className={`h-[100px] w-full mb-[-20px] flex tinos-regular-italic flex-col justify-center items-start px-6 text-white/50 text-[20px] font-bold`}
            >
              CEO
            </div>
            <div
              className={`text-white/50 px-6 tinos-regular-italic text-[13px] font-bold w-[250px] relative top-[13px]`}
            >
              R4,999.99{" "}
              <span className={`text-white/20 font-medium`}>/month</span>
            </div>
          </div>
          <div className={`h-[300px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-white/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-col justify-center items-center relative`}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -1, 0] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut", // Ensure this is a valid easing function or use `easeInOut` from Framer Motion's predefined easings
                }}
                className={`flex flex-col justify-center items-center p-4 opacity-[0.1]`}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                onClick={() => {}}
              >
                <img
                  src={`/assets/images/main_logo.png`}
                  className={`w-[200px] object-cover relative`}
                />
              </motion.div>
              <div className={`w-full h-full absolute p-1`}>
                <div
                  className={`h-full w-full flex flex-col items-start justify-start pl-4 pt-8`}
                >
                  {[
                    {
                      feature: "4 vehicles registered",
                      status: true,
                    },
                    {
                      feature: "8 Royal Valet washes (R3,600 value/month)",
                      status: true,
                    },
                    {
                      feature: "On-demand & scheduled fuel delivery",
                      status: true,
                    },
                    {
                      feature: "Interior steam clean & detailing",
                      status: true,
                    },
                    {
                      feature: "Full exterior high pressure foam wash",
                      status: true,
                    },
                  ].map((obj_, idx_) => {
                    return (
                      <div
                        className={`flex flex-row justify-start tinos-regular items-center w-full min-h-2 mb-1 text-white`}
                        key={idx_}
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={`mx-1 mr-2 text-[12px]`}
                        />
                        <p className={`text-[13px]`}>{obj_.feature}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={`h-[75px] w-full`}>
            <div className={`h-[1px] w-[90%] bg-white/20 mx-auto`} />
            <div
              className={`w-full h-full flex flex-row justify-between items-center`}
            >
              <div
                className={`text-white/50 px-6 tinos-regular-italic text-[13px] font-bold`}
              >
                Limited to 50 members
              </div>
              <div
                className={`min-w-[100px] h-[30px] mr-6 bg-white rounded-[15px] flex flex-row justify-center items-center cursor-pointer`}
              >
                <div
                  className={`min-w-[100px] h-[30px] scale-[0.3] opacity-50 absolute hover:animate-ping bg-white rounded-[15px] flex flex-row justify-center items-center cursor-pointer z-[0]`}
                />
                <p
                  className={`text-black/80 font-medium text-[12px] tinos-regular-italic z-[1] pointer-events-none`}
                >
                  Start Now
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className={`text-black/80 ml-2 text-[12px] z-[1] pointer-events-none`}
                />
              </div>
            </div>
          </div>
          <div
            className={`w-full h-full flex flex-col justify-center items-center bg-white/10 backdrop-blur-sm tinos-regular absolute top-0 z-[1]`}
          >
            <p className={`text-[50px] text-white/80 z-[1] font-bold`}>
              CEO Offer
            </p>

            <p className={`text-[50px] text-white/80 z-[1] font-bold`}>
              Coming Soon
            </p>
          </div>
        </motion.div>
      </motion.div>

      <ElegantTicketGuarantee />
    </div>
  );
};

export default Pricing_;

// // // // // // //
// // // // // // //

const ElegantTicketGuarantee = () => {
  return (
    <div className="scale-[0.6]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 w-full max-w-4xl px-4"
      >
        <div className="bg-gradient-to-b from-[#c0976a] via-[#deb887] to-[#c0976a] p-px rounded-lg">
          <div className="bg-[#1c1814] rounded-lg p-8 md:p-12 relative">
            <div className="text-center space-y-6">
              <h2>
                <span className="block text-4xl md:text-5xl font-serif italic bg-gradient-to-r from-[#deb887] to-[#c0976a] bg-clip-text text-transparent">
                  Experience Our Service
                </span>
                <span className="block mt-2 text-xl md:text-2xl text-[#deb887]/80 font-serif italic">
                  with Total Peace of Mind
                </span>
              </h2>
              <p className="text-[#e8e6e3]/70 text-lg leading-relaxed max-w-2xl mx-auto scale-[1.1]">
                If you don&apos;t have more free time, feel safer and more in control when it comes to your vehicle needs after the first month of joining,{" "}
                <span className="text-[#deb887]/80 block mt-4 font-serif italic scale-[1.5]">
                  we will give you a full package refund.
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};