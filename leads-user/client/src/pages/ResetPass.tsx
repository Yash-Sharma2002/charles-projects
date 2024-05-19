import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputPass from "../components/input/InputPass";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserAPI } from "../constants/api";
import { AppContext } from "../context/Context";
import ResStatus from "../constants/ResStatus";

export default function ResetPass() {
  const { setLoading } = React.useContext(AppContext);
  const { email, uid } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  async function handleSubmit() {
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Password does not match");
      setLoading(false);
      return;
    }

    try {
      const user = {
        password,
        uid,
      };

      const res = await axios
        .put(UserAPI + "/password/reset", {
          user,
        })
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (res.status === ResStatus.Success) {
        setLoading(false);
        alert(res.message);
        navigate("/sign-in");
      }

      setLoading(false);
    } catch (error) {}
  }

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
          onChangeHandler={handlePassword}
          name="password"
        />
        <InputPass
          label="Confirm Password"
          defValue=""
          placeholder="Confirm Password"
          onChangeHandler={handleConfirmPassword}
          name="confirm-password"
        />
        <button
          onClick={handleSubmit}
          className="btn  btn-info md:mx-0 w-[364px] ml-[13px] md:ml-0 md:w-[90%] mx-4 my-3 text-white"
        >
          Login
        </button>
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
