import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { Tabs, Tab, Modal } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import Searchbar from "../Inputs/Searchbar";
import { getRecord, createRecord } from "../../Config/apiFunctions";
import { useQuery, useMutation } from "react-query";
import CampaignBox from "./CampaignBox";
import { useNavigate } from "react-router-dom";
import Pagination from "../UI/Pagination";
import Loader from "../UI/Loader";
import { ToastContainer } from "react-toastify";
import routes from "../../Config/routes/api";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import axios from "axios";
const { campaignRoute } = routes;

export default function CampaignsContent({ setSelectedForEdit }) {
  const user = useSelector(selectProfile);
  const [campaigns, setCampaigns] = useState([]);

  const {
    isFetching: campaignsFetching,
    refetch: campaignsRefetch,
    data: campaignsList,
  } = useQuery(["campaigns", user], () => getRecord(`${campaignRoute}`, user), {
    enabled: !!user.token,
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [myCampCurrentItems, setMyCampCurrentItems] = useState([]);
  const [allCampCurrentItems, setAllCampCurrentItems] = useState([]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500);
  // }, [isLoading]);

  useEffect(() => {
    if (!campaignsList) return;

    setCampaigns(campaignsList);
    setIsLoading(false);
  }, [campaignsList]);

  const selectedForDelete = (data) => {
    setIsDeleteModalOpen(true);
    setDeleteId(data.id);
  };

  const deleteCampaignApiCall = async () => {
    return axios.delete(`${campaignRoute}${deleteId}/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  };

  const { mutate } = useMutation(
    deleteCampaignApiCall,
    {
      onSuccess: (res) => {
        console.log("success data: ", res);
        setIsDeleteModalOpen(false);
        window.location.reload();
      },
      onError: (err) => {
        console.log("error data: ", err);
      },
    },
    {}
  );

  const deleteCampaign = () => {
    mutate();
  };
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
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Close
          </Button>
          <Button variant="danger" onClick={deleteCampaign}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row g-0">
        <div className="col-md-12">
          <div className="content-top d-flex justify-content-between">
            <Searchbar />
            <Button
              variant="primary"
              onClick={() => navigate("/campaigns/create")}
            >
              Add New <AiOutlinePlus size={18} />
            </Button>
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
                      myCampCurrentItems.map(function (item) {
                        return (
                          <CampaignBox
                            key={item.id}
                            data={item}
                            campaignsRefetch={campaignsRefetch}
                            setSelectedForEdit={setSelectedForEdit}
                            selectedForDelete={selectedForDelete}
                          />
                        );
                      })
                    )}
                    {campaigns.length > 0 && (
                      <div className="d-flex justify-content-end">
                        <Pagination
                          data={campaigns}
                          setCurrentItems={setMyCampCurrentItems}
                        />
                      </div>
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
                      allCampCurrentItems.map(function (item) {
                        return (
                          <CampaignBox
                            key={item.id}
                            data={item}
                            campaignsRefetch={campaignsRefetch}
                            setSelectedForEdit={setSelectedForEdit}
                            selectedForDelete={selectedForDelete}
                          />
                        );
                      })
                    )}
                    {campaigns.length > 0 && (
                      <div className="d-flex justify-content-end">
                        <Pagination
                          data={campaigns}
                          setCurrentItems={setAllCampCurrentItems}
                        />
                      </div>
                    )}
                  </>
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
}
