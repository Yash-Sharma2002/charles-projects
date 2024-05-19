import React from "react";
import Loading from "../components/loader/Loading";
import { UserAPI } from "../constants/api";
import axios from "axios";
import ResStatus from "../constants/ResStatus";

export const AppContext = React.createContext<any>({});

export const AppProvider = ({ children }: any) => {
  const [routerPath, setRouterPath] = React.useState<string>("/");

  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>({});
  const [organisation, setOrganisation] = React.useState<any>({});
  const [workspaces, setWorkspaces] = React.useState<any>([]);

  const [currentWorkspace, setCurrentWorkspace] = React.useState<any>({});

  function setData(data: any) {
    setDataForUser({
      uid: data.uid,
      access_token: data.access_token,
      session: data.session,
      username: data.username,
      name: data.name,
      email: data.email,
    });

    setDataForOrganisation({
      organisation_id: data.organisation_id,
      organisation_name: data.organisation_name,
      organisation_image: data.organisation_image,
    });

    setDataForWorkspace(data.workspace);
  }

  function setDataForOrganisation(data: any) {
    setOrganisation({
      organisation_id: data.organisation_id,
      organisation_name: data.organisation_name,
      organisation_image: data.organisation_image,
    });

    localStorage.setItem("organisation", JSON.stringify(data));
  }

  function setDataForWorkspace(data: any) {
    data = data.map((workspace: any) => {
      return {
        workspace_id: workspace.workspace_id,
        workspace_name: workspace.workspace_name,
        workspace_group: workspace.workspace_group,
      };
    });
    setWorkspaces(data);
    setCurrentWorkspace(data[0]);
    localStorage.setItem("workspace", JSON.stringify(data[0]));
  }

  function setDataForUser(data: any) {
    setUser({
      uid: data.uid,
      access_token: data.access_token,
      username: data.username,
      name: data.name,
      email: data.email,
      session: data.session,
    });

    localStorage.setItem("user", JSON.stringify(data));

    setUserCookie(data);
  }

  function setUserCookie(data: any) {
    // 7 day expire
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `uid=${JSON.stringify(
      data.uid
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `access_token=${JSON.stringify(
      data.access_token
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `username=${JSON.stringify(
      data.username
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `email=${JSON.stringify(
      data.email
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `session=${JSON.stringify(
      data.session
    )}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `name=${JSON.stringify(
      data.name
    )}; expires=${date.toUTCString()}; path=/`;
  }

  const fetchUserDetails = async () => {
    setLoading(true);
    try{
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.uid === undefined) {
      user = {
        uid: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
        access_token: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
        username: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
        email: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)email\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
        session: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)session\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
        name: JSON.parse(document.cookie.replace(
          /(?:(?:^|.*;\s*)name\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        )),
      };
    }
    setDataForUser(user);

    let organisation = JSON.parse(localStorage.getItem("organisation") || "{}");
    setDataForOrganisation(organisation);

    let workspaces = JSON.parse(localStorage.getItem("workspace") || "[]");
    setDataForWorkspace([workspaces]);

    if (!organisation.organisation_id && !workspaces.workspace_id && user.uid) {
      await getDataFromAPI(user);
    }
  }
  catch(err){ 
    // console.log(err);
  }

    setLoading(false);
  };

  function Logout(){
    document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    sessionStorage.clear();
    setUser({});
  }

  async function getDataFromAPI(user: any) {
    let response = await axios
      .get(
        UserAPI +
          "/get?" +
          new URLSearchParams({
            user: user.uid,
            session: user.session,
            access_token: user.access_token,
          })
      )
      .then((res) => {
        return res.data;
      })
      .catch((err: any) => {
        return err.response.data;
      });

    if (response.status === ResStatus.Success) {
      setData(response.data);
    } else {
      alert(response.message);
    }
  }

  React.useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AppContext.Provider
      value={{
        routerPath,
        setRouterPath,
        user,
        setUser,
        setLoading,
        loading,
        organisation,
        setOrganisation,
        workspaces,
        setWorkspaces,
        fetchUserDetails,
        currentWorkspace,
        setCurrentWorkspace,
        setDataForUser,
        setDataForOrganisation,
        setDataForWorkspace,
        setData,
        Logout
      }}
    >
      {children}
      {loading && <Loading />}
    </AppContext.Provider>
  );
};

export default AppProvider;
