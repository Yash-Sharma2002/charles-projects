import React from "react";
import { AppContext } from "../../../context/Context";
import { SidebarData } from "../../../constants/Sidebar";

export default function Sidebar() {
  const { routerPath } = React.useContext(AppContext);
  return (
    <>
      <div className="hidden lg:block md:w-[40%] lg:w-[25%] absolute top-0 left-0 bg-[#002F53] h-full z-10">
        <div className=" z-40 relative">
          <h1 className="p-7 pb-5">
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
    </>
  );
}

