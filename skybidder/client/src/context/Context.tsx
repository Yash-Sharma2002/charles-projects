import React from "react";

export const AppContext = React.createContext<any>({});

export const AppProvider = ({ children }: any) => {
  const [routerPath, setRouterPath] = React.useState<string>("/");

  const [dialog, setDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRouterPath(window.location.pathname.split("/").pop() || "/");
  }, []);

  return (
    <AppContext.Provider value={{ routerPath, setRouterPath,dialog,setDialog }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;