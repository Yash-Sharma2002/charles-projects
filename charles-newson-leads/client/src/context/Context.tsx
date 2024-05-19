import React from "react";
import Loading from "../components/loader/Loading";
import axios from "axios";
import { BASE_URL } from "../constants/api";

export const AppContext = React.createContext<any>({});

export const AppProvider = ({ children }: any) => {
  const [routerPath, setRouterPath] = React.useState<string>("/");

  const [dialog, setDialog] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>({});
  const [organisation, setOrganisation] = React.useState<any>({});
  const [workspaces, setWorkspaces] = React.useState<any>([]);
  const [address, setAddress] = React.useState<any>({});

  const [currentWorkspace, setCurrentWorkspace] = React.useState<any>({});

  async function fetchUserDetails() {
    let uid = localStorage.getItem("uid");

    let session = localStorage.getItem("session");
    let token = localStorage.getItem("token");
    let workspaces = JSON.parse(localStorage.getItem("workspaces") || "[]");
    let organisation = JSON.parse(localStorage.getItem("organisation") || "{}");

    if (!uid || Object.keys(organisation).length === 0 || workspaces.length === 0) {
      const res = await axios
        .get(
          BASE_URL +
            "/get-user?" +
            new URLSearchParams({
              uid: uid || "",
              access_token: token || "",
              session: session || "",
            })
        )
        .then((res) => res.data)
        .catch((err) => err.response.data);
        if(res.message === "Token expired." || res.message === "Invalid token." || res.message === "Unknown error."){
          localStorage.removeItem("uid");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          localStorage.removeItem("session");
          localStorage.removeItem("token");
          window.location.href = "/sign-in";
        }

      if (res.user) {
        localStorage.setItem("uid", res.user.uid);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("session", res.user.session);
        localStorage.setItem("token", res.user.access_token);
        setUser(res.user);
      }
      if (res.organisations) {
        setOrganisation(res.organisations);
        localStorage.setItem("organisation", JSON.stringify(res.organisations));
      }
      else{
        setOrganisation({});
        window.location.href = "/onboarding/organisation-details";
      }
      if (res.workspaces.length>0) {
        setWorkspaces(res.workspaces);
        setCurrentWorkspace(res.workspaces[0]);
        localStorage.setItem("workspaces", JSON.stringify(res.workspaces));
      }
      else{
        setWorkspaces([]);
        window.location.href = "/create-workspace";
      }
      if (res.address) {
        setAddress({ ...organisation, address: res.address });
      }
    }
  }

  React.useEffect(() => {
    fetchUserDetails();
  }, [user.uid]);


  return (
    <AppContext.Provider
      value={{
        routerPath,
        setRouterPath,
        dialog,
        setDialog,
        user,
        setUser,
        setLoading,
        loading,
        organisation,
        setOrganisation,
        workspaces,
        setWorkspaces,
        address,
        setAddress,
        fetchUserDetails,
        currentWorkspace,
        setCurrentWorkspace,
      }}
    >
      {children}
      {loading && <Loading />}
    </AppContext.Provider>
  );
};

export default AppProvider;
