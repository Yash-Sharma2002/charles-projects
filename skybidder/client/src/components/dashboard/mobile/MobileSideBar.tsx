import React from "react";
import { SidebarData } from "../../../constants/Sidebar";
import { AppContext } from "../../../context/Context";
import { LuMenu } from "react-icons/lu";

export default function MobileSideBar(props: { children: React.ReactNode }) {
  const routerPath = React.useContext(AppContext);
  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}

          <div className="bg-[#002F53]  lg:hidden">
            <div className="flex justify-between items-center w-11/12 mx-auto py-7">
              <h1 className="">
                <span className="text-white text-[40px] font-[900]">Sky</span>
                <span className="text-[#FFC107] text-[40px] font-[900]">
                  Bidder
                </span>
              </h1>
              <label htmlFor="my-drawer" >
                <LuMenu className="text-white text-[40px] font-[900] cursor-pointer" />
              </label>
            </div>
          </div>

          {props.children}
        </div>
        <div className="drawer-side lg:hidden ">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-[#002F53]">
            <div className="w-full absolute top-0 left-0 h-full z-10">
              <div className=" z-40 relative">
                <h1 className="p-10 pb-5">
                  <span className="text-white text-[40px] font-[900]">Sky</span>
                  <span className="text-[#FFC107] text-[40px] font-[900]">
                    Bidder
                  </span>
                </h1>
                <div className="mt-6 pl-4">
                  {SidebarData.map((item, index) => {
                    const highlight = item.title.toLowerCase() === routerPath;
                    return (
                      <div
                        key={index}
                        className={`w-full my-2 px-2 py-3 rounded-lg ${
                          highlight ? "bg-white " : "bg-transparent"
                        }`}
                      >
                        <a href={item.path} className="flex items-center">
                          <item.Icon
                            className={`text-[24px] mr-3 ${
                              highlight ? "text-[#002F53]" : "text-white"
                            }`}
                          />
                          <p
                            className={`font-bold text-[20px] ${
                              highlight ? "text-[#002F53]" : "text-white"
                            }`}
                          >
                            {item.title}
                          </p>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
