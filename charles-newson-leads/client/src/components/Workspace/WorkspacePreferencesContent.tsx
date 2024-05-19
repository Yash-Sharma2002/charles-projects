import React from "react";
import WorkspaceMemberItem from "./WorkspaceMemberItem";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Context";
import { BASE_URL } from "../../constants/api";
import axios from "axios";
import Loader from "../loader/Loader";

export default function WorkspacePreferencesContent() {
  const { currentWorkspace, user, organisation } = React.useContext(AppContext);
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [inviteFields, setInviteFields] = React.useState("");
  const navigate = useNavigate();

  const handleShow = () => setShow(!show);
  const handleCancel = () => navigate(-1);

  const getCurrentWorkSpaceDetails = React.useRef(() => {});

  const [workspaceMembers, setWorkspaceMembers] = React.useState([]);
  const [workspace, setWorkspace] = React.useState<any>({});

  getCurrentWorkSpaceDetails.current = async () => {
    setLoading(true);
    const params = {
      workspace_id: currentWorkspace.workspace_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
    };

    let data = await axios
      .get(BASE_URL + "/get-workspace-details?" + new URLSearchParams(params))
      .then((res) => res.data)
      .catch((err) => err.response.data);

    setWorkspace(data.workspace);

    data = await axios
      .get(
        BASE_URL + "/get-all-user-by-workspace?" + new URLSearchParams(params)
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

    setWorkspaceMembers(data.users);
    setLoading(false);
  };

  async function inviteUser() {
    setLoading(true);
    const params = {
      organisation_id: organisation.organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
      email: inviteFields,
    };

    let data = await axios
      .post(BASE_URL + "/invite-member?", params)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.message === "User Invited") {
      alert("User Invited");
      setLoading(false);
      handleShow();
    } else {
      alert(data.message);
      setLoading(false);
    }
  }

 
  React.useEffect(() => {
    getCurrentWorkSpaceDetails.current();
  }, [user, currentWorkspace]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {workspace && (
            <div className="workspace-preferences-content main-bg p-4 mt-6 md:mt-0 w-full">
              <div className="row g-0 box-card p-4">
                <div className="col-md-6 pe-4">
                  <Form.Label>Workspace Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="workspace-name"
                    value={workspace.workspace_name || ""}
                  />
                </div>
                <div className="col-md-6 pe-4 mt-4">
                  <Form.Label>Workspace Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="invite-code"
                    value={workspace.workspace_desc || ""}
                  />
                </div>
              </div>
              <div className="text-end">
                <button
                  className="mt-3 mb-2 text-white btn btn-primary2"
                  onClick={handleShow}
                >
                  Invite User <AiOutlinePlus size={18} className="text-white" />
                </button>
              </div>
              <div className="overflow-hidden"> 
              <table className="table  table-borderless workspace-table align-middle text-center mb-5 ">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Allowed LinkedIn Accounts</th>
                    <th>Has Admin Rights</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workspaceMembers &&
                    workspaceMembers.map((item, index) => {
                      return (
                        <WorkspaceMemberItem
                          key={index}
                          data={item}
                          caller={"workspace"}
                        />
                      );
                    })}
                </tbody>
              </table>
              </div>
              <div className="d-flex justify-content-between">
                <button className="btn btn-red">Delete Workspace</button>
                <div>
                  <button
                    className="btn btn-warning me-2 capitalize text-white"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary2" type="submit">
                    Save
                  </button>
                </div>
              </div>

              {/***** Inite User Popup *****/}

              <Modal
                show={show}
                onHide={handleShow}
                size="lg"
                centered
                className="max-heighted-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Invite User</Modal.Title>
                </Modal.Header>
                <div>
                  <Modal.Body>
                    <div className="d-flex align-items-end mb-3">
                      <div className="flex-grow-1">
                        <Form.Label>Member's Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="invite-email"
                          placeholder={"Enter Member's Email"}
                          required
                          onChange={(e) => setInviteFields(e.target.value)}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <button onClick={inviteUser} className="btn btn-primary2">
                      Invite
                    </button>
                  </Modal.Footer>
                </div>
              </Modal>
            </div>
          )}
        </>
      )}
    </>
  );
}
