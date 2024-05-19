// import React from "react";

export default function SigninFacebook() {
  return (
    <div className="border-[rgba(117, 117, 117, 0.25)]  bg-[#F9F9F9] mx-auto flex w-11/12 lg:w-[45%] cursor-pointer rounded-xl items-center justify-center  border-[1px] border-solid py-4 my-2 px-2">
      <img src={require("../../assets/fb.png")} className=" w-[24px] mr-4" alt="Log in with Google" />
      <p className="text-[black] text-[16px] font-[600] leading-[20px]">
        Log in with Facebook
      </p>
    </div>
  );
}
