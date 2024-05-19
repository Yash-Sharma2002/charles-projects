import React from "react";
import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen fixed z-[10000] top-0 left-0 flex justify-center items-center bg-white opacity-35"></div>
      <div className="w-full h-screen fixed z-[10001] top-0 left-0 flex justify-center items-center ">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </>
  );
}
