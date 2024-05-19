import React, { useState, useRef } from "react";
import { HiDownload } from "react-icons/hi";
import { Dropdown, Button, Form, Accordion, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { BsMegaphone, BsBarChart, BsReply } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { AiOutlineUser, AiOutlineEye } from "react-icons/ai";

import PipelineItem from "./PipelineItem";
import { AppContext } from "../../context/Context";
import { BASE_URL } from "../../constants/api";
import Searchbar from "../input/Searchbar";
import Loader from "../loader/Loader";

// @ts-ignore
import Papa from "papaparse";

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

  const [campaignsData, setCampaignsData] = useState([]);
  const [pipelineCurrentItems, setPipelineCurrentItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any>([]);

  const getCampaignResults = React.useRef(() => {});

  getCampaignResults.current = async () => {
    setIsLoading(true);
    try {
      const response = await axios
        .get(
          BASE_URL +
            "/get-campaigns-all-results?" +
            new URLSearchParams({
              workspace_id: currentWorkspace.workspace_id,
              uid: user.uid,
              access_token: user.access_token,
              session: user.session,
            })
        )
        .then((response) => response.data.data);

      setCampaignsData(response);

      let allCampaigns: any = [];
      let allResults: any = [];

      response.forEach((campaign: any) => {
        allCampaigns.push({
          campaign_id: campaign.campaign.campaign_id,
          name: campaign.campaign.name,
        });

        if (campaign.results.length > 0) {
          campaign.results.forEach((result: any) => {
            allResults.push({
              name: result.FirstName + " " + result.LastName,
              linkedin_avatar: result.profileimage,
              occupation: result.UserTitle,
              profileUrl: result.profileLink,
              campaign: campaign.campaign.name,
              campaign_id: campaign.campaign.campaign_id,
              address: result.address ? result.address : "Not Available",
              statuses: result.statuses ? result.statuses : "Not Available",
              enriched_email: result.enriched_email
                ? result.enriched_email
                : "Not Enriched",
              work_email: result.work_email
                ? result.work_email
                : "Not Available",
              campaign_status: campaign.campaign.status
                ? campaign.campaign.status
                : "Not Available",
            });
          });
        }
      });

      setFilteredItems(allResults);
      setPipelineCurrentItems(allResults);
      setCampaigns(allCampaigns);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  function applySelection() {
    setFilteredItems(pipelineCurrentItems.slice(0, peopleCount));
  }

  const statuses = [
    {
      id: "23",
      title: "Running",
    },
    {
      id: "24",
      title: "Completed",
    },
    {
      id: "25",
      title: "Stopped",
    },
    {
      id: "26",
      title: "Error",
    },
  ];

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
        item.linkedin_avatar,
        item.name,
        item.occupation,
        item.address,
        item.statuses,
        item.enriched_email,
        item.work_email,
        item.profileUrl,
      ].join(",");
    });
    const dummyHeader = [
      "Photo",
      "Name",
      "Position / Company",
      // "Company",
      "Address",
      "Statuses",
      "Enriched Email",
      "Work / Personal Email",
      "Profile Link",
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
        console.log(item);
        return item.campaign_id === campaignSelected.campaign_id;
      });
    }

    // if(statusesSelected.length>0  ){
    //   itemsList= pipelineCurrentItems.filter((item: any) => {
    //     console.log(statusesSelected.includes(item.campaign_status  as never))
    //     return statusesSelected.includes(item.campaign_status  as never);
    //   });
    // }else{
    //   itemsList = filteredItems
    // }

    setFilteredItems(itemsList);
  }

  function selectStatus(value: string) {
    console.log(statusesSelected.includes(value), statusesSelected, value);

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
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Position / Company</th>
                            {/* <th>Company</th> */}
                            <th>Address</th>
                            <th>Statuses</th>
                            <th>Enriched Email</th>
                            <th>Work / Personal Email</th>
                            <th>Profile Link</th>
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
                      {statuses.map((item) => {
                        return (
                          <Form.Check
                            key={item.id}
                            type="checkbox"
                            id={"period-" + item.id}
                            onClick={() =>
                              selectStatus(item.title.toLowerCase())
                            }
                            name={"periods"}
                            label={item.title}
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
