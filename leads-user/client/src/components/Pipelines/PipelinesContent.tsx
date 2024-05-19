import React, { useState, useRef } from "react";
import { HiDownload } from "react-icons/hi";
import { Dropdown, Button, Form, Accordion, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { BsMegaphone, BsBarChart, BsReply } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { AiOutlineUser, AiOutlineEye } from "react-icons/ai";

import PipelineItem from "./PipelineItem";
import { AppContext } from "../../context/Context";
import { BASE_URL, CampaignAPI } from "../../constants/api";
import Searchbar from "../input/Searchbar";
import Loader from "../loader/Loader";

// @ts-ignore
import Papa from "papaparse";
import ResStatus from "../../constants/ResStatus";

export default function PipelinesContent() {
  const { user, currentWorkspace } = React.useContext(AppContext);
  const [peopleCount, setPeopleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [prospects, setProspects] = useState([]);
  const [campaigns, setCampaigns] = useState<any>([]);
  const [labels, setLabels] = useState([]);
  const [campaignSelected, setCampaignSelected] = useState<any>({});
  const [labelSelected, setLabelSelected] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusesSelected, setStatusesSelected] = useState<any>([]);
  const [statuses, setStatuses] = useState(["All"]);

  const [campaignsData, setCampaignsData] = useState([]);
  const [pipelineCurrentItems, setPipelineCurrentItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any>([]);

  const getCampaignResults = React.useRef(() => {});

  getCampaignResults.current = async () => {
    setIsLoading(true);
    try {
      const res = await axios
        .get(
          CampaignAPI +
            "/pipeline?" +
            new URLSearchParams({
              workspace_id: currentWorkspace.workspace_id,
              uid: user.uid,
              access_token: user.access_token,
              session: user.session,
            })
        )
        .then((response) => response.data)
        .catch((error) => error.response.data);

      if (res.status !== ResStatus.Success) {
        alert(res.message);
        setIsLoading(false);
        return;
      }

      setCampaignsData(res.data);

      let allCampaigns: any = [];
      let allResults: any = [];
      let allStatuses: any = [];

      res.data.forEach((campaign: any) => {

        if(allCampaigns.filter((item: any) => item.campaign_id === campaign.campaign_id).length === 0){
          allCampaigns.push({
            campaign_id: campaign.campaign_id,
            name: campaign.campaign_name
          })
        }
        

        if(allStatuses.indexOf(campaign.status) === -1){
          allStatuses.push(campaign.status)
        }

        console.log(campaign);

        allResults.push({
          Id: campaign.Id,
          ProfileImage: campaign.ProfileImage,
          ProfileLink: campaign.ProfileLink,
          FirstName: campaign.FirstName,
          LastName: campaign.LastName,
          Company: campaign.Company,
          Position: campaign.Position,
          Title: campaign.Title,
          Email: campaign.Email,
          Address: campaign.Address,
          Campaign: campaign.campaign_name,
          isConnected: campaign.isConnected,
          ConnectionMessage: campaign.ConnectionMessage,
          ConnectionRequestSend: campaign.ConnectionRequestSend,
          Likes: campaign.Likes,
          isMessage: campaign.isMessage,
          message: campaign.message,
          isInMail: campaign.isInMail,
          inmail: campaign.inmail,
          campaign_id: campaign.campaign_id,
        });
      });


      setFilteredItems(allResults);
      setPipelineCurrentItems(allResults);
      setCampaigns(allCampaigns);
      setStatuses(["All", ...allStatuses]);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  function applySelection() {
    setFilteredItems(pipelineCurrentItems.slice(0, peopleCount));
  }

  const profileOptions = [
    {
      id: "30",
      title: "Default",
    },
    {
      id: "31",
      title: "Opened",
    },
    {
      id: "32",
      title: "Closed",
    },
  ];

  const viewedOptions = [
    {
      id: "33",
      title: "Default",
    },
    {
      id: "34",
      title: "Viewed",
    },
    {
      id: "35",
      title: "Not Viewed",
    },
  ];

  function downloadAsCsv() {
    const data = filteredItems.map((item: any, idx: number) => {
      return [
        item.ProfileImage,
        item.FirstName,
        item.LastName,
        item.Company,
        item.Position,
        item.Title,
        item.Email || "",
        item.Address,
        item.Campaign,
        item.isConnected,
        item.ConnectionRequestSend,
        item.ConnectionMessage,
        item.Likes,
        item.isMessage,
        item.message,
        item.isInMail,
        item.inmail,
        item.ProfileLink,
      ].join(",");
    });
    const dummyHeader = [
      "Photo",
      "First Name",
      "Last Name",
      "Company",
      "Position",
      "Title",
      "Email",
      "Address",
      "Campaign",
      "Is Connected",
      "Connection Request Send",
      "Connection Message",
      "Likes",
      "Is Message",
      "Message",
      "Is InMail",
      "Inmail",
      "Profile Link"
    ];
    data.unshift(dummyHeader.join(","));
    const csv = data.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function selectMainFilter() {
    let itemsList = filteredItems;


    if (campaignSelected.campaign_id) {
      itemsList = pipelineCurrentItems.filter((item: any) => {
        return item.campaign_id === campaignSelected.campaign_id;
      });
    }


    // if(statusesSelected.length>0  ){
    //   itemsList= pipelineCurrentItems.filter((item: any) => {
    //     return statusesSelected.includes(item.status  as never);
    //   });
    // }else{
    //   itemsList = filteredItems
    // }

    setFilteredItems(itemsList);
  }

  function selectStatus(value: string) {

    if (statusesSelected.includes(value)) {
      setStatusesSelected(
        statusesSelected.filter((item: any) => {
          return item !== value;
        })
      );
    } else {
      setStatusesSelected([...statusesSelected, value]);
    }
  }

  React.useEffect(() => {
    getCampaignResults.current();
  }, [user]);

  return (
    <div className="pipelines-content">
      <div className="row g-0">
        <div className="col-md-12">
          <div className="content-top d-flex justify-content-end mb-3">
            <Dropdown className="people-count-filter mt-6 " autoClose="outside">
              <Dropdown.Toggle
                variant="primary"
                className="filter-dropdown me-2"
              >
                <span>{peopleCount}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-2">
                <div className="d-flex align-items-center mb-2">
                  <Form.Label className="me-2 flex-grow-1">
                    Select no. of people
                  </Form.Label>
                  <Form.Control
                    type="number"
                    onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                    name="select-people-count"
                  />
                </div>
                <button
                  className="btn w-full btn-primary2 min-h-[unset] h-[unset]"
                  onClick={applySelection}
                  // disabled={isLoading}
                >
                  Apply Selection
                </button>
              </Dropdown.Menu>
            </Dropdown>
            <Searchbar />
            <button
              className="btn ml-3 btn-primary2 min-h-[unset] h-[unset] mt-6 "
              // disabled={isLoading}
              onClick={downloadAsCsv}
            >
              Export as CSV <HiDownload size={18} />
            </button>
          </div>
          <div className="row g-0">
            <div className="col-md-9">
              <div className="content-section main-bg p-4 me-3 custom-scrollbar">
                <Tabs
                  defaultActiveKey="my-pipes"
                  id="pipelines-tabs"
                  className="custom-tabs pb-3"
                >
                  <Tab eventKey="my-pipes" title="My Pipelines">
                    <div className="table-responsive scroll-hide">
                      <table className="table table-borderless align-middle pipelines-table">
                        <thead>
                          <tr>
                          <th className="!relative">Photo</th>
                            {/* <th>Profile</th> */}
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company</th>
                            <th>Position</th>
                            <th>Title</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Campaign</th>
                            <th>Is Connected</th>
                            <th>Connection Request Send</th>
                            <th>Connection Message</th>
                            <th>Likes</th>
                            <th>Is Message</th>
                            <th>Message</th>
                            <th>Is InMail</th>
                            <th>InMail</th>
                            <th>Link</th>

                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <tr className="no-data">
                              <td colSpan={6}>
                                <Loader />
                              </td>
                            </tr>
                          ) : (
                            <>
                              {filteredItems.length === 0 ? (
                                <tr className="no-data">
                                  <td colSpan={6}>
                                    <p>No Prospects</p>
                                  </td>
                                </tr>
                              ) : (
                                filteredItems.map(
                                  (prospect: any, index: number) => {
                                    return (
                                      <PipelineItem
                                        key={index}
                                        data={prospect}
                                        items={pipelineCurrentItems}
                                        setItems={setPipelineCurrentItems}
                                      />
                                    );
                                  }
                                )
                              )}
                            </>
                          )}
                        </tbody>
                      </table>
                      {!isLoading && prospects.length > 10 && (
                        <div className="d-flex justify-content-end">
                          {/* <Pagination
                                data={prospects}
                                setCurrentItems={setPipelineCurrentItems}
                                /> */}
                        </div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
            <div className="col-md-3">
              <div className="filter-section main-bg p-3 custom-scrollbar">
                <p className="fw-600">Filters</p>
                <Accordion className="mt-2" flush>
                  <Accordion.Item eventKey="3-0" className="mb-2">
                    <Accordion.Header>
                      <IoPricetagOutline size={17} className="me-3" /> Labels
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Check
                        type="radio"
                        id="all-labels"
                        name="labels"
                        defaultChecked
                        onChange={(e) => setLabelSelected({})}
                        label="Show Prospects From All Labels"
                      />
                      {labels.map((label: any, index) => {
                        return (
                          <Form.Check
                            key={index}
                            type="radio"
                            onClick={(e) => setLabelSelected(label)}
                            id={`labels-${index}`}
                            name="labels"
                            label={label.name}
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3-1" className="mb-2">
                    <Accordion.Header>
                      <BsMegaphone size={15} className="me-3" /> Campaigns
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Check
                        type="radio"
                        id="all-campaigns"
                        name="campaigns"
                        defaultChecked
                        onChange={(e) => setCampaignSelected({})}
                        label="Show Prospects From All Campaigns"
                      />
                      {campaigns.map((campaign: any, index: number) => {
                        return (
                          <Form.Check
                            key={index}
                            type="radio"
                            onClick={(e) => setCampaignSelected(campaign)}
                            id={`campaigns-${index}`}
                            name={"campaigns"}
                            label={campaign.name || ""}
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3-2" className="mb-2">
                    <Accordion.Header>
                      <BsBarChart size={17} className="me-3" /> Statuses
                    </Accordion.Header>
                    <Accordion.Body>
                      {statuses.map((item: string, idx: number) => {
                        return (
                          <Form.Check
                            key={idx}
                            type="checkbox"
                            id={"period-" + idx}
                            onClick={() => selectStatus(item.toLowerCase())}
                            name={"periods"}
                            label={item}
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3-3" className="mb-2">
                    <Accordion.Header>
                      <AiOutlineUser size={17} className="me-3" /> Profile
                      Options
                    </Accordion.Header>
                    <Accordion.Body>
                      {profileOptions.map(function (item) {
                        return (
                          <Form.Check
                            key={item.id}
                            type="checkbox"
                            id={"period-" + item.id}
                            name={"periods"}
                            label={item.title}
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3-4" className="mb-2">
                    <Accordion.Header>
                      <AiOutlineEye size={17} className="me-3" /> Viewed Options
                    </Accordion.Header>
                    <Accordion.Body>
                      {viewedOptions.map(function (item) {
                        return (
                          <Form.Check
                            key={item.id}
                            type="checkbox"
                            id={"period-" + item.id}
                            name={"periods"}
                            label={item.title}
                          />
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3-5" className="mb-2">
                    <Accordion.Header>
                      <BsReply size={17} className="me-3" /> Replied After
                    </Accordion.Header>
                    <Accordion.Body></Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                {/* <Button onClick={(e) => {filter(e)}} variant='primary' className='w-100 p-1'>Apply Filters</Button> */}
                <button
                  className="btn w-full btn-primary2 min-h-[unset] h-[unset]"
                  disabled={isLoading}
                  onClick={selectMainFilter}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
