import React, { useState } from "react";
import { Form, Dropdown } from "react-bootstrap";
import { FiUsers, FiDownload } from "react-icons/fi";
import { MdOutlineReplay, MdOutlineChat } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import axios from "axios";
import { HiOutlineDuplicate } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import { AppContext } from "../../context/Context";
import { CampaignAPI } from "../../constants/api";
import * as XLSX from "xlsx";
import toTitleCase from "../../functions/toTitle";
import ResStatus from "../../constants/ResStatus";
import Status from "../../constants/Status";

export default function CampaignBox({
  data,
  startCampaign,
  deleteCampaign,
}: any) {
  const [isActive, SetIsActive] = useState(false);
  const { user, setLoading, currentWorkspace } = React.useContext(AppContext);

  const [totalSearches, setTotalSearches] = React.useState(0);

  // async function updateCampaign(e: any, data: any) {
  //   console.log("updateCampaign", data);
  // }

  function s2ab(s: any) {
    // converting string to array buffer
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  function downloadAsExcel(selected: any, header: any, name: string) {
    let data = selected.map((item: any) => {
      return item.join(",").split(",");
    });
    data.unshift(header);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function exportData(data: any) {
    setLoading(true);
    let res = await axios
      .get(
        CampaignAPI +
          "/results?" +
          new URLSearchParams({
            uid: user.uid,
            campaign_id: data.campaign_id,
            access_token: user.access_token,
            session: user.session,
            linkedin_account_id: data.linkedin_account_id,
          })
      )
      .then((res) => res.data);

    if (res.status !== ResStatus.Success) {
      alert(res.message);
      setLoading(false);
      return;
    }
    if (res.data.length === 0 || !res.data) {
      alert("No data found");
      setLoading(false);
      return;
    }

    const header = 
    Object.keys(res.data[0]).filter(
      (key) =>
        key !== "campaign_id" &&
        key !== "linkedin_account_id" &&
        key !== "_id"
    );

    let selected = [];

    for (let i = 0; i < res.data.length; i++) {
      let temp = [];
      for (let j = 0; j < header.length; j++) {
        if (header[j] === "ConnectionRequestSend") {
          temp.push(res.data[i][header[j]] ? "Yes" : "No");
        } else if (header[j] === "InMail") {
          temp.push(res.data[i][header[j]] ? "Yes" : "No");
        } else if (header[j] === "isConnected") {
          temp.push(res.data[i][header[j]] ? "Yes" : "No");
        } else if (header[j] === "isInMail") {
          temp.push(res.data[i][header[j]] ? "Yes" : "No");
        } else if (
          header[j] !== "campaign_id" &&
          header[j] !== "linkedin_account_id" &&
          header[j] !== "_id"
        ) {
          temp.push(res.data[i][header[j]]);
        }
      }
      selected.push(temp);
    }

    downloadAsExcel(selected, header, data.campaign_name);

    setLoading(false);
  }

  async function StopCampaign(data: any) {
    setLoading(true);
    let res = await axios
      .delete(
        CampaignAPI +
          "/stop?" +
          new URLSearchParams({
            uid: user.uid,
            campaign_id: data.campaign_id,
            access_token: user.access_token,
            session: user.session,
            workspace_id: currentWorkspace.workspace_id,
            linkedin_account_id: data.linkedin_account_id,
          })
      )
      .then((res) => res.data)
      .catch((error) => error.response.data);

    if (res.status !== ResStatus.Success) {
      alert(res.message);
    }
    setLoading(false);
  }

  async function duplicateCampaign(data: any) {
    setLoading(true);
    let res = await axios
      .post(
        CampaignAPI +
          "/duplicate",
        {
          uid: user.uid,
          access_token: user.access_token,
          session: user.session,
          campaign_id: data.campaign_id,
          linkedin_account_id: data.linkedin_account_id,
          workspace_id: currentWorkspace.workspace_id,          
        }
      )
      .then((res) => res.data)
      .catch((error) => error.response.data);

    if (res.status !== ResStatus.Success) {
      alert(res.message);
    }
    setLoading(false);
    window.location.reload();
  }

  React.useEffect(() => {
    if (data.searchItems) {
      let total = 0;
      data.searchItems.forEach((item: any) => {
        total += parseInt(item.filter);
      });
      setTotalSearches(total);
    }
  }, [data.searchItems]);

  return (
    <div className="campaign-box box-card p-3 mb-3">
      <div className="camp-head d-flex justify-content-between">
        <div className="camp-head-start d-flex">
          <Form.Check
            type="checkbox"
            name="camp-status-input"
            checked={data.status === Status.Running}
          />

          <div className="ms-2">
            <p className="fw-600 mb-1">
              {data.campaign_name} - {toTitleCase(data.status)}
            </p>
            <div className="d-flex flex-wrap camp-info">
              <p>
                {Math.round((data.Results / totalSearches) * 100)}% complete
              </p>
              <p className="px-2">-</p>
              <p>{new Date(data.created_at).toDateString()}</p>
              <p className="px-2">-</p>
              <p>{data.steps.length} steps</p>
            </div>
          </div>
        </div>
        <div className="camp-head-end d-flex">
          {!isActive && (
            <div className="camp-details d-flex flex-wrap me-5 text-end">
              <div>
                <p>{data.Results || 0}</p>
                <p>Prospects Found</p>
              </div>
              <div>
                <p>{data.ConnectionRequestSend || 0}</p>
                <p>Connected</p>
              </div>
              <div>
                <p>{data.Messages || 0}</p>
                <p>Messages Sent</p>
              </div>
              <div>
                <p>{data.Likes || 0}</p>
                <p>Liked</p>
              </div>
              <div>
                <p>{data.InMail || 0}</p>
                <p>Inmails Sent</p>
              </div>
            </div>
          )}
          <div className="camp-actions d-flex flex-wrap jusitfy-content-end">
            {/* <button
              className="me-2 mb-1 btn btn-primary2 min-h-[unset] px-[12px] h-[unset]"
              onClick={() => SetIsActive(!isActive)}
            >
              <FiChevronDown size={18} />
            </button> */}
            {/* <button
              className="me-2 mb-1 btn btn-primary2 min-h-[unset] px-[12px] h-[unset]"
              // onClick={() => handleEdit(data)}
            >
              <MdOutlineEdit size={18} />
            </button> */}
            <Dropdown>
              <Dropdown.Toggle className="me-2 mb-1 btn btn-primary2 min-h-[unset] px-[12px] h-[unset]">
                <BiDotsVerticalRounded size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-menu shadow-sm">
                <Dropdown.Item className="link d-flex no-underline">
                  <FiUsers size={18} />
                  <p>Check Prospects</p>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => duplicateCampaign(data)}
                  className="link d-flex no-underline">
                  <HiOutlineDuplicate size={18}
                  />
                  <p>Dulicate Campaign</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex no-underline">
                  <MdOutlineChat size={18} />
                  <p>Open Chat</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex no-underline"
                  onClick={() => exportData(data)}
                >
                  <FiDownload size={18} />
                  <p>Export Data</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex no-underline"
                  onClick={() => StopCampaign(data)}
                >
                  <AiOutlineDelete size={18} />
                  <p>Stop Campaign</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex no-underline"
                  onClick={() =>
                    startCampaign(data.campaign_id, data.linkedin_account_id)
                  }
                >
                  <MdOutlineReplay size={18} />
                  <p>Rerun Searches</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex no-underline"
                  onClick={() =>
                    deleteCampaign(data.campaign_id, data.linkedin_account_id)
                  }
                >
                  <AiOutlineDelete size={18} />
                  <p>Delete Campaign</p>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
