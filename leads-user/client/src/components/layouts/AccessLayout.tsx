import React from "react";

export default function AccessLayout({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {
  const handleImg = () => {
    switch (page) {
      case "login":
        return "/images/login.png";
      case "signup":
        return "/images/signup.png";
      case "forgot-pass":
        return "/images/forgot-pass.png";
      case "reset-pass":
        return "/images/reset-pass.png";
      case "organisation":
        return "/images/organisation.png";
      case "address":
        return "/images/address.png";
      default:
        break;
    }
  };
  return (
    <div className="w-full min-h-screen h-full ">
      <div className="flex justify-between items-center flex-col md:flex-row h-full"
         style={{
          background: "rgba(42, 131, 236, 0.0862745098)",
        }}>
        <div
          className="md:w-[48%] w-full md:min-h-screen md:h-full flex justify-center items-center "
       
        >
          <img
            src={handleImg()}
            className="md:w-8/12 w-1/2 object-contain "
            alt="Sign in"
          />
        </div>
        <div className="md:w-[48%] w-full  md:min-h-screen md:h-full flex justify-center items-center bg-white">
          <div className="md:w-8/12 w-full py-3 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
