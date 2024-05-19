import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputPass from "../components/input/InputPass";
import UserErrorInterface from "../interface/UserErrorInterface";
import validateLogin from "../functions/validateLogin";
import InputEmail from "../components/input/InputEmail";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Context";
import axios from "axios";
import { UserAPI } from "../constants/api";
import ResStatus from "../constants/ResStatus";

export default function Signin() {
  const { setData, setLoading,user:currentUser } = React.useContext(AppContext);

  const navigate = useNavigate();
  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  const [user, setUser] = React.useState({
    user: "",
    password: "",
  });

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function login() {
    let errors: UserErrorInterface = validateLogin(user);
    if (errors.hasError) {
      setError(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios
        .get(
          UserAPI +
            "/access?" +
            new URLSearchParams({ user: user.user, password: user.password })
        )
        .then((res) => {
          return res.data;
        }).catch((err) => {
          return err.response.data;
        });

      if (response.status === ResStatus.Success) {
        setData(response.data);
        navigate("/");
      } else {
        setLoading(false);
        alert(response.message);
      }
    } catch (error: any) {
      setLoading(false);
      alert(error.message);
    }
    setLoading(false);
  }

  React.useEffect(() => {
      if (currentUser.access_token) {
        navigate("/");
      }
  }, [navigate,currentUser]);

  return (
    <>
      <AccessLayout page="login">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Welcome Back
        </h2>
        <div className="md:w-11/12 w-full mx-auto">
          <InputEmail
            name="user"
            defValue=""
            label="Email"
            placeholder="Enter Email"
            onChangeHandler={onChangeHandler}
            error={error.field === "user" ? error.message : undefined}
          />
          <InputPass
            name="password"
            defValue=""
            label="Password"
            placeholder="Enter Password"
            onChangeHandler={onChangeHandler}
            error={error.field === "password" ? error.message : undefined}
          />

          <button
            className="btn  btn-info md:mx-0 w-[360px] ml-[13px] md:ml-0 md:w-full my-3 text-white"
            onClick={login}
          >
            Login
          </button>
          <p className="mt-3 text-center">
            <Link to={"/forget-pass"} className="text-blue-500 font-bold">
              {" "}
              Forget Password?
            </Link>
          </p>

          <p className="mt-3 text-center">
            Don't have an account?
            <Link to={"/sign-up"} className=" text-blue-500 font-bold">
              {" "}
              Signup
            </Link>
          </p>
        </div>
      </AccessLayout>
    </>
  );
}
