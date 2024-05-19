import React from "react";
import { IoEyeOutline } from "react-icons/io5";
//@ts-ignore
import Upwork from "../../assets/upwork.png";

export default function CampaignCard(props: {
  title: string;
  description?: string | React.ReactNode;
  link: string;
  image: string;
  imageAlt: string;
  status: string;
}) {
  const statusColor = () => {
    if (props.status === "Active" || props.status === "Connected") {
      return "bg-green-500";
    } else if (
      props.status === "Inactive" ||
      props.status === "Disconnected" ||
      props.status === "Disabled"
    ) {
      return "bg-red-500";
    } else {
      return "bg-[#F2F2F2]";
    }
  };

  return (
    <>
      <div className="w-[300px] h-[auto] bg-[#FDFAFA] p-2 rounded-xl m-2">
        <div className="flex justify-between w-full items-center ">
          <div className="flex items-center">
            <p
              className={`w-2 h-2 rounded-full mr-2 block ${statusColor()}`}
            ></p>
            <p className="text-[#002F53] text-[12px] font-[600] leading-[20px]">
              {props.status}
            </p>
          </div>
          <div className="flex items-center cursor-pointer">
            <p className="text-[#002F53] text-[12px] font-[600] leading-[20px]">
              Click to View
            </p>
            <IoEyeOutline className="text-[#002F53] text-[16px] ml-2" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-auto">
          <img src={Upwork} alt={props.imageAlt} />
        </div>
        <div className="text-center">
          <h1 className="font-[900] text-black text-[20px]">{props.title}</h1>
          {props.description ? (
            typeof props.description === "string" ? (
              <p className="text-[#002F53] text-[12px] font-[600] leading-[20px]">
                {props.description}
              </p>
            ) : (
              props.description
            )
          ) : null}
        </div>
      </div>
    </>
  );
}
