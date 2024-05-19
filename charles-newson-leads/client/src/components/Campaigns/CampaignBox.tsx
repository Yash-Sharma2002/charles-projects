import React, { useState } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import { FiChevronDown, FiUsers, FiDownload } from "react-icons/fi";
import { MdOutlineEdit, MdOutlineReplay, MdOutlineChat } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import axios from "axios";
import { HiOutlineDuplicate } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import CustomProgressBar from "../input/CustomProgressBar";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../context/Context";
import { BASE_URL } from "../../constants/api";
import * as XLSX from "xlsx";
import toTitleCase from "../../functions/toTitle";

export default function CampaignBox({
  data,
  campaignsRefetch,
  setSelectedForEdit,
  selectedForDelete,
}: any) {
  const [isActive, SetIsActive] = useState(false);
  const [campaignRunning, SetCampaignRunning] = useState(
    data.status === "running"
  );
  const { user, setLoading } = React.useContext(AppContext);
  const navigate = useNavigate();

  const [totalSearches, setTotalSearches] = React.useState(0);

  const [peopleConnected, setPeopleConnected] = useState(0);


  const updateCampaign = async (e: any, data: any) => {
    try {
      SetCampaignRunning(e.target.checked);

      // openSnackbar("Updating Campaign Status...");

      // await updateRecord({
      //   url: `${campaignRoute}${data.id}/`,
      //   values: { status: e.target.checked ? "running" : "Stopped" },
      //   user,
      // });

      if (e.target.checked) {
        // await createRecord({
        //   values: {},
        //   url: `${triggerCampaignRoute}${data.id}/`,
        //   user,
        // });
      }

      // openSnackbar("Campaign Status Updated.");
    } catch (err) {
      SetCampaignRunning(!e.target.checked);
      // openSnackbar(
      //   "Sorry, something we weren't able to update the campaign status."
      // );
    }

    campaignsRefetch();
  };

  const handleEdit = (data: any) => {
    setSelectedForEdit(data);
    // navigate("/campaigns/edit");
  };

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
        BASE_URL +
          "/get-campaigns-results?" +
          new URLSearchParams({
            uid: user.uid,
            campaign_id: data.campaign_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data);

    if (res.message) {
      alert(res.message);
      setLoading(false);
      return;
    }
    if (res.data.results.length === 0 || !res.data.results) {
      alert("No data found");
      setLoading(false);
      return;
    }

    const header = Object.keys(res.data.results[0]);

    let selected = [];

    for (let i = 0; i < res.data.results.length; i++) {
      selected.push(Object.values(res.data.results[i]));
    }
    downloadAsExcel(selected, header, data.name);

    setLoading(false);
  }

  async function reRunCampaign(data: any) {
    setLoading(true);
    let res = await axios
      .get(
        BASE_URL +
          "/re-run-campaigns?" +
          new URLSearchParams({
            uid: user.uid,
            campaign_id: data.campaign_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data);

    if (res.message !== "Campaign started successfully") {
      alert(res.message);
    }

    campaignsRefetch();
    setLoading(false);
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
          {/* {data.status === "running" ? */}
          <Form.Check
            // onClick={(e) => updateCampaign(e, data)}
            type="checkbox"
            name="camp-status-input"
            checked={campaignRunning}
          />

          <div className="ms-2">
            <p className="fw-600 mb-1">
              {data.name} - {toTitleCase(data.status)}
            </p>
            <div className="d-flex flex-wrap camp-info">
              <p>
                {Math.round((data.progress / totalSearches) * 100)}% complete
              </p>
              <p className="px-2">-</p>
              <p>{data.created_at}</p>
              <p className="px-2">-</p>
              <p>{data.steps.length} steps</p>
            </div>
          </div>
        </div>
        <div className="camp-head-end d-flex">
          {!isActive && (
            <div className="camp-details d-flex flex-wrap me-5 text-end">
              <div>
                <p>{data?.progress}</p>
                <p>Prospects Found</p>
              </div>
              <div>
                <p>{data.connected_people || 0}</p>
                <p>Connected</p>
              </div>
              <div>
                <p>{data.message_send || 0}</p>
                <p>Messages Sent</p>
              </div>
              <div>
                <p>{data.liked || 0}</p>
                <p>Liked</p>
              </div>
              <div>
                <p>{data.immail_sent || 0}</p>
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
            <button
              className="me-2 mb-1 btn btn-primary2 min-h-[unset] px-[12px] h-[unset]"
              onClick={() => handleEdit(data)}
            >
              <MdOutlineEdit size={18} />
            </button>
            <Dropdown>
              <Dropdown.Toggle className="me-2 mb-1 btn btn-primary2 min-h-[unset] px-[12px] h-[unset]">
                <BiDotsVerticalRounded size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-menu shadow-sm">
                <Dropdown.Item className="link d-flex no-underline">
                  <FiUsers size={18} />
                  <p>Check Prospects</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex no-underline">
                  <HiOutlineDuplicate size={18} />
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
                  onClick={() => reRunCampaign(data)}
                >
                  <MdOutlineReplay size={18} />
                  <p>Rerun Searches</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex no-underline"
                  onClick={() => selectedForDelete(data)}
                >
                  <AiOutlineDelete size={18} />
                  <p>Delete Campaign</p>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
      {/* {isActive && (
        <div className="camp-body mt-3 pt-3 d-flex justify-content-between align-item-center">
          <div className="camp-progress-details d-flex justify-content-center align-item-center">
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={(
                  (data.total_connection_request_sent /
                    data.crawl_total_prospects) *
                  100
                ).toString()}
              />
              <p className="fw-600 mb-0">Connection</p>
              <table>
                <tbody>
                  <tr>
                    <td>Sent:</td>
                    <td>{data.total_connection_request_sent}</td>
                  </tr>
                  <tr>
                    <td>Accpeted:</td>
                    <td>{data.total_connection_request_accepted}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={(
                  (data.inmail_sent / data.crawl_total_prospects) *
                  100
                ).toString()}
              />
              <p className="fw-600 mb-0">Inmails</p>
              <table>
                <tbody>
                  <tr>
                    <td>Sent:</td>
                    <td>{data.inmail_sent}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={(
                  (data.message_sent / data.crawl_total_prospects) *
                  100
                ).toString()}
              />
              <p className="fw-600 mb-0">Messages</p>
              <table>
                <tbody>
                  <tr>
                    <td>Sent:</td>
                    <td>{data.message_sent}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={(
                  (data.followed / data.crawl_total_prospects) *
                  100
                ).toString()}
              />
              <p className="fw-600 mb-0">Follow</p>
              <table>
                <tbody>
                  <tr>
                    <td>Followed:</td>
                    <td>{data.followed}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={(
                  (data.endorsed / data.crawl_total_prospects) *
                  100
                ).toString()}
              />
              <p className="fw-600 mb-0">Endorse</p>
              <table>
                <tbody>
                  <tr>
                    <td>Endorsed:</td>
                    <td>{data.endorsed}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
