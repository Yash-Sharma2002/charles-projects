import LoginLayout from "../components/layouts/LoginLayout";
import CreateCampaignContent from "../components/Campaigns/CreateCampaignContent";

export default function CreateCampaign({ title, selectedForEdit }:any) {
  return (
    <>
    <LoginLayout title={title}>
      <CreateCampaignContent selectedForEdit={selectedForEdit} />
    </LoginLayout>
    </>
  );
}
