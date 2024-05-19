import React, { useState } from "react";
import { AiOutlineBell, AiOutlinePoweroff } from "react-icons/ai";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { FiChevronDown } from "react-icons/fi";
import { Dropdown } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SwitchWorkspace from "../Workspace/SwitchWorkspace";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/Context";
import { FaRegUser } from "react-icons/fa";
import Avatar from "../common/Avatar";

export default function Topbar(props: any) {
  const curLocation = useLocation();
  const navigate = useNavigate();

  const { organisation,Logout } = React.useContext(AppContext);



  const logOut = () => {
      Logout();
      navigate("/sign-in");
  };

  const [show, setShow] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleShow = () => setShow(!show);

  return (
    <section className="topbar py-3">
      <div className="container">
        <div className="row-g-0">
          <div className="col-md-12">
            <div className="d-flex justify-content-between">
              <h2 className="text-xl py-2">{props.title}</h2>
              <div className="d-flex justify-content-end">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="topbar-icon"
                    className="shadow-sm me-4 hover:bg-[#2A83EC]"
                  >
                    <AiOutlineBell size={25} className="hover:text-white" />
                    <span className="badge"></span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm">
                    <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="topbar-icon"
                    className="shadow-sm me-4  hover:bg-[#2A83EC]"
                  >
                    <a href="/user-details" className="hover:text-white">
                      <FaRegUser size={25} />
                    </a>
                  </Dropdown.Toggle>
                  {/* <Dropdown.Menu className="shadow-sm">
                    <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                  </Dropdown.Menu> */}
                </Dropdown>

                {/* RESPONSIVE TOPBAR */}

                <nav
                  className={
                    !isOpen
                      ? "h-[10vh] fixed top-0  left-0 w-full bg-white z-50 block md:hidden"
                      : "h-[120vh] fixed top-0  left-0 w-full bg-white z-50 block md:hidden"
                  }
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center">
                      <Avatar
                        image={"/images/lu-logo.png"}
                        imageClass={"logo"}
                      />
                      <div className="text-navy-blue text-lg font-bold ml-2">
                        {props.title}
                      </div>
                    </div>

                    <div className="flex">
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="topbar-icon"
                          className="shadow-sm me-4 h-10 md:h-12"
                        >
                          <AiOutlineBell size={25} />
                          <span className="badge"></span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm">
                          <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown align="end">
                        {/* <Dropdown.Toggle
                          variant="topbar-icon"
                          className="shadow-sm me-4"
                        > */}
                        <a href="/user-details" className="btn-primary2">
                          <FaRegUser size={25} />
                        </a>
                        {/* </Dropdown.Toggle> */}
                        {/* <Dropdown.Menu className="shadow-sm">
                          <Dropdown.Item href="">Coming Soon!</Dropdown.Item>
                        </Dropdown.Menu> */}
                      </Dropdown>

                      {/* 2nd option */}
                      <button
                        onClick={toggleMenu}
                        className="btn btn-square btn-ghost lg:hidden"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-8 h-8 transition-transform transform ${
                            isOpen ? "rotate-90" : "rotate-0"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`lg:hidden ${
                      isOpen ? "block" : "hidden"
                    } bg-white text-navy-blue h-screen`}
                  >
                    {/* 10 */}
                    <Dropdown align="end" className="p-3">
                      <Dropdown.Toggle
                        variant="company-menu"
                        className="bg-white"
                        style={{
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          borderRadius: "10px",
                          padding: "10px 20px",
                          color: "#000",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={organisation?.organisation_image}
                            alt=""
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                            className="mr-2"
                          />
                          <span className="user-name">
                            {organisation?.organisation_name}
                          </span>
                          <FiChevronDown size={20} className="ms-2" />
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="user-menu shadow-sm">
                        <Link
                          to="/organisation-details"
                          className="link d-flex no-underline"
                        >
                          <FaRegUser size={20} />
                          <p>Organisation Details</p>
                        </Link>
                        <div
                          className="link d-flex no-underline"
                          onClick={handleShow}
                        >
                          <HiOutlineSwitchHorizontal size={20} />
                          <p>Switch Workspace</p>
                          <SwitchWorkspace
                            show={show}
                            handleShow={handleShow}
                          />
                        </div>
                        <Link
                          to="/edit-workspace"
                          className="link d-flex no-underline"
                        >
                          <TbAdjustmentsHorizontal size={20} />
                          <p>Workspace Preferences</p>
                        </Link>
                        <Link
                          to="#"
                          className="link d-flex no-underline"
                          onClick={logOut}
                        >
                          <AiOutlinePoweroff size={20} />
                          <p>Logout</p>
                        </Link>
                      </Dropdown.Menu>
                    </Dropdown>

                    <NavLink
                      to={"/"}
                      className={
                        "d-flex align-items-center menu-item link  p-3 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/"
                              ? "/images/icons/home-filled.png"
                              : "/images/icons/home-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span
                        className={`${!props.clicked ? "block" : "hidden"}`}
                      >
                        Home
                      </span>
                    </NavLink>

                    {/* 2 */}
                    <NavLink
                      to={"/campaigns"}
                      className={
                        "d-flex align-items-center menu-item link p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/campaigns" ||
                            curLocation.pathname === "/campaigns/create" ||
                            curLocation.pathname === "/campaigns/edit"
                              ? "/images/icons/campaign-filled.png"
                              : "/images/icons/campaign-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Campaigns</span>
                    </NavLink>

                    {/* 3 */}
                    <NavLink
                      to={"/pipelines"}
                      className={
                        "d-flex align-items-center mFenu-item link  p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/pipelines"
                              ? "/images/icons/prospect-filled.png"
                              : "/images/icons/prospect-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Pipelines</span>
                    </NavLink>

                    {/* 4 */}

                    {/* 5 */}
                    <NavLink
                      to={"/email-integration"}
                      className={
                        "d-flex align-items-center menu-item link  p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/email-integration"
                              ? "/images/icons/email-integ-filled.png"
                              : "/images/icons/email-integ-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Email Integration</span>
                    </NavLink>

                    {/* 6 */}
                    <NavLink
                      to={"/linkedin-accounts"}
                      className={
                        "d-flex align-items-center menu-item link p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/linkedin-accounts"
                              ? "/images/icons/accounts-filled.png"
                              : "/images/icons/accounts-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Linkedin Accounts</span>
                    </NavLink>

                    {/* 7 */}
                    <NavLink
                      to={"/webhook"}
                      className={
                        "d-flex align-items-center menu-item link p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/webhook"
                              ? "/images/icons/webhook-filled.png"
                              : "/images/icons/webhook-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Webhook</span>
                    </NavLink>

                    {/* 8 */}
                    <NavLink
                      to={"/account-settings"}
                      className={
                        "d-flex align-items-center menu-item link  p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/account-settings"
                              ? "/images/icons/settings-filled.png"
                              : "/images/icons/settings-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Account Settings</span>
                    </NavLink>

                    {/* 9 */}
                    <NavLink
                      to={"/admin-panel"}
                      className={
                        "d-flex align-items-center menu-item link p-3 mt-2 no-underline"
                      }
                    >
                      <div className="menu-icon">
                        <img
                          src={
                            curLocation.pathname === "/admin-panel"
                              ? "/images/icons/admin-filled.png"
                              : "/images/icons/admin-outline.png"
                          }
                          alt=""
                          className="w-6 h-6"
                        />
                      </div>
                      <span className="mx-1">Admin Panel</span>
                    </NavLink>
                  </div>
                </nav>

                {/*  */}

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="company-menu"
                    className="bg-white hidden md:block"
                    style={{
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      border: "none",
                      color: "#000",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={organisation?.organisation_image}
                        alt=""
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                        }}
                        className="mr-2"
                      />
                      <span className="user-name">
                        {organisation?.organisation_name}
                      </span>
                      <FiChevronDown size={20} className="ms-2" />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-menu shadow-sm">
                    <Link
                      to="/organisation-details"
                      className="link d-flex no-underline"
                    >
                      <FaRegUser size={20} />
                      <p>Organisation Details</p>
                    </Link>
                    <div
                      className="link d-flex no-underline"
                      onClick={handleShow}
                    >
                      <HiOutlineSwitchHorizontal size={20} />
                      <p>Switch Workspace</p>
                      <SwitchWorkspace show={show} handleShow={handleShow} />
                    </div>
                    <Link
                      to="/edit-workspace"
                      className="link d-flex no-underline"
                    >
                      <TbAdjustmentsHorizontal size={20} />
                      <p>Workspace Preferences</p>
                    </Link>
                    <Link
                      to="#"
                      className="link d-flex no-underline"
                      onClick={() => logOut()}
                    >
                      <AiOutlinePoweroff size={20} />
                      <p>Logout</p>
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
