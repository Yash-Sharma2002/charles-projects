import React, { useState, useEffect, useMemo } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import { FiChevronDown, FiUsers, FiDownload } from "react-icons/fi";
import { MdOutlineEdit, MdOutlineReplay, MdOutlineChat } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import Moment from "moment";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import { HiOutlineDuplicate } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import CustomProgressBar from "../Inputs/CustomProgressBar";
import { useNavigate, Link } from "react-router-dom";
import routes from "../../Config/routes/api";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import {
  getRecord,
  createRecord,
  updateRecord,
} from "../../Config/apiFunctions";
import { useSnackbar } from "react-simple-snackbar";

const { campaignRoute, triggerCampaignRoute } = routes;

export default function CampaignBox({
  data,
  campaignsRefetch,
  setSelectedForEdit,
  selectedForDelete,
}) {
  const [isActive, SetIsActive] = useState(false);
  const [campaignRunning, SetCampaignRunning] = useState(
    data.status === "Running"
  );
  const user = useSelector(selectProfile);
  const navigate = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar();

  const updateCampaign = async (e) => {
    try {
      SetCampaignRunning(e.target.checked);

      openSnackbar("Updating Campaign Status...");

      await updateRecord({
        url: `${campaignRoute}${data.id}/`,
        values: { status: e.target.checked ? "Running" : "Stopped" },
        user,
      });

      if (e.target.checked) {
        await createRecord({
          values: {},
          url: `${triggerCampaignRoute}${data.id}/`,
          user,
        });
      }

      openSnackbar("Campaign Status Updated.");
    } catch (err) {
      SetCampaignRunning(!e.target.checked);
      openSnackbar(
        "Sorry, something we weren't able to update the campaign status."
      );
    }

    campaignsRefetch();
  };

  const handleEdit = (data) => {
    setSelectedForEdit(data);
    navigate("/campaigns/edit");
  };

  return (
    <div className="campaign-box box-card p-3 mb-3">
      <div className="camp-head d-flex justify-content-between">
        <div className="camp-head-start d-flex">
          {/* {data.status === "Running" ? */}
          <Form.Check
            onClick={(e) => updateCampaign(e, data)}
            type="checkbox"
            name="camp-status-input"
            checked={campaignRunning}
          />

          <div className="ms-2">
            <p className="fw-600 mb-1">{data.name}</p>
            <div className="d-flex flex-wrap camp-info">
              <p>{data.progress}% complete</p>
              <p className="px-2">-</p>
              <p>{Moment(data.created_at).fromNow()}</p>
              <p className="px-2">-</p>
              <p>{data.total_steps_count} steps</p>
            </div>
          </div>
        </div>
        <div className="camp-head-end d-flex">
          {!isActive && (
            <div className="camp-details d-flex flex-wrap me-5 text-end">
              <div>
                <p>{data?.total_prospects_fully_crawled}</p>
                <p>Prospects Found</p>
              </div>
              <div>
                <p>{data?.total_connection_request_accepted}</p>
                <p>Connected</p>
              </div>
              <div>
                <p>{data?.message_sent}</p>
                <p>Messages Sent</p>
              </div>
              <div>
                <p>{data.inmail_sent}</p>
                <p>Inmails Sent</p>
              </div>
            </div>
          )}
          <div className="camp-actions d-flex flex-wrap jusitfy-content-end">
            <Button
              variant="action"
              className="me-2 mb-1"
              onClick={() => SetIsActive(!isActive)}
            >
              <FiChevronDown size={18} />
            </Button>
            <Button
              variant="action"
              className="me-2 mb-1"
              onClick={() => handleEdit(data)}
            >
              <MdOutlineEdit size={18} />
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="action">
                <BiDotsVerticalRounded size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-menu shadow-sm">
                <Dropdown.Item className="link d-flex">
                  <FiUsers size={18} />
                  <p>Check Prospects</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex">
                  <HiOutlineDuplicate size={18} />
                  <p>Dulicate Campaign</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex">
                  <MdOutlineChat size={18} />
                  <p>Open Chat</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex">
                  <FiDownload size={18} />
                  <p>Export Data</p>
                </Dropdown.Item>
                <Dropdown.Item className="link d-flex">
                  <MdOutlineReplay size={18} />
                  <p>Rerun Searches</p>
                </Dropdown.Item>
                <Dropdown.Item
                  className="link d-flex"
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
      {isActive && (
        <div className="camp-body mt-3 pt-3 d-flex justify-content-between align-item-center">
          <div className="camp-progress-details d-flex justify-content-center align-item-center">
            <div className="camp-progress-item me-5">
              <CustomProgressBar
                value={
                  (data.total_connection_request_sent /
                    data.crawl_total_prospects) *
                  100
                }
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
                value={(data.inmail_sent / data.crawl_total_prospects) * 100}
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
                value={(data.message_sent / data.crawl_total_prospects) * 100}
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
                value={(data.followed / data.crawl_total_prospects) * 100}
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
                value={(data.endorsed / data.crawl_total_prospects) * 100}
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
      )}
    </div>
  );
}
