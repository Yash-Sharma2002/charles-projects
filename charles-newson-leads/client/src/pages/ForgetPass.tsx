import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputEmail from "../components/input/InputEmail";

export default function ForgetPass() {
  return (
    <>
      <AccessLayout page="forgot-pass">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Forget Passwsord?
        </h2>
        <p className='text-center text-xl px-3 mb-4'>We’ll send an email to you so you can reset your password</p>
        <InputEmail
          label="Email"
          defValue=""
          placeholder="Enter Email Address"
          name="email"
        />
        
        <button className="btn  btn-info my-3 text-white w-[364px] ml-[13px] md:ml-0 md:md:w-full mx-auto block">Send</button>
        <p className="mt-3 text-center">
          Don't want to reset?
          <a href={"/sign-in"} className=" text-blue-500 font-bold">
            {" "}
            Login
          </a>
        </p>
      </AccessLayout>
    </>
  );
}
