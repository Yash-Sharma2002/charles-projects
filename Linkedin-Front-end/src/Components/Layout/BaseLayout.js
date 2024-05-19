import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../../features/profile/profileSlice";
import { useQuery } from "react-query";
import routes from "../../Config/routes/api";
import axios from "axios";
import Loader from "../UI/Loader";

const { userProfileRoute, clientRoute } = routes;
const WITHOUT_AUTHENTICATION_ROUTES = ["/signup", "/login"];

export default function BaseLayout({ children }) {
  const user = useSelector(selectProfile);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [hostname, setHostname] = useState(null);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }),
    [user.token]
  );

  // const {
  //   isError: profileError,
  //   isFetching: profileFetching,
  //   data: profileData,
  // } = useQuery(
  //   ["profile", user, user.token],
  //   async () =>
  //     await axios.get(userProfileRoute, config).then((res) => res.data),
  //   { enabled: !!user.token && !user.details, refetchOnWindowFocus: false }
  // );

  // const {
  //   data: clientData,
  //   isFetching: clientFetching,
  //   isError: clientError,
  // } = useQuery(
  //   ["fetchClient", hostname],
  //   async () =>
  //     await axios.get(`${clientRoute}${hostname}`).then((res) => res.data),
  //   { enabled: !!hostname && !user.client, refetchOnWindowFocus: false }
  // );
  // console.log("outside",user)
  // useEffect(() => {
  //   console.log(
  //     "called baselayout upper useeffect",
  //     user,
  //     (!user.token || !user.token.length) &&
  //       !WITHOUT_AUTHENTICATION_ROUTES.includes(location.pathname)
  //   );
  //   setHostname(window.location.host);
  //   const accessToken = sessionStorage.getItem("jwtToken");

  //   // if ((!user.token || !user.token.length) && !WITHOUT_AUTHENTICATION_ROUTES.includes(location.pathname)) {
  //   //   // return navigate("/login")
  //   // }
  //   if (accessToken) {
  //     dispatch(
  //       setProfile({
  //         ...user,
  //         token: accessToken,
  //       })
  //     );
  //   }
  // }, [user.token]);

  // useEffect(() => {
  //   console.log("called baselayout LOWER useeffect", user);
  //   if (clientData) {
  //     dispatch(
  //       setProfile({
  //         ...user,
  //         client: clientData,
  //       })
  //     );
  //   }

  //   if (profileData && user.token) {
  //     dispatch(
  //       setProfile({
  //         ...user,
  //         details: profileData,
  //       })
  //     );
  //   }

  //   if (profileData && !profileData.linkedin_connected_account) {
  //     navigate("/");
  //   }
  // }, [clientData, profileData]);

  // if (profileError) {
  //   sessionStorage.removeItem("jwtToken");
  //   navigate("/login");
  // }

  // if (!clientData || profileFetching) {
  //   return (
  //     <div className="vh-100">
  //       <Loader />
  //     </div>
  //   );
  // }

  // if (
  //   profileData &&
  //   WITHOUT_AUTHENTICATION_ROUTES.includes(location.pathname)
  // ) {
  //   navigate("/");
  // }

  // if (
  //   !user.token &&
  //   !WITHOUT_AUTHENTICATION_ROUTES.includes(location.pathname)
  // ) {
  //   navigate("/login");
  // }

  return <>{children}</>;
}
