import { faArrowRight, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Pricing_ = () => {
  const y = useMotionValue(0);
  const yRange = useTransform(y, [0, 2.5], [0, 100]);

  return (
    <div
      className={`w-full h-[90vh] flex flex-col justify-center items-center top_fade`}
    >
      <div
        className={`w-full min-h-2 flex flex-col mt-[30px] mb-[60px] justify-center items-center`}
      >
        <p className={`text-white text-[25px] font-black`}>
          Packages and Pricing
        </p>
      </div>
      <motion.div
        className={`flex flex-row justify-center items-center w-full min-h-2 mb-2`}
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
              className={`h-[100px] w-full mb-[-20px] flex flex-col justify-center items-start px-4 text-black text-[20px] font-bold`}
            >
              Gold
            </div>
            <div
              className={`text-black/80 px-4 text-[13px] font-bold w-[250px] relative top-[13px]`}
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
},{
  feature: "4 Royal Valet washes (R1,800 value/month)",
  status: true,
},{
  feature: "Tyre inspection valued at R300/month",
  status: true,
},{
  feature: "On-demand & scheduled fuel delivery",
  status: true,
},
                    {
                      feature: "24/7 fuel delivery at station prices",
                      status: true,
                    },
                    {
                      feature: "Interior steam clean & detailing",
                      status: true,
                    },
                    { feature: "Full exterior wash & polish", status: true },
                    { feature: "24/7 roadside assistance and repairs", status: true },
                  ].map((obj_, idx_) => {
                    return (
                      <div
                        className={`flex flex-row justify-start items-center w-full min-h-2 mb-1`}
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
              <div className={`text-black/80 px-4 text-[13px] font-bold`}>
                Limited to 50 members
              </div>
              <div
                className={`min-w-[100px] h-[30px] mr-4 bg-black rounded-[15px] flex flex-row justify-center items-center cursor-pointer`}
              >
                <div
                  className={`min-w-[100px] h-[30px] scale-[0.3] opacity-50 absolute hover:animate-ping bg-whit rounded-[15px] flex flex-row justify-center items-center cursor-pointer z-[0]`}
                />
                <p
                  className={`text-white/80 font-medium text-[12px] pointer-events-none z-[1]`}
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
          className={`h-[475px] w-[450px] m-2 rounded-[5px] flex flex-col justify-start items-center bg-[#131313] relative overflow-hidden`}
          style={{ y: yRange }}
        >
          <div className={`h-[10px]`}></div>
          <div className={`flex flex-row justify-between items-center w-full`}>
            <div
              className={`h-[100px] w-full mb-[-20px] flex flex-col justify-center items-start px-6 text-white/50 text-[20px] font-bold`}
            >
              Black
            </div>
            <div
              className={`text-white/50 px-6 text-[13px] font-bold w-[250px] relative top-[13px]`}
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
                    },{
                      feature: "8 Royal Valet washes (R3,600 value/month)",
                      status: true,
                    },{
                      feature: "Tyre inspection valued at R600/month",
                      status: true,
                    },{
                      feature: "On-demand & scheduled fuel delivery",
                      status: true,
                    },
                    {
                      feature: "24/7 fuel delivery at station prices",
                      status: true,
                    },
                    {
                      feature: "Interior steam clean & detailing",
                      status: true,
                    },
                    { feature: "Full exterior wash & polish", status: true },
                    { feature: "24/7 roadside assistance and repairs", status: true },
                  ].map((obj_, idx_) => {
                    return (
                      <div
                        className={`flex flex-row justify-start items-center w-full min-h-2 mb-1 text-white`}
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
              <div className={`text-white/50 px-6 text-[13px] font-bold`}>
                Limited to 50 members
              </div>
              <div
                className={`min-w-[100px] h-[30px] mr-6 bg-orange-600 rounded-[15px] flex flex-row justify-center items-center cursor-pointer`}
              >
                <div
                  className={`min-w-[100px] h-[30px] scale-[0.3] opacity-50 absolute hover:animate-ping bg-orange-600 rounded-[15px] flex flex-row justify-center items-center cursor-pointer z-[0]`}
                />
                <p
                  className={`text-white/80 font-medium text-[12px] z-[1] pointer-events-none`}
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
      </motion.div>

      <motion.div
        className={`flex flex-row justify-center items-center w-full min-h-2 mt-[40px]`}
        style={{ y: yRange }}
      >
        <p
          className={`text-center text-white/60 w-[600px] font-medium opacity-80`}
        >
          Choose the Right Plan: Velit commodo adipisicing exercitation est
          aliquip sit proident eu ad. Consequat ex mollit nulla ea sint velit
          veniam culpa Lorem eiusmod proident est eiusmod.
        </p>
      </motion.div>
    </div>
  );
};

export default Pricing_;
