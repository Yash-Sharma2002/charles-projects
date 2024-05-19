import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.scss";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Campaigns from "./Pages/Campaigns";
import CreateCampaign from "./Pages/CreateCampaign";
import Pipelines from "./Pages/Pipelines";
import Inbox from "./Pages/Inbox";
import EmailIntegration from "./Pages/EmailIntegration";
import LinkedinAccounts from "./Pages/LinkedinAccounts";
import AccountSettings from "./Pages/AccountSettings";
import Webhook from "./Pages/Webhook";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import UserSettings from "./Pages/UserSettings";
import WorkspacePreferences from "./Pages/WorkspacePreferences";
import BaseLayout from "./Components/Layout/BaseLayout";
import SnackbarProvider from "react-simple-snackbar";
import { Provider } from "react-redux";
import store from "./store";
import GoogleCallBack from "./Components/Callback/GoogleCallBack";
import "react-toastify/dist/ReactToastify.css";
import AdminPanel from "./Pages/AdminPanel";
import { useState } from "react";
const queryClient = new QueryClient();
const App = () => {
  const [selectedForEdit, setSelectedForEdit] = useState({});
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SnackbarProvider>
            <BaseLayout>
              <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/forgot-pass" element={<ForgotPassword />} />
                <Route exact path="/reset-pass" element={<ResetPassword />} />
                <Route exact path="/" element={<Home />} />
                <Route
                  exact
                  path="/campaigns"
                  element={
                    <Campaigns setSelectedForEdit={setSelectedForEdit} />
                  }
                />
                <Route
                  exact
                  path="/campaigns/create"
                  element={<CreateCampaign title="Create Campaign" />}
                />
                <Route
                  exact
                  path="/campaigns/edit"
                  element={
                    <CreateCampaign
                      title="Edit Campaign"
                      selectedForEdit={selectedForEdit}
                    />
                  }
                />
                <Route exact path="/pipelines" element={<Pipelines />} />
                <Route exact path="/inbox" element={<Inbox />} />
                <Route
                  exact
                  path="/email-integration"
                  element={<EmailIntegration />}
                />
                <Route
                  exact
                  path="/linkedin-accounts"
                  element={<LinkedinAccounts />}
                />
                <Route exact path="/webhook" element={<Webhook />} />
                <Route
                  exact
                  path="/account-settings"
                  element={<AccountSettings />}
                />
                <Route exact path="/user-settings" element={<UserSettings />} />
                <Route
                  exact
                  path="/edit-workspace"
                  element={<WorkspacePreferences />}
                />
                <Route
                  exact
                  path="/google-callback?code=:code&scope=:scope&authuser=:authuser&prompt=:prompt&hd=:hd"
                  element={<GoogleCallBack />}
                />
                <Route exact path="/admin-panel" element={<AdminPanel />} />
              </Routes>
            </BaseLayout>
          </SnackbarProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
