import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Badge, Card, CloseButton } from "react-bootstrap";
import {
  MdPersonAddAlt,
  MdOutlineChat,
  MdOutlineEditNote,
  MdOutlineMarkEmailRead,
  MdOutlineEmail,
} from "react-icons/md";
import { TbHandClick, TbWebhook } from "react-icons/tb";
import Draggable from "react-draggable";
import { VscWand } from "react-icons/vsc";
import {
  AiOutlinePlus,
  AiOutlineExclamationCircle,
  AiOutlineMinus,
} from "react-icons/ai";
import { HiOutlineChevronRight } from "react-icons/hi";
import { BsX } from "react-icons/bs";
import TagButtons from "../Inputs/TagButtons";
import { ToastContainer, toast } from "react-toastify";

export default function CampaignSteps(props) {
  const [clonePrefetchedSteps, setClonePrefetchedSteps] = useState([
    ...props.prefetchedSteps,
  ]);
  const [showActions, setShowActions] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [actionWaitDays, setActionWaitDays] = useState(0);
  const [actionWaitHours, setActionWaitHours] = useState(0);
  const [campSteps, setCampSteps] = useState([]);

  const filterActions = (type) => {
    if (clonePrefetchedSteps) {
      return clonePrefetchedSteps.filter((step) => step.key === type);
    } else {
      return [];
    }
  };

  /* States for Action Type 1 */
  const action1Input = useRef(null);
  const [showAction1Content, setShowAction1Content] = useState(false);
  const [action1MsgOn, setAction1MsgOn] = useState(false);
  const [isErrorAction1, setIsErrorAction1] = useState(false);
  const [clickedUpdate1, setClickedUpdate1] = useState(false);

  const [action1Msg, setAction1Msg] = useState("");

  const [action1, setAction1] = useState({
    name: "Send Connection Request",
    msg: "",
    waitDays: 0,
    waitHours: 0,
    key: "send_connection_request",
  });

  /* States for Action Type 2 */
  const action2Input = useRef(null);
  const [showAction2Content, setShowAction2Content] = useState(false);
  const [action2Msg, setAction2Msg] = useState("");
  const [clickedUpdate2, setClickedUpdate2] = useState(false);
  const [action2, setAction2] = useState({
    name: "Send Message",
    msg: "",
    waitDays: 0,
    waitHours: 0,
    key: "send_message",
  });

  /* States for Action Type 3 */
  const action3Input = useRef(null);
  const [showAction3Content, setShowAction3Content] = useState(false);
  const [action3Subject, setAction3Subject] = useState("");
  const [action3Msg, setAction3Msg] = useState("");
  const [action3AllowCredits, setAction3AllowCredits] = useState(false);
  const [clickedUpdate3, setClickedUpdate3] = useState(false);
  const [action3, setAction3] = useState({
    name: "Send InMail",
    subject: "",
    msg: "",
    allowCredits: false,
    waitDays: 0,
    waitHours: 0,
    key: "send_inmail",
  });

  /* States for Action Type 4 */
  const [showAction4Content, setShowAction4Content] = useState(false);
  const [action4ViewProfile, setAction4ViewProfile] = useState(true);
  const [action4Follow, setAction4Follow] = useState(false);
  const [action4Likes, setAction4Likes] = useState(false);
  const [action4Endorse, setAction4Endorse] = useState(false);
  const [clickedUpdate4, setClickedUpdate4] = useState(false);
  const [action4, setAction4] = useState({
    name: "Perform Action",
    viewProfile: true,
    follow: false,
    likes: false,
    endorse: false,
    waitDays: 0,
    waitHours: 0,
    key: "like_3_posts",
  });

  /* States for Action Type 5 */
  const [showAction5Content, setShowAction5Content] = useState(false);
  const [clickedUpdate5, setClickedUpdate5] = useState(false);
  const [action5, setAction5] = useState({
    name: "Send Connection by Email",
    waitDays: 0,
    waitHours: 0,
    key: "send_connection_by_email",
  });

  /* States for Action Type 6 */
  const action6Input = useRef(null);
  const [showAction6Content, setShowAction6Content] = useState(false);
  const [action6Subject, setAction6Subject] = useState("");
  const [action6Msg, setAction6Msg] = useState("");
  const [clickedUpdate6, setClickedUpdate6] = useState(false);
  const [action6, setAction6] = useState({
    name: "Send Email",
    subject: "",
    msg: "",
    waitDays: 0,
    waitHours: 0,
    key: "send_email",
  });

  /* States for Action Type 7 */
  const [showAction7Content, setShowAction7Content] = useState(false);
  const [clickedUpdate7, setClickedUpdate7] = useState(false);
  const [action7, setAction7] = useState({
    name: "Enrich Profile",
    waitDays: 0,
    waitHours: 0,
    key: "enrich_profile",
  });

  /* States for Action Type 8 */
  const [showAction8Content, setShowAction8Content] = useState(false);
  const [action8URL, setAction8URL] = useState("");
  const [clickedUpdate8, setClickedUpdate8] = useState(false);
  const [action8, setAction8] = useState({
    name: "Send Webhook",
    url: "",
    waitDays: 0,
    waitHours: 0,
    key: "send_webhook",
  });

  /* Methods for Popups Hide/Show */
  const handleShowActions = () => setShowActions(!showActions);
  const handleShowAction1Content = () => {
    setIsErrorAction1(false);
    setShowAction1Content(!showAction1Content);
  };
  const handleShowAction2Content = () => {
    setIsErrorAction1(false);
    setShowAction2Content(!showAction2Content);
  };
  const handleShowAction3Content = () => {
    setIsErrorAction1(false);
    setShowAction3Content(!showAction3Content);
  };
  const handleShowAction4Content = () => {
    setIsErrorAction1(false);
    setShowAction4Content(!showAction4Content);
  };
  const handleShowAction5Content = () => {
    setIsErrorAction1(false);
    setShowAction5Content(!showAction5Content);
  };
  const handleShowAction6Content = () => {
    setIsErrorAction1(false);
    setShowAction6Content(!showAction6Content);
  };
  const handleShowAction7Content = () => {
    setIsErrorAction1(false);
    setShowAction7Content(!showAction7Content);
  };
  const handleShowAction8Content = () => {
    setIsErrorAction1(false);
    setShowAction8Content(!showAction8Content);
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(campSteps);
    }
  }, [campSteps]);

  useEffect(() => {
    setCampSteps(clonePrefetchedSteps);
  }, [clonePrefetchedSteps]);

  const pushToPrefetch = (data) => {
    console.log("came here: ", data);
    const localClone = [...clonePrefetchedSteps];
    if (clonePrefetchedSteps) {
      const indx = clonePrefetchedSteps.findIndex((x) => x.key === data.key);
      console.log("indx", indx);
      if (indx !== -1) {
        localClone[indx] = data;
        setClonePrefetchedSteps(localClone);
      } else {
        localClone.push(data);
        setClonePrefetchedSteps(localClone);
      }
    } else {
      localClone.push(data);
      setClonePrefetchedSteps(localClone);
    }
  };

  // console.log("Best state: ", clonePrefetchedSteps, campSteps);

  /* Get Icon based on Action Type */
  const actionIcon = (name) => {
    switch (name) {
      case "Send Connection Request":
        return <MdPersonAddAlt size={20} />;
      case "Send Message":
        return <MdOutlineChat size={20} />;
      case "Send InMail":
        return <MdOutlineEditNote size={20} />;
      case "Perform Action":
        return <TbHandClick size={20} />;
      case "Send Connection by Email":
        return <MdOutlineMarkEmailRead size={20} />;
      case "Send Email":
        return <MdOutlineEmail size={20} />;
      case "Enrich Profile":
        return <VscWand size={20} />;
      case "Send Webhook":
        return <TbWebhook size={20} />;
      default:
        break;
    }
  };

  /* Get Content based on Action Type */
  const actionContent = (item) => {
    switch (item.name) {
      case "Send Connection Request":
        return (
          <div className="body">
            <p className="content mb-0">
              {item.msg === ""
                ? "Connection request without a message will be sent"
                : item.msg}
            </p>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Send Message":
        return (
          <div className="body">
            <p className="content mb-0">{item.msg}</p>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Send InMail":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">{item.subject}</p>
              <p className="mb-0">{item.msg}</p>
              <p className="mb-0">
                {item.allowCredits ? "Allow to use InMail Credits" : ""}
              </p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Perform Action":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">
                {item.viewProfile ? "Auto-View Profile" : ""}
              </p>
              <p className="mb-0">{item.follow ? "Auto-Follow Profile" : ""}</p>
              <p className="mb-0">
                {item.likes ? "Auto-Like Last 3 Posts" : ""}
              </p>
              <p className="mb-0">
                {item.endorse ? "Auto-Endorse Top 5 Skills" : ""}
              </p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Send Connection by Email":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">
                Using all available emails including personal, work and
                enriched.
              </p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Send Email":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">{item.subject}</p>
              <p className="mb-0">{item.msg}</p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Enrich Profile":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">
                If verified email is found, it'll cost 1 credit.
              </p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      case "Send Webhook":
        return (
          <div className="body">
            <div className="content">
              <p className="mb-0">
                Webhook to your callback URL with prospect payload will be sent.
              </p>
            </div>
            <div className="d-flex justify-content-center wait-time">
              <p className="me-2 mb-0">Wait: </p>
              <p className="me-2 mb-0">{item.waitDays}d</p>
              <p className="mb-0">{item.waitHours}h</p>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  const removeSequenceStep = (index) => {
    const temp = [...clonePrefetchedSteps];
    temp.splice(index, 1);
    setClonePrefetchedSteps(temp);
  };

  const selectedActionContent = (item, index) => {
    switch (item.name) {
      case "Send Connection Request":
        return (
          <Card className="flex-card">
            <CloseButton
              className="flex-card-cross"
              onClick={() => removeSequenceStep(index)}
            />
            <Card.Body onClick={addAction1}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <MdPersonAddAlt size={20} /> Send Connection Request
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Send a porspect a connection request and add a message to
                    encourage them to accept.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">{item.msg}</Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Send Message":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction2}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <MdOutlineChat size={20} /> Send Message
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Send a message to a prospect. You'll only be able to send a
                    message if the prospect has accepted your connection
                    request.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">{item.msg}</Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Send InMail":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction3}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <MdOutlineEditNote size={20} /> Send InMail
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Send an InMail message within LinkedIn. Messages will only
                    be sent to those profiles that are open and will not use
                    your InMail credits. InMail messages can only be sent to
                    those prospects that you are not connected with.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">{item.subject}</Card.Text>
              <Card.Text className="flex-card-text">{item.msg}</Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Perform Action":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction4}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <TbHandClick size={20} /> Perform Action
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    These are soft touch points to have your name appear in the
                    prospect's notifications.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">
                View Profile:{item.viewProfile ? "Yes" : "No"}, Follow:
                {item.follow ? "Yes" : "No"}, Like: {item.likes ? "Yes" : "No"},
                Endorse:
                {item.endorse ? "Yes" : "No"}
              </Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Send Connection by Email":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction5}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <MdOutlineMarkEmailRead size={20} /> Send Connection by Email
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Send a connection request to the prospect's email. It's
                    suggested that you enrich the profile before sending email.
                    Be sure your email is also integrated within Picnikly.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Send Email":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction6}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <MdOutlineEmail size={20} /> Send Email
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Send an email to a prospect. It's suggested that you enrich
                    the profile before sending email. Be sure your email is also
                    integrated within Picnikly.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">{item.subject}</Card.Text>
              <Card.Text className="flex-card-text">{item.msg}</Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Enrich Profile":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction7}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <VscWand size={20} /> Enrich Profile
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Enrich a profile to potentially find the best email and
                    phone number for your prospect. A credit will only be
                    deducted if we are successful in enriching the profile.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      case "Send Webhook":
        return (
          <Card className="flex-card">
            <CloseButton
              onClick={() => removeSequenceStep(index)}
              className="flex-card-cross"
            />
            <Card.Body onClick={addAction8}>
              <Card.Title className="flex-card-text">
                <Badge bg="primary" style={{ marginRight: "5px" }}>
                  {index + 1}
                </Badge>
                <TbWebhook size={20} /> Send Webhook
                <div className="custom-tooltip">
                  <AiOutlineExclamationCircle size={16} />
                  <span className="tooltiptext">
                    Automate a process externally using a webhook.
                  </span>
                </div>
              </Card.Title>
              <Card.Text className="flex-card-text">{item.url}</Card.Text>
              <Card.Text className="flex-card-text">
                <div style={{ color: "#83E4EA" }}>
                  Wait after previous step{" "}
                </div>
                <p>
                  <strong>
                    {item.waitDays}d{item.waitHours}h
                  </strong>
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        );
      default:
        break;
    }
  };
  console.log("action1MsgOn");
  /* Methods for Action Type 1 */
  const addAction1 = () => {
    const currentAction = filterActions("send_connection_request");
    console.log("addAction1 currentAction: ", currentAction);
    setAction1MsgOn(
      currentAction.length && currentAction[0].msg ? true : false
    );
    setAction1Msg(
      currentAction.length && currentAction[0].msg ? currentAction[0].msg : ""
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction1({
      ...action1,
      msg: action1Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action1);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction1Content(true);
  };
  function updateAction1(index) {
    setClickedUpdate1(true);
    if (action1MsgOn && !action1Msg) {
      setIsErrorAction1(true);
      return;
    }
    setIsErrorAction1(false);
    let updateStep = [...campSteps];
    action1MsgOn
      ? (updateStep[index].msg = action1Msg)
      : (updateStep[index].msg = "");
    updateStep[index].msg = action1Msg;
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction1Content(false);

    setAction1({
      ...action1,
      msg: action1Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action1,
      msg: action1Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  const handleAction1Tags = (tagName) => () => {
    let selectionStart = action1Input.current.selectionStart;
    let selectionEnd = action1Input.current.selectionEnd;
    let textBefore = action1Msg.substring(0, selectionStart);
    let textAfter = action1Msg.substring(selectionEnd, action1Msg.length);
    setAction1Msg(textBefore + tagName + textAfter);
  };

  /* Methods for Action Type 2 */
  const addAction2 = () => {
    const currentAction = filterActions("send_message");
    setAction2Msg(
      currentAction.length && currentAction[0].msg ? currentAction[0].msg : ""
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction2({
      ...action2,
      msg: action2Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action2);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction2Content(true);
  };
  function updateAction2(index) {
    setClickedUpdate2(true);
    if (!action2Msg) {
      setIsErrorAction1(true);
      return;
    }
    setIsErrorAction1(false);
    let updateStep = [...campSteps];
    updateStep[index].msg = action2Msg;
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction2Content(false);
    setAction2({
      ...action2,
      msg: action2Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action2,
      msg: action2Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  const handleAction2Tags = (tagName) => () => {
    let selectionStart = action2Input.current.selectionStart;
    let selectionEnd = action2Input.current.selectionEnd;
    let textBefore = action2Msg.substring(0, selectionStart);
    let textAfter = action2Msg.substring(selectionEnd, action2Msg.length);
    setAction2Msg(textBefore + tagName + textAfter);
  };

  /* Methods for Action Type 3 */
  const addAction3 = () => {
    const currentAction = filterActions("send_inmail");
    setAction3Msg(
      currentAction.length && currentAction[0].msg ? currentAction[0].msg : ""
    );
    setAction3Subject(
      currentAction.length && currentAction[0].subject
        ? currentAction[0].subject
        : ""
    );
    setAction3AllowCredits(
      currentAction.length && currentAction[0].allowCredits
        ? currentAction[0].allowCredits
        : false
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction3({
      ...action3,
      subject: action3Subject,
      msg: action3Msg,
      allowCredits: action3AllowCredits,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action3);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction3Content(true);
  };
  function updateAction3(index) {
    setClickedUpdate3(true);
    if (!action3Subject || !action3Msg) {
      setIsErrorAction1(true);
      return;
    }
    setIsErrorAction1(false);

    let updateStep = [...campSteps];
    updateStep[index].subject = action3Subject;
    updateStep[index].msg = action3Msg;
    updateStep[index].allowCredits = action3AllowCredits;
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction3Content(false);
    setAction3({
      ...action3,
      subject: action3Subject,
      msg: action3Msg,
      allowCredits: action3AllowCredits,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action3,
      subject: action3Subject,
      msg: action3Msg,
      allowCredits: action3AllowCredits,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  const handleAction3Tags = (tagName) => () => {
    let selectionStart = action3Input.current.selectionStart;
    let selectionEnd = action3Input.current.selectionEnd;
    let textBefore = action3Msg.substring(0, selectionStart);
    let textAfter = action3Msg.substring(selectionEnd, action3Msg.length);
    setAction3Msg(textBefore + tagName + textAfter);
  };

  /* Methods for Action Type 4 */
  const addAction4 = () => {
    const currentAction = filterActions("like_3_posts");
    setAction4ViewProfile(
      currentAction.length && currentAction[0].viewProfile
        ? currentAction[0].viewProfile
        : true
    );
    setAction4Follow(
      currentAction.length && currentAction[0].follow
        ? currentAction[0].follow
        : false
    );
    setAction4Likes(
      currentAction.length && currentAction[0].likes
        ? currentAction[0].likes
        : false
    );
    setAction4Endorse(
      currentAction.length && currentAction[0].endorse
        ? currentAction[0].endorse
        : false
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction4({
      ...action4,
      viewProfile: action4ViewProfile,
      follow: action4Follow,
      likes: action4Likes,
      endorse: action4Endorse,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action4);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction4Content(true);
  };
  function updateAction4(index) {
    setClickedUpdate4(true);
    if (
      !action4ViewProfile &&
      !action4Follow &&
      !action4Likes &&
      !action4Endorse
    ) {
      toast.error("Please select atleast one!");
    } else {
      let updateStep = [...campSteps];
      updateStep[index].viewProfile = action4ViewProfile;
      updateStep[index].follow = action4Follow;
      updateStep[index].likes = action4Likes;
      updateStep[index].endorse = action4Endorse;
      updateStep[index].waitDays = actionWaitDays;
      updateStep[index].waitHours = actionWaitHours;
      setCampSteps(updateStep);

      setShowAction4Content(false);
      setAction4({
        ...action4,
        viewProfile: action4ViewProfile,
        follow: action4Follow,
        likes: action4Likes,
        endorse: action4Endorse,
        waitDays: actionWaitDays,
        waitHours: actionWaitHours,
      });
      pushToPrefetch({
        ...action4,
        viewProfile: action4ViewProfile,
        follow: action4Follow,
        likes: action4Likes,
        endorse: action4Endorse,
        waitDays: actionWaitDays,
        waitHours: actionWaitHours,
      });
    }
  }

  /* Methods for Action Type 5 */
  const addAction5 = () => {
    const currentAction = filterActions("send_connection_by_email");
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction5({
      ...action5,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action5);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction5Content(true);
  };
  function updateAction5(index) {
    setClickedUpdate5(true);
    let updateStep = [...campSteps];
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction5Content(false);
    setAction5({
      ...action5,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action5,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  /* Methods for Action Type 6 */
  const addAction6 = () => {
    const currentAction = filterActions("send_email");
    setAction6Subject(
      currentAction.length && currentAction[0].subject
        ? currentAction[0].subject
        : ""
    );
    setAction6Msg(
      currentAction.length && currentAction[0].msg ? currentAction[0].msg : ""
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction6({
      ...action6,
      subject: action6Subject,
      msg: action6Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action6);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction6Content(true);
  };
  function updateAction6(index) {
    setClickedUpdate6(true);
    if (!action6Subject || !action6Msg) {
      setIsErrorAction1(true);
      return;
    }
    setIsErrorAction1(false);

    let updateStep = [...campSteps];
    updateStep[index].subject = action6Subject;
    updateStep[index].msg = action6Msg;
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction6Content(false);
    setAction6({
      ...action6,
      subject: action6Subject,
      msg: action6Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action6,
      subject: action6Subject,
      msg: action6Msg,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  const handleAction6Tags = (tagName) => () => {
    let selectionStart = action6Input.current.selectionStart;
    let selectionEnd = action6Input.current.selectionEnd;
    let textBefore = action6Msg.substring(0, selectionStart);
    let textAfter = action6Msg.substring(selectionEnd, action6Msg.length);
    setAction6Msg(textBefore + tagName + textAfter);
  };

  /* Methods for Action Type 7 */
  const addAction7 = () => {
    const currentAction = filterActions("enrich_profile");
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction7({
      ...action7,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action7);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction7Content(true);
  };
  function updateAction7(index) {
    setClickedUpdate7(true);
    let updateStep = [...campSteps];
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction7Content(false);
    setAction7({
      ...action7,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action7,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  /* Methods for Action Type 8 */
  const addAction8 = () => {
    const currentAction = filterActions("send_webhook");
    setAction8URL(
      currentAction.length && currentAction[0].url ? currentAction[0].url : ""
    );
    setActionWaitDays(
      currentAction.length && currentAction[0].waitDays
        ? currentAction[0].waitDays
        : 0
    );
    setActionWaitHours(
      currentAction.length && currentAction[0].waitHours
        ? currentAction[0].waitHours
        : 0
    );

    setAction8({
      ...action8,
      url: action8URL,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    let newStep = campSteps.concat(action8);
    setCampSteps(newStep);

    setStepIndex(campSteps.length);

    setShowActions(false);
    setShowAction8Content(true);
  };
  function updateAction8(index) {
    setClickedUpdate8(true);
    if (!action8URL) {
      setIsErrorAction1(true);
      return;
    }
    setIsErrorAction1(false);
    let updateStep = [...campSteps];
    updateStep[index].url = action8URL;
    updateStep[index].waitDays = actionWaitDays;
    updateStep[index].waitHours = actionWaitHours;
    setCampSteps(updateStep);

    setShowAction8Content(false);
    setAction8({
      ...action8,
      url: action8URL,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
    pushToPrefetch({
      ...action8,
      url: action8URL,
      waitDays: actionWaitDays,
      waitHours: actionWaitHours,
    });
  }

  /* Method for Step Editing based on Action Type */
  function handleEditAction(index) {
    setStepIndex(index);
    let item = campSteps[index];
    switch (item.name) {
      case "Send Connection Request":
        item.msg === "" ? setAction1MsgOn(false) : setAction1MsgOn(true);
        setAction1Msg(item.msg);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction1Content(true);
        break;
      case "Send Message":
        setAction2Msg(item.msg);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction2Content(true);
        break;
      case "Send InMail":
        setAction3Subject(item.subject);
        setAction3Msg(item.msg);
        setAction3AllowCredits(item.allowCredits);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction3Content(true);
        break;
      case "Perform Action":
        setAction4ViewProfile(item.viewProfile);
        setAction4Follow(item.follow);
        setAction4Likes(item.likes);
        setAction4Endorse(item.endorse);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction4Content(true);
        break;
      case "Send Connection by Email":
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction5Content(true);
        break;
      case "Send Email":
        setAction6Subject(item.subject);
        setAction6Msg(item.msg);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction6Content(true);
        break;
      case "Enrich Profile":
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction7Content(true);
        break;
      case "Send Webhook":
        setAction8URL(item.url);
        setActionWaitDays(item.waitDays);
        setActionWaitHours(item.waitHours);
        setShowAction8Content(true);
        break;

      default:
        break;
    }
  }

  /* Method to Remove Step */
  function removeStep(index) {
    let data = [...campSteps];
    data.splice(index, 1);
    setCampSteps(data);
  }

  return (
    <div className="row g-0">
      <div className="col-md-12">
        <p className="mt-4 fw-600">Campaign Steps</p>
        <div className="campaign-steps d-flex flex-wrap mt-4">
          {campSteps === 0
            ? ""
            : campSteps
                .filter((item) => item.name === "Perform Action")
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="step-wrap d-flex align-items-center justify-content-center"
                    >
                      <div
                        className="remove-icon"
                        onClick={() => removeStep(index)}
                      >
                        <BsX size={20} />
                      </div>
                      <div
                        className="step box-card d-flex mb-3 p-2"
                        onClick={() => handleEditAction(index)}
                      >
                        <div className="step-count text-center">
                          <p className="mb-0">{index + 1}</p>
                        </div>
                        <div className="step-content ms-2">
                          <div className="head d-flex align-items-center mb-2">
                            {actionIcon(item.name)}
                            <span className="ms-2">{item.name}</span>
                          </div>
                          {actionContent(item)}
                        </div>
                      </div>
                      <div>
                        <HiOutlineChevronRight size={20} />
                      </div>
                    </div>
                  );
                })}
          <div className="d-flex flex-wrap p-2">
            {clonePrefetchedSteps.length
              ? clonePrefetchedSteps.map((item, indx) => {
                  return (
                    <div
                      className="step-flex box-card d-flex align-items-center justify-content-center ms-2"
                      key={indx}
                    >
                      {selectedActionContent(item, indx)}
                    </div>
                  );
                })
              : ""}
            <div className="step-flex add-step d-flex align-items-center justify-content-center ms-2">
              <Button
                variant="primary"
                className="px-3 py-2"
                onClick={handleShowActions}
              >
                Add Step <AiOutlinePlus size={15} />
              </Button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      {/***** Add Action Popup *****/}

      <Modal
        show={showActions}
        onHide={handleShowActions}
        size="lg"
        centered
        className="add-action-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-0 py-3">
            <div className="col-md-6 pe-3 border-end">
              <p className="mb-2 fw-600">LinkedIn Automation</p>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction1}
                // disabled={true}
              >
                <div className="start">
                  <MdPersonAddAlt size={20} />
                  <span>Send Connection Request</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Send a porspect a connection request and add a message to
                      encourage them to accept.
                    </span>
                  </div>
                </div>
                {/* <AiOutlinePlus size={15} /> */}
              </Button>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction2}
                // disabled={true}
              >
                <div className="start">
                  <MdOutlineChat size={20} />
                  <span>Send Message</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Send a message to a prospect. You'll only be able to send
                      a message if the prospect has accepted your connection
                      request.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction3}
                // disabled={true}
              >
                <div className="start">
                  <MdOutlineEditNote size={20} />
                  <span>Send InMail</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Send an InMail message within LinkedIn. Messages will only
                      be sent to those profiles that are open and will not use
                      your InMail credits. InMail messages can only be sent to
                      those prospects that you are not connected with.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction4}
              >
                <div className="start">
                  <TbHandClick size={20} />
                  <span>Perform Action</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      These are soft touch points to have your name appear in
                      the prospect's notifications.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction5}
                // disabled={true}
              >
                <div className="start">
                  <MdOutlineMarkEmailRead size={20} />
                  <span>Send Connection by Email</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Send a connection request to the prospect's email. It's
                      suggested that you enrich the profile before sending
                      email. Be sure your email is also integrated within
                      Picnikly.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
            </div>
            <div className="col-md-6 ps-3">
              <p className="mb-2 fw-600">Email Automation</p>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction6}
                // disabled={true}
              >
                <div className="start">
                  <MdOutlineEmail size={20} />
                  <span>Send Email</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Send an email to a prospect. It's suggested that you
                      enrich the profile before sending email. Be sure your
                      email is also integrated within Picnikly.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction7}
                // disabled={true}
              >
                <div className="start">
                  <VscWand size={20} />
                  <span>Enrich Profile</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Enrich a profile to potentially find the best email and
                      phone number for your prospect. A credit will only be
                      deducted if we are successful in enriching the profile.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>

              <p className="mt-3 mb-2 fw-600">Integrations</p>
              <Button
                variant="step-actions"
                className="d-flex justify-content-between align-items-center box-card w-100 mb-2"
                onClick={addAction8}
                // disabled={true}
              >
                <div className="start">
                  <TbWebhook size={20} />
                  <span>Send Webhook</span>
                  <div className="custom-tooltip">
                    <AiOutlineExclamationCircle size={16} />
                    <span className="tooltiptext">
                      Automate a process externally using a webhook.
                    </span>
                  </div>
                </div>
                <AiOutlinePlus size={15} />
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/***** Action 1 Content Popup *****/}

      <Modal
        show={showAction1Content}
        onHide={handleShowAction1Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Connection Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Switch
            id="action1-msg-switch"
            label="Include Text Massage"
            className="mb-3"
            checked={action1MsgOn}
            onChange={() => setAction1MsgOn(!action1MsgOn)}
          />
          {action1MsgOn ? (
            <div>
              <Form.Control
                ref={action1Input}
                as="textarea"
                rows={3}
                name="action1-msg-field"
                value={action1Msg}
                onChange={(e) => setAction1Msg(e.target.value)}
              />
              {action1MsgOn && !action1Msg && isErrorAction1 ? (
                <div className="text-danger">{"Please enter message"}</div>
              ) : null}
              <TagButtons tagAction={handleAction1Tags} />
            </div>
          ) : (
            <p>Connection request without a message will be sent</p>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction1(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 2 Content Popup *****/}

      <Modal
        show={showAction2Content}
        onHide={handleShowAction2Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            ref={action2Input}
            as="textarea"
            rows={3}
            name="action2-msg-field"
            value={action2Msg}
            placeholder={"Message"}
            onChange={(e) => setAction2Msg(e.target.value)}
          />
          {!action2Msg && isErrorAction1 ? (
            <div className="text-danger">{"Please enter message"}</div>
          ) : null}
          <TagButtons tagAction={handleAction2Tags} />
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction2(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 3 Content Popup *****/}

      <Modal
        show={showAction3Content}
        onHide={handleShowAction3Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send InMail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            name="action3-subject-field"
            className="mb-3"
            placeholder="Subject"
            value={action3Subject}
            onChange={(e) => setAction3Subject(e.target.value)}
          />
          {!action3Subject && isErrorAction1 ? (
            <div className="text-danger">{"Please enter subject"}</div>
          ) : null}
          <Form.Control
            ref={action3Input}
            as="textarea"
            rows={3}
            name="action3-msg-field"
            className="mb-3"
            value={action3Msg}
            placeholder={"Message"}
            onChange={(e) => setAction3Msg(e.target.value)}
          />
          {!action3Msg && isErrorAction1 ? (
            <div className="text-danger">{"Please enter message"}</div>
          ) : null}
          <TagButtons tagAction={handleAction3Tags} />
          <Form.Switch
            id="action3-allowcredits-switch"
            label="Allow to use my InMail credits"
            className="mb-2 mt-3"
            checked={action3AllowCredits}
            onChange={() => setAction3AllowCredits(!action3AllowCredits)}
          />
          <p className="foot-note">
            InMails will be sent to any account either private or premium, using
            your available account's InMail credits.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction3(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 4 Content Popup *****/}

      <Modal
        show={showAction4Content}
        onHide={handleShowAction4Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Perform Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap">
            <Form.Switch
              id="action4-viewprofile-switch"
              label="Auto-View Profile"
              className="mb-3 me-5"
              checked={action4ViewProfile}
              onChange={() => setAction4ViewProfile(!action4ViewProfile)}
            />
            <Form.Switch
              id="action4-folloe-switch"
              label="Auto-Follow Profile"
              className="mb-3 me-5"
              checked={action4Follow}
              onChange={() => setAction4Follow(!action4Follow)}
            />
            <Form.Switch
              id="action4-likes-switch"
              label="Like 3 Posts"
              className="mb-3"
              checked={action4Likes}
              onChange={() => setAction4Likes(!action4Likes)}
            />
            <Form.Switch
              id="action4-endorse-switch"
              label="Auto-Endorse Top 5 Skills"
              className="mb-3 me-5"
              checked={action4Endorse}
              onChange={() => setAction4Endorse(!action4Endorse)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction4(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 5 Content Popup *****/}

      <Modal
        show={showAction5Content}
        onHide={handleShowAction5Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Connection by Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Using all available emails including personal, work and enriched.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction5(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 6 Content Popup *****/}

      <Modal
        show={showAction6Content}
        onHide={handleShowAction6Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            name="action6-subject-field"
            className="mb-3"
            placeholder="Subject"
            value={action6Subject}
            onChange={(e) => setAction6Subject(e.target.value)}
          />
          {!action6Subject && isErrorAction1 ? (
            <div className="text-danger">{"Please enter subject"}</div>
          ) : null}
          <Form.Control
            ref={action6Input}
            as="textarea"
            rows={3}
            name="action3-msg-field"
            className="mb-3"
            placeholder={"Message"}
            value={action6Msg}
            onChange={(e) => setAction6Msg(e.target.value)}
          />
          {!action6Msg && isErrorAction1 ? (
            <div className="text-danger">{"Please enter subject"}</div>
          ) : null}
          <TagButtons tagAction={handleAction6Tags} />
          <p className="foot-note mt-2">
            Email will be sent through your integrated email accounts.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction6(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 7 Content Popup *****/}

      <Modal
        show={showAction7Content}
        onHide={handleShowAction7Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Enrich Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>If verified email is found, it'll cost 1 credit.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction7(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/***** Action 8 Content Popup *****/}

      <Modal
        show={showAction8Content}
        onHide={handleShowAction8Content}
        size="lg"
        centered
        className="action-content-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Webhook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="url"
            name="action8-url-field"
            className="mb-3"
            placeholder="Enter Callback URL"
            value={action8URL}
            onChange={(e) => setAction8URL(e.target.value)}
          />
          {!action8URL && isErrorAction1 ? (
            <div className="text-danger">{"Please enter url"}</div>
          ) : null}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div className="wait-time">
            <p className="heading mb-2">Waiting after previous step</p>
            <div className="d-flex">
              <div className="d-flex me-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitDays > 0
                      ? setActionWaitDays(actionWaitDays - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitDays}d</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitDays(actionWaitDays + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  onClick={() =>
                    actionWaitHours > 0
                      ? setActionWaitHours(actionWaitHours - 1)
                      : ""
                  }
                >
                  <AiOutlineMinus size={12} />
                </Button>
                <p className="mx-2 mb-0">{actionWaitHours}h</p>
                <Button
                  variant="secondary"
                  onClick={() => setActionWaitHours(actionWaitHours + 1)}
                >
                  <AiOutlinePlus size={12} />
                </Button>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={() => updateAction8(stepIndex)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
