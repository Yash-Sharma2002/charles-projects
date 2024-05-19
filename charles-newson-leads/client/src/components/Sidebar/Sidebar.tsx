import { AiOutlinePoweroff } from "react-icons/ai";
import { BsChevronLeft } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import Avatar from "../common/Avatar";

export default function Sidebar({ handleClick, inboxCount, clicked }: any) {
  const curLocation = useLocation();

  const logOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/sign-in";
  };


  return (
    <section className="sidebar hidden md:block">
      <div className="sidebar-body flex flex-column justify-content-between py-3">
        <Button className="toggle-btn mt-0" onClick={handleClick}>
          <BsChevronLeft size={15} />
        </Button>
        <div className="sidebar-top flex">
          <Avatar image={"/images/lu-logo.png"} imageClass={"logo"} />
          <span className="mt-1">Lead Usher</span>
        </div>
        <div className="main-menu">
          <NavLink
            to={"/"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/"
                    ? "/images/icons/home-filled.png"
                    : "/images/icons/home-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>Home</span>
          </NavLink>

          <NavLink
            to={"/campaigns"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/campaigns" ||
                  curLocation.pathname === "/campaigns/create" ||
                  curLocation.pathname === "/campaigns/edit"
                    ? "/images/icons/campaign-filled.png"
                    : "/images/icons/campaign-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Campaigns
            </span>
          </NavLink>

          <NavLink
            to={"/pipelines"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/pipelines"
                    ? "/images/icons/prospect-filled.png"
                    : "/images/icons/prospect-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Pipelines
            </span>
          </NavLink>

          <NavLink
            to={"/inbox"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/inbox"
                    ? "/images/icons/inbox-filled.png"
                    : "/images/icons/inbox-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>Inbox</span>
            {inboxCount && inboxCount.count && inboxCount.count > 0 ? (
              <div className="unread-count">{inboxCount.count}</div>
            ) : (
              ""
            )}
          </NavLink>

          <NavLink
            to={"/email-integration"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/email-integration"
                    ? "/images/icons/email-integ-filled.png"
                    : "/images/icons/email-integ-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Email Integration
            </span>
          </NavLink>

          <NavLink
            to={"/linkedin-accounts"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/linkedin-accounts"
                    ? "/images/icons/accounts-filled.png"
                    : "/images/icons/accounts-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Linkedin Accounts
            </span>
          </NavLink>

          <NavLink
            to={"/webhook"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/webhook"
                    ? "/images/icons/webhook-filled.png"
                    : "/images/icons/webhook-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>Webhook</span>
          </NavLink>

          <NavLink
            to={"/account-settings"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/account-settings"
                    ? "/images/icons/settings-filled.png"
                    : "/images/icons/settings-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Account Settings
            </span>
          </NavLink>

          <NavLink
            to={"/admin-panel"}
            className={
              "d-flex align-items-center menu-item link py-2 no-underline"
            }
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <img
                src={
                  curLocation.pathname === "/admin-panel"
                    ? "/images/icons/admin-filled.png"
                    : "/images/icons/admin-outline.png"
                }
                alt=""
              />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>
              Admin Panel
            </span>
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <button
          onClick={logOut}
            className="d-flex align-items-center menu-item link py-3 no-underline"
          >
            <div
              className={`menu-icon ${!clicked ? "" : "mr-[0px!important]"}`}
            >
              <AiOutlinePoweroff />
            </div>
            <span className={`${!clicked ? "block" : "hidden"}`}>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );
}