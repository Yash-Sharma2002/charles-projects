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
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import { useQuery } from "react-query";
import { getRecord, createRecord } from "../../Config/apiFunctions";
import routes from "../../Config/routes/api";

const {
  campaignRoute,
  triggerCampaignRoute,
  campaignLinkedinAccountsRoute,
  campaignSequenceRoute,
  linkedinAccountsRoute,
} = routes;

export default function CreateCampaignContent({ selectedForEdit }) {
  console.log("selectedForEdit: ", selectedForEdit);
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
  const [validated, setValidated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false);
  const [campaignName, setCampaignName] = useState(
    selectedForEdit ? selectedForEdit.name : ""
  );

  const [steps, setSteps] = useState([]);
  const [campType, setCampType] = useState("1");
  const [campName, setCampName] = useState("");
  const [premiumAccountOnly, setPremiumAccountOnly] = useState(false);
  const [linkTracking, setLinkTracking] = useState(true);
  const [emailOnly, setEmailOnly] = useState(false);
  const [moveProspects, setMoveProspects] = useState(false);
  const [includeProspects, setIncludeProspects] = useState(false);

  const [activeSearch, setActiveSearch] = useState(1);
  const [searchCount, setSearchCount] = useState(
    selectedForEdit ? selectedForEdit.crawl_total_prospects : 1000
  );
  const [searchItems, setSearchItems] = useState([]);
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
  console.log("steps: ", steps, prefetchedSteps);

  const ref = useRef(null);

  const user = useSelector(selectProfile);
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState({});

  const { data: linkedinAccountsList } = useQuery(
    ["linkedinAccounts", user],
    () =>
      getRecord(
        `${linkedinAccountsRoute}?connected=true&ready_for_use=true`,
        user
      ),
    { enabled: !!user.token }
  );

  useEffect(() => {
    if (!linkedinAccountsList || !linkedinAccountsList.length) return;
    setSelectedLinkedinAccount(linkedinAccountsList[0].id);
    setLinkedinAccounts(linkedinAccountsList);
  }, [linkedinAccountsList]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log("form", form);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else {
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
      setShow(false);

      //Add the search item
      if (activeSearch < 6) {
        const newItems = searchItems.concat({ query, filter: searchCount });
        setSearchItems(newItems);
      } else {
        //Make a string to display for selected filter values
        let filterText = "";
        if (filter.conn1) {
          filterText = filterText + "1st,";
        }
        if (filter.conn2) {
          filterText = filterText + "2nd,";
        }
        if (filter.conn3) {
          filterText = filterText + "3rd,";
        }
        filterText += filter.location;
        filterText += filter.currComp;
        const newItems = searchItems.concat({ query, filter: filterText });
        setSearchItems(newItems);
      }

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
  };

  const handleShow = () => setShow(!show);

  const handleCancel = () => navigate(-1);

  const saveCampaign = async () => {
    let isValid = true;

    if (!campaignName) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsError(true);
      isValid = false;
    }
    if (searchItems.length === 0) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsError(true);
      isValid = false;
    }

    if (!isValid) return;

    let values = {
      name: campaignName,
      search_url: searchItems[0].query,
      crawl_total_prospects: searchItems[0].filter,
    };

    const resp = await createRecord({
      values,
      user,
      url: campaignRoute,
    });

    let campainId = resp.data.id;

    steps.map(async (item, idx) => {
      if (item.key === "peform_actions") {
        const payloads = [];

        if (item.likes) {
          payloads.push({
            campaign: campainId,
            delay_in_days: item.waitDays,
            delay_in_hours: item.waitHours,
            step: "like_3_posts",
          });
        }

        if (item.follow) {
          payloads.push({
            campaign: campainId,
            delay_in_days: item.waitDays,
            delay_in_hours: item.waitHours,
            step: "follow",
          });
        }

        if (item.endorse) {
          payloads.push({
            campaign: campainId,
            delay_in_days: item.waitDays,
            delay_in_hours: item.waitHours,
            step: "endorse_top_5_skills",
          });
        }

        let first = 0;
        const newPaylods = payloads.map((payload, payloadIdx) => {
          const newPayload = {
            ...payload,
            order: idx + payloadIdx,
          };

          if (first) {
            newPayload.delay_in_days = 0;
            newPayload.delay_in_hours = 0;
          }

          if (!first) {
            first = 1;
          }

          return newPayload;
        });

        await newPaylods.map(async (payload) => {
          await createRecord({
            user,
            values: payload,
            url: `${campaignSequenceRoute}`,
          });
        });

        return;
      }

      const payload = {
        campaign: campainId,
        delay_in_days: item.waitDays,
        delay_in_hours: item.waitHours,
        step: item.key,
        order: idx,
      };

      if (item.key === "send_connection_request") {
        payload.note = `${item.msg}`;
      } else if (item.key === "send_message") {
        payload.message = `${item.msg}`;
      } else if (item.key === "send_inmail") {
        payload.inmail_subject = item.subject;
        payload.inmail_message = item.msg;
      } else if (item.key === "send_email") {
        payload.google_account = item.google_account;
        payload.smtp_account = item.smtp_account;
        payload.from_email = item.from_email;
        payload.email_subject = item.subject;
        payload.email_message = item.msg;
      }

      await createRecord({
        user,
        values: payload,
        url: `${campaignSequenceRoute}`,
      });
    });

    await createRecord({
      user,
      values: {
        linkedin_account: selectedLinkedinAccount,
        campaign: campainId,
      },
      url: campaignLinkedinAccountsRoute,
    });

    await createRecord({
      user,
      values: {},
      url: `${triggerCampaignRoute}${campainId}/`,
    });

    navigate(-1);
  };

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

  const handleCountLimit = (e) => {
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

  const handleEventSearch = () => {
    setActiveSearch(3);
    if (searchCount > 1000) {
      setSearchCount(1000);
    }
  };

  function removeSearchItem(index) {
    let data = [...searchItems];
    data.splice(index, 1);
    setSearchItems(data);
  }

  console.log(selectedLinkedinAccount);

  return (
    <div className="create-campaign-content main-bg p-4 custom-scrollbar">
      <div className="row g-0" ref={ref}>
        <div className="col-md-6">
          <div className="box-card p-3 me-2">
            <div className="mb-3">
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type="text"
                name="campaign-name"
                value={campaignName}
                onChange={(e) => {
                  setCampaignName(e.target.value);
                  console.log(e.target.value);
                  setIsError(false);
                }}
                placeholder="Enter Campaign Name"
              />
              {!campaignName && isError ? (
                <div className="text-danger">
                  {"Please enter campaign name"}
                </div>
              ) : null}
            </div>
            <div className="mb-3">
              <Form.Label>Linkedin Profile</Form.Label>
              <Form.Select
                value={selectedLinkedinAccount}
                onChange={(e) => {
                  setSelectedLinkedinAccount(e.target.value);
                }}
              >
                {linkedinAccounts.map((linkedinAccount) => {
                  return (
                    <option value={linkedinAccount.id}>
                      {linkedinAccount.name || linkedinAccount.username}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Label>Campaign Type</Form.Label>
              <Form.Select>
                <option value={1}>Outreach Campaign</option>
                <option value={2}>Engagement Campaign</option>
              </Form.Select>
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch1"
                label="LinkedIn Premium accounts only"
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch2"
                label="Enable link tracking"
                defaultChecked
              />
            </div>
            <div className="mb-3">
              <Form.Switch id="camp-switch3" label="Email only campaign" />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch4"
                label="Move prospects from other campaigns if they are found"
              />
            </div>
            <div className="mb-3">
              <Form.Switch
                id="camp-switch5"
                label="Include prospects I've contacted on LinkedIn before"
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
              searchItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="search-item d-flex justify-content-between p-2 mb-3"
                  >
                    <div className="d-flex align-items-center">
                      <span>
                        <AiOutlineLink size={18} />
                      </span>
                      <p className="query">{item.query}</p>
                      <span>
                        <BiFilter size={18} />
                      </span>
                      <p className="filter">{item.filter}</p>
                    </div>
                    <Button
                      variant="red"
                      onClick={() => removeSearchItem(index)}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  </div>
                );
              })
            )}
            <Button variant="primary" onClick={handleShow}>
              Add Search <AiOutlinePlus size={20} />
            </Button>
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
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-4">
              <p className="mb-1">Add From:</p>
              <Button
                variant="tab"
                onClick={() => setActiveSearch(1)}
                className={activeSearch === 1 ? "active" : ""}
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
                className={activeSearch === 4 ? "active" : ""}
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
                  <Form.Control
                    type="text"
                    id="search-url"
                    placeholder={handleURLPlaceholder()}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                    value={query}
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
                      onChange={(e) => setSearchCount(e.target.value)}
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
            <Button type="submit" variant="primary">
              Add Search
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/***** Campaign Steps *****/}

      <CampaignSteps
        onChange={(steps) => {
          console.log(steps);
          setSteps(steps);
        }}
        prefetchedSteps={prefetchedSteps}
      />

      <div className="d-flex justify-content-between mt-5">
        <Button variant="secondary">Save as Draft</Button>
        <div>
          <Button variant="secondary" className="me-2" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={saveCampaign}>
            Start Campaign <MdOutlinePlayArrow size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
