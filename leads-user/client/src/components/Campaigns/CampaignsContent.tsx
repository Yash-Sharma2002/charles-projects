import React, { useEffect, useState } from "react";
import { Tabs, Tab, Modal } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import Searchbar from "../input/Searchbar";
import CampaignBox from "./CampaignBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/Context";
import Loader from "../loader/Loader";
import {  CampaignAPI } from "../../constants/api";
import ResStatus from "../../constants/ResStatus";
import Status from "../../constants/Status";

export default function CampaignsContent({ setSelectedForEdit }: any) {
  const { user, currentWorkspace, setLoading } = React.useContext(AppContext);
  const [campaigns, setCampaigns] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [detailsId, setDetailsId] = useState({
    type: "",
    campaign_id: "",
    linkedin_account_id: "",
  });

  const [myCampCurrentItems, setMyCampCurrentItems] = useState([]);
  const [allCampCurrentItems, setAllCampCurrentItems] = useState([]);

  const getCampaigns = React.useRef(() => {});

  getCampaigns.current = async () => {
    setIsLoading(true);
    try {
      const response = await axios
        .get(
          CampaignAPI +
            "/get?" +
            new URLSearchParams({
              uid: user.uid,
              workspace_id: currentWorkspace.workspace_id,
              access_token: user.access_token,
              session: user.session,
            })
        )
        .then((res) => res.data)
        .catch((error) => error.response.data);

      if (response.status !== ResStatus.Success) {
        alert(response.message);
        return;
      }

      let activeCampaigns = response.data.filter(
        (item: any) => item.status === Status.Running
      );

      let inactiveCampaigns = response.data.filter(
        (item: any) => item.status !== Status.Running
      );

      setCampaigns(response.data);
      setMyCampCurrentItems(activeCampaigns);
      setAllCampCurrentItems(inactiveCampaigns);
    } catch (error: any) {
      alert(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCampaigns.current();
  }, []);

  const selectedForDelete = (
    campaign_id: string,
    linkedin_account_id: string
  ) => {
    setIsDeleteModalOpen(true);
    setDetailsId({
      type: "delete",
      campaign_id: campaign_id,
      linkedin_account_id: linkedin_account_id,
    });
  };

  const selectedForStart = (
    campaign_id: string,
    linkedin_account_id: string
  ) => {
    setIsDeleteModalOpen(true);
    setDetailsId({
      type: "start",
      campaign_id: campaign_id,
      linkedin_account_id: linkedin_account_id,
    });
  };

  async function deleteCampaign() {
    setIsLoading(true);
    try {
      let response = await axios
        .delete(
          CampaignAPI +
            "/delete?" +
            new URLSearchParams({
              uid: user.uid,
              workspace_id: currentWorkspace.workspace_id,
              access_token: user.access_token,
              session: user.session,
              campaign_id: detailsId.campaign_id,
              linkedin_account_id: detailsId.linkedin_account_id,
            })
        )
        .then((res) => res.data)
        .catch((error) => error.response.data);

      if (response.status !== ResStatus.Success) {
        alert(response.message);
        return;
      }

      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
    setIsLoading(false);
  }

  async function StartCampaign() {
    setLoading(true);
    try {
      let api = axios.create({
        timeout: 240000,
      });

      let response = await api
        .post(CampaignAPI + "/start", {
          uid: user.uid,
          workspace_id: currentWorkspace.workspace_id,
          access_token: user.access_token,
          session: user.session,
          campaign_id: detailsId.campaign_id,
          linkedin_account_id: detailsId.linkedin_account_id,
        })
        .then((res) => res.data)
        .catch((error) => error.response.data);

      if (response.status !== ResStatus.Success) {
        alert(response.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="campaigns-content">
      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="capitalize">{detailsId.type}</span> Campaign
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to {detailsId.type} this campaign?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary max-h-[unset] h-[unset] capitalize"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Close
          </button>
          <button
            className="btn btn-red max-h-[unset] h-[unset] capitalize"
            onClick={
              detailsId.type === "delete" ? deleteCampaign : StartCampaign
            }
          >
            {detailsId.type}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="row g-0">
        <div className="col-md-12">
          <div className="content-top d-flex justify-content-between">
            <Searchbar />
            <button
              className="btn btn-primary2 min-h-[unset] h-[unset] mt-6"
              onClick={() => navigate("/campaigns/create")}
            >
              Add New <AiOutlinePlus size={18} />
            </button>
          </div>
          <div className="content-section main-bg p-4 mt-3 custom-scrollbar">
            <Tabs
              defaultActiveKey="my-camps"
              id="campaigns-tabs"
              className="custom-tabs pb-3"
            >
              <Tab eventKey="my-camps" title="My Campaigns">
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {campaigns.length === 0 ? (
                      <div className="no-data d-flex align-items-center justify-content-center">
                        <p>No Campaigns</p>
                      </div>
                    ) : (
                      myCampCurrentItems.map((item: any, index: number) => {
                        return (
                          <CampaignBox
                            key={index}
                            data={item}
                            startCampaign={selectedForStart}
                            deleteCampaign={selectedForDelete}
                          />
                        );
                      })
                    )}
                  </>
                )}
              </Tab>
              <Tab eventKey="all-camps" title="All Campaigns">
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {campaigns.length === 0 ? (
                      <div className="no-data d-flex align-items-center justify-content-center">
                        <p>No Campaigns</p>
                      </div>
                    ) : (
                      allCampCurrentItems.map((item: any, index: number) => {
                        return (
                          <CampaignBox
                          key={index}
                          data={item}
                          startCampaign={selectedForStart}
                          deleteCampaign={selectedForDelete}
                          />
                        );
                      })
                    )}
                  </>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
