import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputPass from "../components/input/InputPass";
import UserErrorInterface from "../interface/UserErrorInterface";
import validateLogin from "../functions/validateLogin";
import { AppContext } from "../context/Context";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import InputEmail from "../components/input/InputEmail";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const {
    setUser: setNewUser,
    setLoading,
    fetchUserDetails,
  } = React.useContext(AppContext);

  const navigate = useNavigate();
  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  const [user, setUser] = React.useState({
    user: "",
    password: "",
    provider: "email",
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

    const response = await axios
      .get(BASE_URL + "/login?" + new URLSearchParams(user))
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    if (response.message === "User logged in successfully") {
      setNewUser({
        uid: response.uid,
        token: response.token,
        username: response.username,
        email: user.user,
        session: response.session,
      });

      localStorage.setItem("email", response.user.email);
      localStorage.setItem("username", response.user.username);
      localStorage.setItem("uid", response.user.uid);

      localStorage.setItem("session", response.user.session);
      localStorage.setItem("token", response.user.access_token);

      await fetchUserDetails();

      setLoading(false);
      window.location.href = "/";
    } else {
      alert(response.message);
      setLoading(false);
      return;
    }
    if (response.token) {
      alert(response.errors.message);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      let access_token = sessionStorage.getItem("token");
      if (access_token) {
        navigate("/");
      }
    }
  }, [navigate]);

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
            <a href={"/forget-pass"} className="text-blue-500 font-bold">
              {" "}
              Forget Password?
            </a>
          </p>

          <p className="mt-3 text-center">
            Don't have an account?
            <a href={"/sign-up"} className=" text-blue-500 font-bold">
              {" "}
              Signup
            </a>
          </p>
        </div>
      </AccessLayout>
    </>
  );
}
