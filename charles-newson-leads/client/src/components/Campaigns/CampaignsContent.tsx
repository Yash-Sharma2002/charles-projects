import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Tabs, Tab, Modal } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import Searchbar from "../input/Searchbar";
import CampaignBox from "./CampaignBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/Context";
import Loader from "../loader/Loader";
import { BASE_URL } from "../../constants/api";

export default function CampaignsContent({ setSelectedForEdit }: any) {
  const { user, currentWorkspace } = React.useContext(AppContext);
  const [campaigns, setCampaigns] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [myCampCurrentItems, setMyCampCurrentItems] = useState([]);
  const [allCampCurrentItems, setAllCampCurrentItems] = useState([]);

  const getCampaigns = React.useRef(() => {});

  getCampaigns.current = async () => {
    setIsLoading(true);
    try {
      const response = await axios
        .get(
          BASE_URL +
            "/get-campaigns?" +
            new URLSearchParams({
              uid: user.uid,
              workspace_id: currentWorkspace.workspace_id,
              access_token: user.access_token,
              session: user.session,
            })
        )
        .then((res) => res.data);

      let activeCampaigns = response.data.filter(
        (item: any) => item.status === "running"
      );

      let inactiveCampaigns = response.data.filter(
        (item: any) => item.status !== "running"
      );

      setCampaigns(response.data);
      setMyCampCurrentItems(activeCampaigns);
      setAllCampCurrentItems(inactiveCampaigns);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCampaigns.current();
  }, []);

  const selectedForDelete = (data: any) => {
    setIsDeleteModalOpen(true);
    setDeleteId(data.campaign_id);
  };

  async function deleteCampaign() {
    setIsLoading(true);
    try {
      await axios
        .delete(
          BASE_URL +
            "/delete-campaign?" +
            new URLSearchParams({
              uid: user.uid,
              workspace_id: currentWorkspace.workspace_id,
              access_token: user.access_token,
              session: user.session,
              campaign_id: deleteId,
            })
        )
        .then((res) => res.data);
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      getCampaigns.current();
      return;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <div className="campaigns-content">
      <Modal
        show={isDeleteModalOpen}
        onHide={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this campaign?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary max-h-[unset] h-[unset] capitalize"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Close
          </button>
          <button
            className="btn btn-red max-h-[unset] h-[unset] capitalize"
            onClick={deleteCampaign}
          >
            Delete
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
                            campaignsRefetch={getCampaigns.current}
                            setSelectedForEdit={setSelectedForEdit}
                            selectedForDelete={selectedForDelete}
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
                            campaignsRefetch={getCampaigns.current}
                            setSelectedForEdit={setSelectedForEdit}
                            selectedForDelete={selectedForDelete}
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
