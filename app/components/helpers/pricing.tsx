import {
  faArrowRight,
  faCheckCircle,
  faStar,
  faGem,
  faShieldAlt,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Pricing_ = () => {
  const y = useMotionValue(0);
  const yRange = useTransform(y, [0, 2.5], [0, 100]);

  return (
    <div
      className={`w-full xl:h-[90vh] min-h-screen flex flex-col justify-center items-center top_fade py-20`}
    >
      <div
        className={`w-full min-h-2 flex flex-col mt-[30px] mb-[60px] justify-center items-center`}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-amber-400 text-[16px] uppercase tracking-widest font-bold mb-2`}
        >
          Choose Your Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-white text-[50px] tinos-regular-italic text-center font-black`}
        >
          Exclusive Memberships
        </motion.h2>
      </div>
      <motion.div
        className={`flex xl:flex-row flex-col justify-center items-center w-full min-h-2 mb-2 gap-8`}
        style={{ y: yRange }}
      >
        {/* Gold Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
          className={`min-h-[500px] w-[350px] m-2 rounded-2xl flex flex-col justify-start items-center relative overflow-hidden border border-amber-500/20 backdrop-blur-sm bg-gradient-to-b from-amber-500/10 to-black/40`}
          style={{ 
            boxShadow: "0 10px 40px -10px rgba(245, 158, 11, 0.3), 0 0 20px 0px rgba(245, 158, 11, 0.1) inset"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"></div>
          
          {/* Gold header */}
          <div className="w-full pt-8 pb-4 px-6 relative">
            <div className="absolute top-4 right-4">
              <FontAwesomeIcon
                icon={faGem}
                className="text-amber-500 h-6 w-6"
              />
            </div>
            <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-3 py-1 rounded-full">GOLD TIER</span>
            <h3 className="text-white text-3xl font-bold mt-2">Premium</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-white text-4xl font-bold">R2,999</span>
              <span className="text-white/60 ml-1">/month</span>
            </div>
            <p className="text-white/60 text-sm mt-2">For businesses that need quality service and dedicated support</p>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-amber-500/0 via-amber-500/30 to-amber-500/0"></div>
          
          {/* Features */}
          <div className="w-full px-6 py-6 flex-1">
            <ul className="space-y-3">
              {[
                "2 vehicles allocated for fuel delivery",
                "On-demand & scheduled fuel delivery",
                "Purchase fuel at fuel station prices",
              ].map((feature, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-start"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-amber-500 h-4 w-4 mt-0.5 mr-3 flex-shrink-0"
                  />
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* Bonus section */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/10">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-amber-500 h-4 w-4 mr-2"
                />
                <h4 className="text-amber-400 font-bold text-sm">FREE PACKAGE BONUS</h4>
              </div>
              <ul className="space-y-2">
                {[
                  "4 Royal Valet washes (Valued at R2,600)",
                  "Save 50% on all additional washes",
                ].map((bonus, idx) => (
                  <li key={idx} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-amber-500 h-3 w-3 mt-1 mr-2 flex-shrink-0"
                    />
                    <span className="text-amber-100/80 text-xs">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* CTA */}
          <div className="w-full px-6 pb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-500/80 text-xs italic">Limited to 50 members</span>
            </div>
            <div
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm flex items-center justify-center cursor-pointer group"
            >
              Get Started
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Black Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -10, transition: { duration: 0.2 } }}
          className={`min-h-[520px] w-[350px] m-2 rounded-2xl flex flex-col justify-start items-center relative overflow-hidden border border-white/10 backdrop-blur-sm bg-gradient-to-b from-white/10 to-black/60 z-10`}
          style={{ 
            boxShadow: "0 10px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px 0px rgba(255, 255, 255, 0.05) inset"
          }}
        >
          {/* Popular badge */}
          <div className="absolute -right-12 top-8 bg-white text-black text-xs font-bold py-1 px-10 transform rotate-45 z-20">
            MOST POPULAR
          </div>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0"></div>
          
          {/* Black header */}
          <div className="w-full pt-8 pb-4 px-6 relative">
            <div className="absolute top-4 right-4">
              <FontAwesomeIcon
                icon={faCrown}
                className="text-white h-6 w-6"
              />
            </div>
            <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">BLACK TIER</span>
            <h3 className="text-white text-3xl font-bold mt-2">Executive</h3>
            <div className="flex items-baseline mt-1">
              <span className="text-white text-4xl font-bold">R4,999</span>
              <span className="text-white/60 ml-1">/month</span>
            </div>
            <p className="text-white/60 text-sm mt-2">For demanding executives who need premium service and priority</p>
          </div>
          
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
          
          {/* Features */}
          <div className="w-full px-6 py-6 flex-1">
            <ul className="space-y-3">
              {[
                "4 vehicles allocated for fuel delivery",
                "On-demand & scheduled fuel delivery",
                "Purchase fuel at fuel station prices",
                "Priority servicing & dedicated support"
              ].map((feature, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-start"
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-white h-4 w-4 mt-0.5 mr-3 flex-shrink-0"
                  />
                  <span className="text-white/80 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            {/* Bonus section */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-white h-4 w-4 mr-2"
                />
                <h4 className="text-white font-bold text-sm">FREE PACKAGE BONUS</h4>
              </div>
              <ul className="space-y-2">
                {[
                  "8 Royal Valet washes (Valued at R5,200)",
                  "Save 50% on all additional washes",
                  "Exclusive event invitations"
                ].map((bonus, idx) => (
                  <li key={idx} className="flex items-start">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-white h-3 w-3 mt-1 mr-2 flex-shrink-0"
                    />
                    <span className="text-white/80 text-xs">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* CTA */}
          <div className="w-full px-6 pb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/80 text-xs italic">Limited to 50 members</span>
            </div>
            <div
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center group cursor-pointer"
            >
              Get Started
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing_;

// // // // // // //
// // // // // // //
// ElegantTicketGuarantee Component (for future implementation)

// const ElegantTicketGuarantee = () => {
//   return (
//     <div className="max-w-md mx-auto rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-6 border border-amber-500/20">
//       <div className="flex items-center mb-4">
//         <FontAwesomeIcon icon={faShieldAlt} className="text-amber-500 h-5 w-5 mr-3" />
//         <h3 className="text-xl font-bold text-white">Our Guarantee</h3>
//       </div>
//       <p className="text-white/70 mb-4 text-sm">
//         We stand behind our service with a 100% satisfaction guarantee. If you're not completely satisfied, we'll make it right.
//       </p>
//     </div>
//   );
// };
