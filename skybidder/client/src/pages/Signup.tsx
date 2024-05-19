import React from "react";
import SkyBidder2 from "../components/common/SkyBidder2";
import InputEmail from "../components/input/InputEmail";
import InputPass from "../components/input/InputPass";
import { IoIosSend } from "react-icons/io";
import { SignupGoogle } from "../components/user/SignupGoogle";
import SignupFacebook from "../components/user/SignupFacebook";
import InputName from "../components/input/InputName";

export default function Signup() {
  return (
    <div className="relative w-full h-auto md:h-[100vh] overflow-hidden">
      <SkyBidder2 />
      <div className="w-full md:w-[65%] lg:w-[75%] pb-6 md:absolute top-[30%] md:top-0 right-0 bg-white h-full z-20 rounded-t-3xl lg:rounded-t-[unset] lg:rounded-l-[1.5rem!important] block pt-20 md:pt-0 md:flex items-center justify-center">
        <div className="w-[80%] mx-auto">
          <h1 className="text-black font-bold text-[32px]">Create Account</h1>
          <div className="flex justify-evenly w-full items-center my-5 flex-col lg:flex-row">
            <SignupGoogle />
            <SignupFacebook />
          </div>
          <p className="w-fit mx-auto text-[#878787] text-[26px]">- OR -</p>
          <div className="w-full md:w-10/12 mx-auto text-start my-6">
            <InputName defValue="" />
            <InputEmail defValue="" />
            <InputPass defValue="" />
            <button className="w-full bg-[#002F53] text-white text-[16px] font-[600] leading-[20px] py-4 rounded-xl mt-4 flex justify-center items-center">
              <IoIosSend className="mr-3 text-[20px]" /> Log in
            </button>
            <p className="text-[#878787] text-[16px] font-[700] mt-4">
              Already have an account?{" "}
              <a href="/" className="text-[#002F53] font-[900]">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
