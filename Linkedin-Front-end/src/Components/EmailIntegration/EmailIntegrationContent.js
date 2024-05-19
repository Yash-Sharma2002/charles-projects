import React, { useState, useRef, useMemo } from "react";
import EmailBox from "./EmailBox";
import { Button, Modal, Form, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import routes from "../../Config/routes/api";
import { PublicClientApplication } from "@azure/msal-browser";
import { outlookConfig } from "../../Config/config";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../UI/Loader";
import { useQuery } from "react-query";
const {
  googleAuthRoute,
  OutlookCodeExchangeToAccessTokenUrl,
  connectSmtpImap,
  connectedAccountsUrl,
} = routes;

export default function EmailIntegrationContent() {
  const user = useSelector(selectProfile);
  const msalInstance = new PublicClientApplication(outlookConfig);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const smtpPort = useRef(null);
  const imapPort = useRef(null);
  const [smtpLabel, setSmtpLabel] = useState(null);
  const [imapLabel, setImapLabel] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }),
    [user.token]
  );

  const { data: connectedAccountsData } = useQuery(
    ["connected_accounts"],
    () =>
      axios.get(connectedAccountsUrl, config).then((res) => {
        setConnectedAccounts(res.data);
        return res.data;
      }),
    { refetchOnWindowFocus: false, enabled: !!user.token, retry: 1 }
  );

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      console.log(formDataObj);
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      toast.error("Invalid Credentials!");
    } else {
      const formData = new FormData(event.target);
      const formDataObj = Object.fromEntries(formData.entries());
      console.log(formDataObj);
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
      setShow(false);
      // navigate('/email-integration');
      axios
        .post(
          connectSmtpImap,
          { ...formDataObj, smtp_label: smtpLabel, imap_label: imapLabel },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((resp) => {
          console.log("Response: ", resp);
          if (resp.data.connected) {
            navigate("/email-integration");
          } else {
            window.alert("COMING SOON!");
          }
        })
        .catch((err) => {
          window.alert("Not Connected: " + err.response.data.error);
        });
    }
  };
  const handleShow = () => setShow(!show);

  const emailBoxes = [
    {
      id: "1",
      title: "Gmail",
      type: "gmail",
      desc: "You can send emails in Campaigns using your Gmail account.",
      onClick: () => googleAuthRoute(),
    },
    {
      id: "2",
      title: "Outlook",
      type: "outlook",
      desc: "You can send emails in Campaigns using your Outlook account.",
      onClick: async () =>
        await msalInstance
          .loginPopup({})
          .then((resp) => {
            console.log("Response: ", resp);
            axios
              .post(
                OutlookCodeExchangeToAccessTokenUrl,
                { ...resp, client_id: outlookConfig.auth.clientId },
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                }
              )
              .then((resp) => {
                console.log(resp);
                if (resp.data.connected) {
                  navigate("/email-integration");
                }
              })
              .catch((err) => {
                window.alert("COMING SOON!");
              });
          })
          .catch((e) => {
            window.alert("COMING SOON!");
          }),
    },
    {
      id: "3",
      title: "SendGrid",
      type: "sendgrid",
      desc: "You can send emails in Campaigns using your SendGrid account.",
      onClick: () => window.alert("COMING SOON!"),
    },
    {
      id: "4",
      title: "Email via SMTP",
      type: "smtp",
      desc: "You can send emails in Campaigns using your SMTP account.",
      onClick: () => handleShow(),
    },
  ];
  return (
    <div className="email-integration-content">
      <div className="row g-0">
        <div className="col-md-12">
          <div className="main-bg p-4 custom-scrollbar">
            <Tabs
              defaultActiveKey={
                !!connectedAccounts.length ? "connected" : "available"
              }
              id="available-tabs"
              className="custom-tabs pb-3"
            >
              <Tab eventKey="available" title="Available">
                <div className="d-flex flex-wrap">
                  {emailBoxes.slice(0, 3).map(function (item) {
                    return <EmailBox key={item.id} data={item} />;
                  })}
                  {emailBoxes.slice(3, 4).map(function (item) {
                    return (
                      <EmailBox
                        key={item.id}
                        data={item}
                        popupHandle={handleShow}
                      />
                    );
                  })}
                </div>
              </Tab>
              <Tab eventKey="connected" title="Connected">
                <div className="d-flex flex-wrap">
                  {connectedAccounts.length
                    ? connectedAccounts.map(function (item) {
                        return <EmailBox key={item.id} data={item} />;
                      })
                    : ""}
                </div>
              </Tab>
            </Tabs>
          </div>
          <Modal show={show} onHide={handleShow} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>Connect SMTP Email</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Modal.Body>
                <div className="row g-0">
                  <div className="col-md-6 pe-2 mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter Username"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Username.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 ps-2 mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid password.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <Form.Label>SMTP Server</Form.Label>
                    <Form.Control
                      type="text"
                      name="smtp_server"
                      placeholder="Enter SMTP Server e.g. smtp.gmail.com"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid SMTP Server.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <Form.Label>IMAP Server</Form.Label>
                    <Form.Control
                      type="text"
                      name="imap_server"
                      placeholder="Enter IMAP Server"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid IMAP Server.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <Form.Label>SMTP Port</Form.Label>
                    <Form.Control
                      type="number"
                      name="smtp_port"
                      placeholder="Enter Port"
                      ref={smtpPort}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Port.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <Form.Label>IMAP Port</Form.Label>
                    <Form.Control
                      type="number"
                      name="imap_port"
                      placeholder="Enter Port"
                      ref={imapPort}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Invalid Port.
                    </Form.Control.Feedback>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <Form.Check
                        type="radio"
                        name="smtp-smtp-ports"
                        label="SSL"
                        onChange={(e) => {
                          if (e.target.checked) {
                            smtpPort.current.value = 465;
                            setSmtpLabel("SSL");
                          } else {
                            smtpPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        name="smtp-smtp-ports"
                        label="TLS"
                        onChange={(e) => {
                          if (e.target.checked) {
                            smtpPort.current.value = 587;
                            setSmtpLabel("TLS");
                          } else {
                            smtpPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        name="smtp-smtp-ports"
                        label="None"
                        onChange={(e) => {
                          if (e.target.checked) {
                            smtpPort.current.value = 25;
                            setSmtpLabel("None");
                          } else {
                            smtpPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                      <Form.Control.Feedback type="invalid">
                        Invalid SMTP Server.
                      </Form.Control.Feedback>
                    </div>
                  </div>
                  <div className="col-md-6 pe-2 mb-2">
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        name="smtp-imap-ports"
                        label="SSL"
                        onChange={(e) => {
                          if (e.target.checked) {
                            imapPort.current.value = 993;
                            setImapLabel("SSL");
                          } else {
                            imapPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        name="smtp-imap-ports"
                        label="TLS"
                        onChange={(e) => {
                          if (e.target.checked) {
                            imapPort.current.value = 993;
                            setImapLabel("TLS");
                          } else {
                            imapPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                      <Form.Check
                        type="radio"
                        name="smtp-imap-ports"
                        label="None"
                        onChange={(e) => {
                          if (e.target.checked) {
                            imapPort.current.value = 143;
                            setImapLabel("None");
                          } else {
                            imapPort.current.value = "";
                          }
                          return;
                        }}
                        className="me-3"
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  Connect
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
}
