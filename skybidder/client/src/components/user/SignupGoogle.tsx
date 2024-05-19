// import React from "react";
import { FcGoogle } from "react-icons/fc";

export function SignupGoogle({ location }: any) {
  return (
	<div className="border-[rgba(117, 117, 117, 0.25)]  bg-[#F9F9F9] mx-auto flex w-11/12 lg:w-[45%] cursor-pointer rounded-xl items-center justify-center  border-[1px] border-solid py-4 my-2 px-2">
	<FcGoogle className="mr-4 text-[24px] text-[#1B454D]" />
      <p className="text-[16px] font-[600] leading-[20px] text-[black]">
        Sign up with Google
      </p>
    </div>
  );
}
