import React from "react";
import LoginLayout from "../components/layouts/LoginLayout";
import CampaignsContent from "../components/Campaigns/CampaignsContent";

export default function Campaigns({ setSelectedForEdit }:any) {
  return (
    <LoginLayout title="Campaigns">
      <CampaignsContent setSelectedForEdit={setSelectedForEdit} />
    </LoginLayout>
  );
}
