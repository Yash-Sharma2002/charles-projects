import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import routes from "../../Config/routes/api";
import { useLocation, useNavigate } from "react-router-dom";
import { GOOGLE_REDIRECT_URI } from "../../Config/config";
import { useMutation } from "react-query";
const GoogleCallback = () => {
  const search = useLocation().search;
  const code = new URLSearchParams(search).get("code");
  const user = useSelector(selectProfile);
  console.log(code, user);
  const { googleCodeExchangeToAccessTokenUrl } = routes;
  const navigate = useNavigate();
  const makeRequest = async (data) => {
    return axios.post(
      googleCodeExchangeToAccessTokenUrl,
      {
        code: `${data.code}`,
        redirect_uri: `${GOOGLE_REDIRECT_URI}`,
      },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
  };
  const { mutate, isLoading, isError } = useMutation(
    makeRequest,
    {
      onSuccess: (res) => {
        console.log("success data: ", res);
        if (res.data && res.data.connected) {
          navigate("/email-integration");
        } else {
          navigate("/email-integration");
        }
      },
      onError: (err) => {
        console.log("error data: ", err);
        navigate("/email-integration");
      },
    },
    {}
  );
  useEffect(() => {
    if (code && user.token) {
      mutate({ code: code, token: user.token });
    }
  }, []);
  if (isLoading) {
    return <div>Loading ......</div>;
  }
  if (isError) {
    return <div>Something went wrong...</div>;
  }
  return <div></div>;
};

export default GoogleCallback;
