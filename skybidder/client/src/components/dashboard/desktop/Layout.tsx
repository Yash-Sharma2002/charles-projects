import React from "react";
import Sidebar from "./Sidebar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative w-full h-[100vh] overflow-hidden">
        <Sidebar />
        <div className="w-full lg:w-[80%] lg:absolute lg:top-0 right-0 bg-white h-full z-20 rounded-t-3xl lg:rounded-t-[unset] lg:rounded-l-[1.5rem!important] px-4 py-10">
          {props.children}
        </div>
      </div>
    </>
  );
}
