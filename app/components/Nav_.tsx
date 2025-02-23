'use client'

import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Nav_ = ({}) => {
  return (
    <div
      className={`w-full h-[70px] fixed top-0 flex flex-row xl:justify-center justify-between items-center z-[5]`}
    >
      <div
        className={`w-[200px] min-h-2 hover:h-[120%] flex flex-row justify-center items-center transition-all duration-200`}
      >
        <img className={`w-[80px] h-[80px]`} src="/assets/images/white_logo.png" />
      </div>
      <Menu_ />
      <div
        className={`w-[200px] h-full xl:flex hidden flex-row justify-center items-center text-[20px] text-black font-black`}
      >
        <div
          className={`w-full min-h-full flex flex-row justify-center items-center xl:opacity-0 md:opacity-100 opacity-0 xl:pointer-events-none md:pointer-events-auto pointer-events-none`}
        >
          <FontAwesomeIcon
            icon={faFacebook}
            className={`h-[20px] w-[20px] text-black/60 hover:text-orange-600 transition-all duration-[400ms] cursor-pointer mx-[6px]`}
          />
          <FontAwesomeIcon
            icon={faTwitter}
            className={`h-[20px] w-[20px] text-black/60 hover:text-orange-600 transition-all duration-[400ms] cursor-pointer mx-[6px]`}
          />
          <FontAwesomeIcon
            icon={faInstagram}
            className={`h-[20px] w-[20px] text-black/60 hover:text-orange-600 transition-all duration-[400ms] cursor-pointer mx-[6px]`}
          />
        </div>
        <FontAwesomeIcon
          icon={faBars}
          className={`h-[100%] w-[20px] absolute top-0 text-black/60 hover:text-orange-600 transition-all duration-[400ms] cursor-pointer mx-[6px] xl:opacity-0 md:opacity-0 opacity-100 xl:pointer-events-none md:pointer-events-none pointer-events-auto`}
        />
      </div>
      {["Get app"].map((obj_, idx_) => {
        return (
          <div
            key={idx_}
            onClick={() => {
              window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30")
            }}
            className={`cursor-pointer ml-2 mr-12 min-w-8 h-8 px-4 text-[12px] text-black bg-white font-semibold flex xl:hidden flex-col justify-center items-center border-white border-[1px] rounded-[20px]`}
          >
            {obj_}
          </div>
        );
      })}
    </div>
  );
};

export default Nav_;

// ===================================== Menu_

const Menu_ = ({}) => {
  return (
    <div
      className={`w-full h-full xl:flex hidden flex-row justify-start items-center md:opacity-100 opacity-0 md:pointer-events-auto pointer-events-none`}
    >
      {/* <Link
              activeClass="active"
              // className="hero"
              to="services"
              spy={true}
              smooth={true}
              offset={-150}
              duration={500}
            > */}
      <a href={`#hero`}>
        <p
          className={` opacity-0 text-[14px] text-white/60 mx-4 hover:text-orange-600 hover:font-medium transition-all duration-200 cursor-pointer`}
        >
          Home
        </p>
      </a>
      {/* </Link> */}
      <a href={`#services`}>
        <p
          className={` opacity-0 text-[14px] text-white/60 mx-4 hover:text-orange-600 hover:font-medium transition-all duration-200 cursor-pointer`}
        >
          Services
        </p>
      </a>
      <a href={`#study`}>
        <p
          className={` opacity-0 text-[14px] text-white/60 mx-4 hover:text-orange-600 hover:font-medium transition-all duration-200 cursor-pointer`}
        >
          Case Studies
        </p>
      </a>
      <a href={`#cta`}>
        <p
          className={` opacity-0 text-[14px] text-white/60 mx-4 hover:text-orange-600 hover:font-medium transition-all duration-200 cursor-pointer`}
        >
          Pricing
        </p>
      </a>
      {["Sign up"].map((obj_, idx_) => {
        return (
          <div
            key={idx_}
            className={`opacity-0 ml-auto min-w-8 h-8 px-4 text-[12px] text-black bg-white font-semibold flex flex-col justify-center items-center border-white border-[1px] rounded-[20px]`}
          >
            {obj_}
          </div>
        );
      })}
      {["Get app"].map((obj_, idx_) => {
        return (
          <div
            key={idx_}
            onClick={() => {
              window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30")
            }}
            className={`cursor-pointer ml-2 min-w-8 h-8 px-4 text-[12px] bg-orange-500 text-white font-semibold flex flex-col justify-center items-center rounded-[20px]`}
          >
            {obj_}
          </div>
        );
      })}
    </div>
  );
};
