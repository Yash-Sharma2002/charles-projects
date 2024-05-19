import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputPass from "../components/input/InputPass";

export default function ResetPass() {
  return (
    <>
      <AccessLayout page="reset-pass">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Reset Password
        </h2>

        <InputPass
          label="Password"
          defValue=""
          placeholder="Enter Password"
          name="password"
        />
        <InputPass
          label="Confirm Password"
          defValue=""
          placeholder="Confirm Password"
          name="confirm-password"
        />
        <button className="btn  btn-info md:mx-0 w-[364px] ml-[13px] md:ml-0 md:w-[90%] mx-4 my-3 text-white">Login</button>
        <p className="mt-3 text-center">
          Don't have an account?
          <a href={"/sign-up"} className=" text-blue-500 font-bold">
            {" "}
            Signup
          </a>
        </p>
      </AccessLayout>
    </>
  );
}
