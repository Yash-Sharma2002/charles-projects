import React from "react";
import AccessLayout from "../components/layouts/AccessLayout";
import InputName from "../components/input/InputName";
import InputPass from "../components/input/InputPass";
import InputEmail from "../components/input/InputEmail";
import UserErrorInterface from "../interface/UserErrorInterface";
import validateUser from "../functions/validateUser";
import UserSignupinterface from "../interface/UserSignup";
import { UserAPI } from "../constants/api";
import axios from "axios";
import { AppContext } from "../context/Context";
import { Link, useNavigate } from "react-router-dom";
import ResStatus from "../constants/ResStatus";

export default function SignUp() {
  const { setLoading, setDataForUser,user:currentUser } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = React.useState<UserSignupinterface>({
    username: "",
    email: "",
    password: "",
    provider: "local",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
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

  async function register() {
    let errors: UserErrorInterface = validateUser(user);
    if (errors.hasError) {
      setError(errors);
      return;
    }
    if (!isSubmitting) {
      setError({
        message: "Please agree to our terms and conditions",
        hasError: true,
        field: "terms",
      });
      return;
    }

    setLoading(true);

    const response = await axios
      .post(UserAPI + "/create", {
        user: {
          ...user,
          provider: "email",
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    if (response.status === ResStatus.Success) {
      setDataForUser(response.data);
      setLoading(false);
      window.location.href = "/onboarding/organisation-details";
    } else {
      setLoading(false);
      alert(response.message);
    }
  }

  React.useEffect(() => {
      if (currentUser.access_token) {
        navigate("/");
      }
  }, [navigate,currentUser]);

  return (
    <>
      <AccessLayout page="signup">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Create Account
        </h2>
        <div className="md:w-11/12 w-full mx-auto">
          <InputName
            label="Username"
            defValue=""
            placeholder="Enter Username"
            name="username"
            onChangeHandler={onChangeHandler}
            error={error.field === "username" ? error.message : ""}
          />
          <InputEmail
            label="Email"
            defValue=""
            placeholder="Enter Email Address"
            name="email"
            onChangeHandler={onChangeHandler}
            error={error.field === "email" ? error.message : ""}
          />
          <InputPass
            label="Password"
            defValue=""
            placeholder="Enter Password"
            name="password"
            onChangeHandler={onChangeHandler}
            error={error.field === "password" ? error.message : ""}
          />

          {/* terms and condition checkmark */}
          <div className="flex items-start justify-start my-3">
            <input
              type="checkbox"
              className="checkbox checkbox-info ml-4 md:ml-0"
              onChange={() => setIsSubmitting(!isSubmitting)}
            />
            <p className="text-[16px] ml-2">
              I have read and accept the Privacy Policy and Terms of Service
            </p>
          </div>
          {error.field === "terms" ? (
            <p className="text-red-500 text-[12px]">{error.message}</p>
          ) : (
            ""
          )}

          <button
            onClick={register}
            className="btn btn-info md:mx-0 w-[364px] ml-[13px] md:ml-0 md:w-full my-3 text-white"
          >
            Signup
          </button>

          <p className="mt-3 text-center">
            Already have an account?
            <Link to={"/sign-in"} className="text-blue-500 font-bold">
              {" "}
              Login
            </Link>
          </p>
        </div>
      </AccessLayout>
    </>
  );
}
