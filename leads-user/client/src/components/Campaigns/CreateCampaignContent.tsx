import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  AiOutlinePlus,
  AiOutlineLink,
  AiOutlineDelete,
  AiOutlineFile,
} from "react-icons/ai";
import { BiFilter } from "react-icons/bi";
import { MdOutlinePlayArrow } from "react-icons/md";
import RangeSlider from "react-bootstrap-range-slider";
import { useNavigate } from "react-router-dom";
import CampaignSteps from "./CampaignSteps";
import { AppContext } from "../../context/Context";
import InputSelect from "../input/InputSelect";
import InputName from "../input/InputName";
import axios from "axios";
import { CampaignAPI, LinkedAccountAPI } from "../../constants/api";
import UserErrorInterface from "../../interface/UserErrorInterface";
import ResStatus from "../../constants/ResStatus";

export default function CreateCampaignContent({ selectedForEdit }: any) {
  const prefetchedSteps = [];

  if (selectedForEdit && selectedForEdit.total_steps) {
    for (const step of selectedForEdit.total_steps) {
      if (step.step === "send_connection_request") {
        prefetchedSteps.push({
          name: "Send Connection Request",
          msg: step.note,
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_connection_request",
        });
      } else if (step.step === "send_message") {
        prefetchedSteps.push({
          name: "Send Message",
          msg: step.message,
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_message",
        });
      } else if (step.step === "send_inmail") {
        prefetchedSteps.push({
          name: "Send InMail",
          subject: step.inmail_subject,
          msg: step.inmail_message,
          allowCredits: false,
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_inmail",
        });
      } else if (step.step === "like_3_posts") {
        prefetchedSteps.push({
          name: "Perform Action",
          viewProfile: true,
          follow: false,
          likes: false,
          endorse: false,
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "like_3_posts",
        });
      } else if (step.step === "send_connection_by_email") {
        prefetchedSteps.push({
          name: "Send Connection by Email",
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_connection_by_email",
        });
      } else if (step.step === "send_email") {
        prefetchedSteps.push({
          name: "Send Email",
          subject: step.email_subject,
          msg: step.email_message,
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_email",
        });
      } else if (step.step === "enrich_profile") {
        prefetchedSteps.push({
          name: "Enrich Profile",
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "enrich_profile",
        });
      } else if (step.step === "send_webhook") {
        prefetchedSteps.push({
          name: "Send Webhook",
          url: "",
          waitDays: step.delay_in_days,
          waitHours: step.delay_in_hours,
          key: "send_webhook",
        });
      }
    }
  }
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);
  const [campaignName, setCampaignName] = useState(
    selectedForEdit ? selectedForEdit.name : ""
  );

  const [error, setErrors] = React.useState<UserErrorInterface>({
    message: "",
    field: "",
    hasError: false,
  });

  const [steps, setSteps] = useState([]);
  const [campType, setCampType] = useState("1");
  const [premiumAccountOnly, setPremiumAccountOnly] = useState(false);
  const [linkTracking, setLinkTracking] = useState(true);
  const [emailOnly, setEmailOnly] = useState(false);
  const [moveProspects, setMoveProspects] = useState(false);
  const [includeProspects, setIncludeProspects] = useState(false);

  const [activeSearch, setActiveSearch] = useState(1);
  const [searchCount, setSearchCount] = useState(
    selectedForEdit ? selectedForEdit.crawl_total_prospects : 1000
  );
  const [searchItems, setSearchItems] = useState<any>([]);
  const [query, setQuery] = useState(
    selectedForEdit ? selectedForEdit.search_url : ""
  );
  const [filter, setFilter] = useState({
    conn1: false,
    conn2: false,
    conn3: false,
    location: "",
    currComp: "",
  });

  const navigate = useNavigate();

  const ref = useRef<any>(null);

  const { user, currentWorkspace, setLoading } = React.useContext(AppContext);
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState("");

  function handleSubmit() {
    if (!query) {
      setErrors({
        message: "Please enter search query",
        field: "search-query",
        hasError: true,
      });
      return;
    }

    setSearchItems([
      ...searchItems,
      {
        query,
        filter: searchCount,
        type: activeSearch === 1 ? "seach_url" : "navigator_list_url",
      },
    ]);
    setShow(false);
    setQuery("");
    setSearchCount(1000);
    setFilter({
      conn1: false,
      conn2: false,
      conn3: false,
      location: "",
      currComp: "",
    });
  }

  function validateCampaign() {
    if (!campaignName) {
      setErrors({
        message: "Please enter campaign name",
        field: "campaign-name",
        hasError: true,
      });
      return false;
    }

    if (searchItems.length === 0) {
      setErrors({
        message: "Please add atleast one search",
        field: "search-query",
        hasError: true,
      });
      return false;
    }

    if (!selectedLinkedinAccount) {
      setErrors({
        message: "Please select linkedin account",
        field: "linkedin-profile",
        hasError: true,
      });
      return false;
    }

    if (!campType) {
      setErrors({
        message: "Please select campaign type",
        field: "campaign-type",
        hasError: true,
      });
      return false;
    }
    return true;
  }

  const handleShow = () => setShow(!show);

  const handleCancel = () => navigate(-1);

  async function createAndStart() {
    let campaign_id = await saveCampaign(false);
    if (campaign_id) {
      await StartCampaign(campaign_id, selectedLinkedinAccount);
      navigate(-1);
    }
  }

  async function saveCampaign(reload?: boolean) {
    const isValid = validateCampaign();
    if (!isValid) {
      return false;
    }

    if (reload === undefined) reload = true;

    setLoading(true);
    try {
      const response = await axios
        .post(CampaignAPI + "/create", {
          campaign: {
            campaign_name: campaignName,
            campaign_type: campType,
            searchItems: searchItems,
            steps: steps,
            linkedin_account_id: selectedLinkedinAccount,
            uid: user.uid,
            workspace_id: currentWorkspace.workspace_id,
            extras: {
              premiumAccountOnly,
              linkTracking,
              emailOnly,
              moveProspects,
              includeProspects,
            },
          },
          uid: user.uid,
          access_token: user.access_token,
          session: user.session,
        })
        .then((res) => res.data)
        .catch((error) => error.response.data);

      if (response.status !== ResStatus.Success) {
        alert(response.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      if (reload) navigate("/campaigns");
      return response.data.campaign_id;
    } catch (e: any) {}
  }

  async function StartCampaign(
    campaign_id: string,
    linkedin_account_id: string
  ) {
    if (!linkedin_account_id) linkedin_account_id = selectedLinkedinAccount;

    setLoading(true);
    try {

      // limit upto 4 min
      let api = axios.create({
        timeout: 240000,
      });


      let response = await api
        .post(CampaignAPI + "/start", {
          uid: user.uid,
          workspace_id: currentWorkspace.workspace_id,
          access_token: user.access_token,
          session: user.session,
          campaign_id: campaign_id,
          linkedin_account_id: linkedin_account_id,
        })
        .then((res) => res.data)
        .catch((error) => error.response.data);

      if (response.status !== ResStatus.Success) {
        alert(response.message);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error: any) {
      alert(error.message);
    }
  }

  const getLinkedinAccounts = React.useRef(() => {});

  getLinkedinAccounts.current = async () => {
    setLoading(true);
    const data = await axios
      .get(
        LinkedAccountAPI +
          "/get-emails?" +
          new URLSearchParams({
            uid: user.uid,
            workspace_id: currentWorkspace.workspace_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.status !== ResStatus.Success) {
      alert(data.message);
      setLoading(false);
      return;
    }

    const accounts = data.data.map((account: any) => {
      return {
        id: account.account_id,
        name: account.email,
        value: account.account_id,
      };
    });

    setLinkedinAccounts(accounts);
    setLoading(false);
  };

  useEffect(() => {
    getLinkedinAccounts.current();
  }, []);

  const handleURLPlaceholder = () => {
    switch (activeSearch) {
      case 1:
        return "Enter LinkedIn or Sales Navigator search link";
      case 2:
        return "Enter LinkedIn link to post";
      case 3:
        return "Enter LinkedIn event link";
      case 4:
        return "Enter LinkedIn Sales Navigator List link";
      case 5:
        return "Enter LinkedIn Recruiter Project link";
      default:
        break;
    }
  };

  const handleCountLimit = (e: any) => {
    if (e.target.value > 2500) {
      e.target.value = 2500;
    }
    if (activeSearch === 3) {
      if (e.target.value > 1000) {
        e.target.value = 1000;
      }
    }
    if (e.target.value < 1) {
      e.target.value = 1;
    }
  };

  function handleLinkedinAccounts(type: string, value: string) {
    setSelectedLinkedinAccount(value);
  }

  function removeSearchItem(index: number) {
    let data = [...searchItems];
    data.splice(index, 1);
    setSearchItems(data);
  }

  function handleCampaignType(type: string, value: string) {
    setCampType(value);
  }

  return (
    <div className="create-campaign-content main-bg p-4 custom-scrollbar">
      <div className="row g-0" ref={ref}>
        <div className="col-md-6">
          <div className="box-card p-3 me-2">
            <div className="mb-3">
              <InputName
                label="Campaign Name"
                name="campaign-name"
                defValue={campaignName}
                onChangeHandler={(e) => {
                  setCampaignName(e.target.value);
                }}
                placeholder="Enter Campaign Name"
                error={
                  error.hasError && error.field === "campaign-name"
                    ? error.message
                    : ""
                }
              />
            </div>
            <div className="mb-3">
              <InputSelect
                label="Linkedin Profile"
                name="linkedin-profile"
                onChange={handleLinkedinAccounts}
                selectArray={linkedinAccounts}
                placeholder="Select Linkedin Profile"
                defValue={""}
                error={
                  error.hasError && error.field === "linkedin-profile"
                    ? error.message
                    : ""
                }
              />
            </div>
            <div className="mb-3">
              <InputSelect
                label="Campaign Type"
                name="campaign-type"
                onChange={handleCampaignType}
                selectArray={[
                  { id: "1", name: "Outreach Campaign", value: "1" },
                  { id: "2", name: "Engagement Campaign", value: "2" },
                ]}
                placeholder="Select Campaign Type"
                defValue=""
                error=""
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch1"
                label="LinkedIn Premium accounts only"
                onChange={(e) => setPremiumAccountOnly(e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch2"
                label="Enable link tracking"
                defaultChecked
                onChange={(e) => setLinkTracking(e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch3"
                label="Email only campaign"
                onChange={(e) => setEmailOnly(e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch4"
                label="Move prospects from other campaigns if they are found"
                onChange={(e) => setMoveProspects(e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch5"
                label="Include prospects I've contacted on LinkedIn before"
                onChange={(e) => setIncludeProspects(e.target.checked)}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="searches box-card p-3 ms-2 custom-scrollbar">
            <p>Searches</p>
            {searchItems.length === 0 ? (
              <>
                {isError ? (
                  <div className="text-danger">
                    {"Please add atleast one search"}
                  </div>
                ) : null}
              </>
            ) : (
              searchItems.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="search-item d-flex justify-content-between p-2 mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <span>
                        <AiOutlineLink size={18} />
                      </span>
                      <p className="query w-[100px!important]">{item.query}</p>
                      <span>
                        <BiFilter size={18} />
                      </span>
                      <p className="filter">{item.filter}</p>
                    </div>
                    <button
                      className="btn btn-red h-[unset] min-h-[unset] p-[10px]"
                      onClick={() => removeSearchItem(index)}
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                );
              })
            )}
            <button className="btn btn-primary2" onClick={handleShow}>
              Add Search <AiOutlinePlus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/***** Add Search Popup *****/}

      <Modal
        show={show}
        onHide={handleShow}
        size="lg"
        centered
        className="max-heighted-modal add-search-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Search</Modal.Title>
        </Modal.Header>
        <div>
          <Modal.Body>
            <div className="mb-4">
              <p className="mb-1">Add From:</p>
              <Button
                variant="tab"
                onClick={() => setActiveSearch(1)}
                className={
                  activeSearch === 1
                    ? "active btn btn-primary2 mt-2"
                    : "btn-ghost btn-primary capitalize min-h-[unset] h-[unset] mt-2"
                }
              >
                Search URL
              </Button>
              {/* <Button 
                            variant='tab' 
                            onClick={() => setActiveSearch(2)}
                            className={activeSearch === 2 ? 'active' : ''}
                            >
                            Post URL
                        </Button>
                        <Button 
                            variant='tab'
                            onClick={handleEventSearch}
                            className={activeSearch === 3 ? 'active' : ''}
                            >
                            Event
                        </Button> */}
              <Button
                variant="tab"
                onClick={() => setActiveSearch(4)}
                className={
                  activeSearch === 4
                    ? "active btn btn-primary2"
                    : " btn-ghost capitalize min-h-[unset] h-[unset]"
                }
              >
                Navigator List URL
              </Button>
              {/* <Button 
                            variant='tab'
                            onClick={() => setActiveSearch(5)}
                            className={activeSearch === 5 ? 'active' : ''}
                            >
                            Recruiter Project URL
                        </Button>
                        <Button 
                            variant='tab' 
                            onClick={() => setActiveSearch(6)}
                            className={activeSearch === 6 ? 'active' : ''}
                            >
                            LinkedIn Search
                        </Button> */}
            </div>
            {activeSearch > 0 && activeSearch < 6 && (
              <div>
                <div className="mb-3">
                  <InputName
                    label="Search URL"
                    name="search-url"
                    defValue={query}
                    onChangeHandler={(e) => {
                      setQuery(e.target.value);
                    }}
                    placeholder={handleURLPlaceholder()}
                    error={
                      error.hasError && error.field === "search-query"
                        ? error.message
                        : ""
                    }
                  />
                </div>
                <div className="row g-0">
                  <p className="mb-0">No. of Searches:</p>
                  <div className="col-10">
                    <RangeSlider
                      tooltip="off"
                      variant="primary"
                      min={1}
                      max={activeSearch === 3 ? 1000 : 2500}
                      value={searchCount}
                      onChange={(e: any) => setSearchCount(e.target.value)}
                    />
                  </div>
                  <div className="col-2 ps-3">
                    <Form.Control
                      type="number"
                      id="search-count"
                      min={1}
                      max={activeSearch === 3 ? 1000 : 2500}
                      value={searchCount}
                      onChange={(e) => setSearchCount(e.target.value)}
                      onInput={handleCountLimit}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeSearch > 5 && (
              <div className="mb-3">
                <Form.Control
                  type="text"
                  id="search-query"
                  placeholder="Enter search query"
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  value={query}
                />
              </div>
            )}
            {activeSearch === 6 && (
              <div>
                <div className="mb-3">
                  <Form.Label>Connections:</Form.Label>
                  <div className="d-flex flex-wrap">
                    <Form.Check
                      type="checkbox"
                      name="1st-conn"
                      label="1st"
                      onChange={(e) =>
                        e.target.checked
                          ? setFilter({ ...filter, conn1: true })
                          : setFilter({ ...filter, conn1: false })
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      name="2nd-conn"
                      label="2nd"
                      onChange={(e) =>
                        e.target.checked
                          ? setFilter({ ...filter, conn2: true })
                          : setFilter({ ...filter, conn2: false })
                      }
                    />
                    <Form.Check
                      type="checkbox"
                      name="3rd-conn"
                      label="3rd"
                      onChange={(e) =>
                        e.target.checked
                          ? setFilter({ ...filter, conn3: true })
                          : setFilter({ ...filter, conn3: false })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <Form.Label>Location:</Form.Label>
                  <Form.Control
                    type="text"
                    id="location"
                    placeholder="Enter location"
                    onChange={(e) =>
                      setFilter({ ...filter, location: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <Form.Label>Current Company:</Form.Label>
                  <Form.Control
                    type="text"
                    id="current-company"
                    placeholder="Enter current company"
                    onChange={(e) =>
                      setFilter({ ...filter, currComp: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary2" onClick={handleSubmit}>
              Add Search
            </button>
          </Modal.Footer>
        </div>
      </Modal>

      {/***** Campaign Steps *****/}

      <CampaignSteps
        onChange={(steps: any) => {
          setSteps(steps);
        }}
        prefetchedSteps={prefetchedSteps}
      />

      <div className="d-flex justify-content-between mt-5">
        <button
          className="btn btn-secondary capitalize"
          onClick={() => saveCampaign(true)}
        >
          Save as Draft
        </button>
        <div>
          <button
            className="btn btn-warning text-white me-2 capitalize"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary2 py-[13px!important]"
            onClick={createAndStart}
          >
            Start Campaign <MdOutlinePlayArrow size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
