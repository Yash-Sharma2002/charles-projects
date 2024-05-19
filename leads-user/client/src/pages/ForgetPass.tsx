import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputEmail from "../components/input/InputEmail";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserAPI } from "../constants/api";
import { AppContext } from "../context/Context";

export default function ForgetPass() {
  const [email, setEmail] = React.useState("");
  const { setLoading } = React.useContext(AppContext);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  async function handleSubmit() {
    setLoading(true);

    try {
      const res = await axios
        .get(UserAPI + "/password/forget?email=" + email)
        .then((res) => res.data)
        .catch((err) => err.response.data);
      alert(res.message);
      setLoading(false);
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <>
      <AccessLayout page="forgot-pass">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Forget Passwsord?
        </h2>
        <p className="text-center text-xl px-3 mb-4">
          We’ll send an email to you so you can reset your password
        </p>
        <InputEmail
          label="Email"
          defValue=""
          onChangeHandler={handleEmail}
          placeholder="Enter Email Address"
          name="email"
        />

        <button
          onClick={handleSubmit}
          className="btn  btn-info my-3 text-white w-[364px] ml-[13px] md:ml-0 md:md:w-full mx-auto block"
        >
          Send
        </button>
        <p className="mt-3 text-center">
          Don't want to reset?
          <Link to={"/sign-in"} className=" text-blue-500 font-bold">
            {" "}
            Login
          </Link>
        </p>
      </AccessLayout>
    </>
  );
}
