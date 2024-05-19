import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import Avatar from "../common/Avatar";
import { AppContext } from "../../context/Context";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import Roles from "../../constants/Roles";

export default function WorkspaceMemberItem({
  data,
  caller,
  adminRight,
  setAdminRight
}: {
  data: any;
  caller: string;
  adminRight: boolean;
  setAdminRight: Function;
}) {
  const { organisation, currentWorkspace, user } = React.useContext(AppContext);
  

  function removeMember() {
    if (caller === "workspace") {
      removeMemberWorkspace();
    } else if (caller === "organisation") {
      removeMemberOrganisation();
    }
  }

  async function removeMemberWorkspace() {
    const params = {
      workspace_id: currentWorkspace.workspace_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
      userId: data.uid,
    };

    let response = await axios
      .delete(BASE_URL + "/delete-user-workspace?" + new URLSearchParams(params))
      .then((res) => res.data)
      .catch((err) => err.response.data);
    if (response.message) {
      alert(response.message);
    }
  }

  async function removeMemberOrganisation() {
    const params = {
      organisation_id: organisation.organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: organisation.session,
      userId: data.uid,
    };

    let response = await axios
      .delete(BASE_URL + "/delete-user?" + new URLSearchParams(params))
      .then((res) => res.data)
      .catch((err) => err.response.data);
    if (response.message) {
      alert(response.message);
    }
  }

  React.useEffect(() => {
    if (data.uid === user.uid) {
      if(data.role === Roles.WorkspaceAdmin && caller === "workspace") {
        setAdminRight(true)
      }
      else if(data.role === Roles.OrganisationAdmin && caller === "organisation") {
        setAdminRight(true)
      }
      else if(data.role === Roles.OrganisationOwner && caller === "organisation") {
        setAdminRight(true)
      }
    }
  }
  , [data.role]);

  return (
    <>
      <tr className="workspace-member-item box-card">
        <td>
          <a href={"/user-details/" + data.uid} className="hover:text-inherit">
            <div className="d-flex align-items-center justify-content-center">
              <Avatar image={data.profile} />
              <p className="ms-2 mb-0">{data.email}</p>
            </div>
          </a>
        </td>
        <td>
          {
            <div className="d-flex flex-wrap justify-content-center">
              <p className="mb-0">No accounts</p>
              {/* {
                        data.accounts.length !== 0 ?
                        data.accounts.slice(0,4).map((item:any) => {
                            return <div key={item.id} className='me-2'>
                                        <div className="custom-tooltip">
                                            <Avatar image={item.image} />
                                            <span className="tooltiptext">{item.name}<br/>{item.email}</span>
                                        </div>
                                    </div>
                          }) :
                          <p className='mb-0'>No accounts</p>
                    }
                    {
                        data.accounts.length > 4 ?
                        <div className='more d-flex align-items-center justify-content-center'>
                            { '+'+data.accounts.slice(4).length }
                        </div> :
                        ''
                    } */}
            </div>
          }
        </td>
        <td>
          <Form.Switch
            id={"admin-right-switch-" + data.uid}
            checked={adminRight}
            onChange={() => setAdminRight(!adminRight)}
          />
        </td>
        <td>
          {adminRight && (
            <Button onClick={removeMember} variant="action">
              <AiOutlineDelete size={20} />
            </Button>
          )}
        </td>
      </tr>
    </>
  );
}
