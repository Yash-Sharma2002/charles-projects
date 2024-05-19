import React from "react";
import MobileSideBar from "./mobile/MobileSideBar";
import Layout from "./desktop/Layout";

export default function GlobalLayout(props:{children:React.ReactNode}) {
  return (
    <>
        <MobileSideBar>
          <Layout>{props.children}</Layout>
        </MobileSideBar>
    </>
  );
}
