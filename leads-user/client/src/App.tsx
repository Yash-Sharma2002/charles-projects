import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loading from "./components/loader/Loading";
import AppProvider from "./context/Context";
import "./styles/App.scss";
import "./styles/index.css";
import Pipelines from "./pages/Pipelines";

const AddressOrg = React.lazy(() => import("./pages/onboarding/Address"));
const Organisation = React.lazy(
  () => import("./pages/onboarding/Organisation")
);
const ResetPass = React.lazy(() => import("./pages/ResetPass"));
const ForgetPass = React.lazy(() => import("./pages/ForgetPass"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Signin = React.lazy(() => import("./pages/SignIn"));
const Home = React.lazy(() => import("./pages/Home"));
const UserDetails = React.lazy(() => import("./pages/UserDetails"));
const LinkedinAccounts = React.lazy(() => import("./pages/LinkedinAccounts"));
const EmailIntegration = React.lazy(() => import("./pages/EmailIntegration"));
const CreateWorkspace = React.lazy(() => import("./pages/CreateWorkspace"));
const WorkspacePreferences = React.lazy(
  () => import("./pages/WorkSpacePreferences")
);
const OrganisationDetails = React.lazy(
  () => import("./pages/OrganisationDetails")
);
const Inbox = React.lazy(() => import("./pages/Inbox"));
const Webhook = React.lazy(() => import("./pages/Webhook"));
const Campaigns = React.lazy(() => import("./pages/Campaigns"));
const CreateCampaign = React.lazy(() => import("./pages/CreateCampaign"));

export default function App() {
  const [selectedForEdit, setSelectedForEdit] = React.useState({});

  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forget-pass" element={<ForgetPass />} />
              <Route path="/reset-password/:uid/email/:email" element={<ResetPass />} />
              <Route
                path="/onboarding/organisation-details"
                element={<Organisation />}
              />
              <Route
                path="/onboarding/organisation-address"
                element={<AddressOrg />}
              />
              <Route
                path="/organisation-details"
                element={<OrganisationDetails />}
              />
              <Route path="/user-details/" element={<UserDetails />} />
              <Route path="/user-details/:uid" element={<UserDetails />} />
              <Route
                path="/edit-workspace"
                element={<WorkspacePreferences />}
              />
              <Route path="/create-workspace" element={<CreateWorkspace />} />
              <Route path="/linkedin-accounts" element={<LinkedinAccounts />} />
              <Route path="/email-integration" element={<EmailIntegration />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/webhook" element={<Webhook />} />
              <Route
                path="/campaigns"
                element={<Campaigns setSelectedForEdit={setSelectedForEdit} />}
              />
              <Route
                  path="/campaigns/create"
                  element={<CreateCampaign title="Create Campaign" />}
                />
                <Route
                  path="/campaigns/edit"
                  element={
                    <CreateCampaign
                      title="Edit Campaign"
                      selectedForEdit={selectedForEdit}
                    />
                  }
                />

                <Route 
                  path="/pipelines"
                  element={<Pipelines />}/>

            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </>
  );
}
