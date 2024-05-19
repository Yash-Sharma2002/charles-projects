import React from "react";
import CampaignCard from "../components/common/CampaignCard";

export default function Accounts() {
  return (
    <>
      <div>
        <h1 className="font-black text-3xl text-start text-black">Accounts</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <CampaignCard
          title="Upwork"
          link="https://www.google.com"
          image="https://via.placeholder.com/300x200"
          imageAlt="Upwork"
          status="Connected"
        />
        <CampaignCard
          title="Fiverr"
          link="https://www.google.com"
          image="https://via.placeholder.com/300x200"
          imageAlt="Upwork"
          status="Disconnected"
        />
      </div>
    </>
  );
}
