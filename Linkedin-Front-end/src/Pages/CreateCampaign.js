import React from "react";
import CreateCampaignContent from "../Components/Campaigns/CreateCampaignContent";
import LoginLayout from "../Layouts/LoginLayout";

export default function CreateCampaign({ title, selectedForEdit }) {
  return (
    <LoginLayout title={title}>
      <CreateCampaignContent selectedForEdit={selectedForEdit} />
    </LoginLayout>
  );
}
