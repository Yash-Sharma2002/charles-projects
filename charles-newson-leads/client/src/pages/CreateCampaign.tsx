import React,{useState} from "react";
import LoginLayout from "../components/layouts/LoginLayout";
import CreateCampaignContent from "../components/Campaigns/CreateCampaignContent";
// import Loader from "../components/loader/Loader";

export default function CreateCampaign({ title, selectedForEdit }:any) {
  // const [isLoading, setIsLoading] = useState(false);
  return (
    <>
    {/* {isLoading && <Loader />} */}
    <LoginLayout title={title}>
      <CreateCampaignContent selectedForEdit={selectedForEdit} />
    </LoginLayout>
    </>
  );
}
