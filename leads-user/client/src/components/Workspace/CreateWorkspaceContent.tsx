import React from "react";
import { useNavigate } from "react-router-dom";
import InputName from "../input/InputName";
import { AppContext } from "../../context/Context";
import { BASE_URL } from "../../constants/api";
import axios from "axios";
import InputSelect from "../input/InputSelect";

export default function CreateWorkspaceContent() {
  const { organisation, user, setLoading,setWorkspaces:setOrgworkspace,workspaces:Orgworkspace } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [users, setUsers] = React.useState([]);

  const [workspace, setWorkspace] = React.useState({
    workspace_name: "",
    workspace_desc: "",
    workspace_admin: "",
  });

  const getOrganisationUsers = React.useRef(() => {});

  function onUserChange(type: string, value: string) {
    setWorkspace({ ...workspace, workspace_admin: value });
  }

  getOrganisationUsers.current = async function () {
    setLoading(true);
    const params = {
      organisation_id: organisation.organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
    };

    let data = await axios
      .get(
        BASE_URL +
          "/get-all-users-by-organisation?" +
          new URLSearchParams(params)
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.message) {
      alert(data.message);
      setLoading(false);
      return;
    }
    const arrayData = data.users.map((member: any) => {
      return {
        name: member.username,
        value: member.uid,
        image: member.profile || "",
        id: member.uid,
      };
    });
    setUsers(arrayData);
    setLoading(false);
  };

  async function createWorkspace() {
    setLoading(true);
    const data = {
      organisation_id: organisation.organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
      ...workspace,
    };

    let res = await axios
      .post(BASE_URL + "/register-workspace", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.message !== "Workspace created successfully") {
      alert(res.message);
      setLoading(false);
      return;
    }
    setOrgworkspace([...Orgworkspace,res.workspace])
      setLoading(false);
      navigate("/");
  }

  React.useEffect(() => {
    getOrganisationUsers.current();
  }, [user, organisation]);

  return (
    <>
      <div className="create-workspace main-bg p-4">
        <div className="row g-0 box-card p-4">
          <div className="col-md-12">
            <InputName
              label="Workspace Name"
              defValue=""
              placeholder="Enter workspace name"
              onChangeHandler={(e: any) =>
                setWorkspace({ ...workspace, workspace_name: e.target.value })
              }
              name="workspace_name"
            />

            <InputName
              label="Workspace Description"
              defValue=""
              placeholder="Enter workspace description"
              onChangeHandler={(e: any) =>
                setWorkspace({ ...workspace, workspace_desc: e.target.value })
              }
              name="workspace_desc"
            />

            <InputSelect
              label="Workspace Admin"
              defValue=""
              placeholder="Select workspace admin"
              name="workspace_admin"
              selectArray={users}
              onChange={onUserChange}
            />

            <div className="w-full text-end">
              <button onClick={createWorkspace} className="btn btn-primary2">
                Create WorkSpace
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
