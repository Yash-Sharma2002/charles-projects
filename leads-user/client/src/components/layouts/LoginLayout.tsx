import React from "react";
// import { AppContext } from '../../context/Context';
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Context";

export default function LoginLayout({ children, title }: any) {
  const { user } = React.useContext(AppContext);

  const [clicked, SetClicked] = React.useState(
    sessionStorage.getItem("sidebar-clicked") === "true"
  );

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user.access_token) {
      navigate("/sign-in");
    }
  }, [navigate, user]);

  React.useEffect(() => {
    sessionStorage.setItem("sidebar-clicked", JSON.stringify(clicked));
  }, [clicked]);
  const handleClick = () => {
    SetClicked(!clicked);
  };
  return (
    <>
      {(user.access_token) && (
        <section className="login-layout">
          <div className="container-fluid pl-[0!important] md:pl-[auto]">
            <div className="row g-0">
              <div className="col-md-12">
                <div className={" " + (clicked ? "content-expand" : "")}>
                {/* <div className={"d-flex " + (clicked ? "content-expand" : "")}> */}
                  <Sidebar
                    handleClick={handleClick}
                    inboxCount={1}
                    clicked={clicked}
                  />
                  <div className="main-content ml-0 md:ml-[230px] flex-grow-1 md:ps-3 h-screen">
                    <Topbar title={title} />
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
