import React from "react";
import CampaignCard from "../components/common/CampaignCard";
import { IoMdAdd } from "react-icons/io";

export default function Campaigns() {
  return (
    <>
      <div className="flex justify-between items-center mt-4 md:mt-7 w-[95%] mx-auto">
        <h1 className="font-black text-3xl text-start text-black ">Campaigns</h1>
        <button className="bg-[#002F53] text-white text-[16px] font-[600] leading-[20px] py-4 rounded-xl flex justify-center px-3 items-center">
        <IoMdAdd className="mr-3 text-[20px]" />
          Create New Campaign
        </button>
      </div>
      <div className="flex flex-col md:flex-row mt-10">
        <CampaignCard
          title="Campaign 1"
          description={
            <>
              <p className="text-black font-extrabold">Total Bids: 24</p>
              <p className="text-black font-extrabold">Last Run: Today</p>
            </>
          }
          link="https://www.google.com"
          image="https://via.placeholder.com/300x200"
          imageAlt="Placeholder image"
          status="Active"
        />
         <CampaignCard
          title="Campaign 1"
          description={
            <>
              <p className="text-black font-extrabold">Total Bids: 24</p>
              <p className="text-black font-extrabold">Last Run: Yesterday</p>
            </>
          }
          link="https://www.google.com"
          image="https://via.placeholder.com/300x200"
          imageAlt="Placeholder image"
          status="Disabled"
        />
      </div>
    </>
  );
}
