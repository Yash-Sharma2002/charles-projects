import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";
import { TfiImport, TfiExport } from "react-icons/tfi";
import * as Xlsx from "xlsx";

import ProxyForm from "./ProxyForm";
import InputSelect from "../input/InputSelect";
import InputEmail from "../input/InputEmail";
import InputPass from "../input/InputPass";
import InputNumber from "../input/InputNumber";
import axios from "axios";
import { BASE_URL, LinkedAccountAPI } from "../../constants/api";
import { AppContext } from "../../context/Context";
import UserErrorInterface from "../../interface/UserErrorInterface";
import AccountBox from "./AccountBox";
import { TimeZones } from "../../constants/Timezones";
import Loader from "../loader/Loader";
import { workHourOpts } from "../../constants/WorkHours";
import ResStatus from "../../constants/ResStatus";
import LinkedInAccountMessage from "../../enum/LinkedInAccount";

export default function LinkedinAccountsContent() {
  const { user, currentWorkspace } = React.useContext(AppContext);

  const [errors, setErrors] = useState<UserErrorInterface>(
    {} as UserErrorInterface
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [account_id, setAccount_id] = useState("");

  const [values, setValues] = useState(1);

  const [proxyDetails, setProxyDetails] = useState<any>({
    country: "",
    isCustom: false,
    isDomain: false,
    ip: "",
    domain: "",
    port: "",
    username: "",
    password: "",
  });

  const [account, setAccount] = useState<any>({
    timezone: "",
    active_from: "",
    active_to: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [linkedinAccounts, setLinkedinAccounts] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getLinkedinAccounts = React.useRef(() => {});

  getLinkedinAccounts.current = async () => {
    setLoading(true);
    try {
      const data = await axios
        .get(
          LinkedAccountAPI +
            "/get?" +
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
      setLinkedinAccounts(data.data);
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  const timeZones = TimeZones.map((zone) => {
    return {
      id: zone,
      name: zone,
      value: zone,
    };
  });

  async function connectToLinkedIn() {
    setLoading(true);
    setIsSubmitting(true);

    let data = await saveLinkedInAccount();
    await sendOTP(data);

    setLoading(false);
    setIsSubmitting(false);
  }

  async function saveLinkedInAccount(
    accountDetails: any = null,
    proxy: any = null,
    provideAlerts: boolean = true
  ) {
    let sendProxyDetails = proxy !== null ? proxy : proxyDetails;
    let sendAccountDetails = accountDetails !== null ? accountDetails : account;

    const res = await axios
      .post(LinkedAccountAPI + "/create", {
        uid: user.uid,
        session: user.session,
        access_token: user.access_token,
        proxy: sendProxyDetails,
        account: {
          ...sendAccountDetails,
          workspace_id: currentWorkspace.workspace_id,
          uid: user.uid,
        },
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.status !== ResStatus.Success) {
      if (provideAlerts) {
        alert(res.message);
      }
      return;
    }
    setAccount_id(res.data.account_id);
    return res.data;
  }

  async function sendOTP(data: any) {
    let body;
    if (
      data.proxy_password === "" ||
      data.proxy_password === null ||
      data.proxy_password === undefined
    ) {
      body = {
        email: account.email,
        password: account.password,
        proxy_address: proxyDetails.ip ? proxyDetails.ip : proxyDetails.domain,
        proxy_port: proxyDetails.port,
        proxy_username: proxyDetails.username,
        proxy_password: proxyDetails.password,
      };
    } else {
      body = {
        email: data.email,
        password: data.password,
        proxy_address: data.ip ? data.ip : data.domain,
        proxy_port: data.port,
        proxy_username: data.username,
        proxy_password: data.proxy_password,
      };
    }

    let res2 = await axios
      .put(LinkedAccountAPI + "/otp", {
        uid: user.uid,
        session: user.session,
        access_token: user.access_token,
        account_id: data.account_id,
        workspace_id: currentWorkspace.workspace_id,
        account_details: body,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res2.status !== ResStatus.Success) {
      alert(res2.message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (res2.message === LinkedInAccountMessage.Connected) {
      setLoading(false);
      setIsSubmitting(false);
      window.location.reload();
      return;
    }

    if (res2.message === LinkedInAccountMessage.OTP) {
      setLoading(false);
      setIsSubmitting(false);
      setShow(true);
      handleValueChange(4);
      return;
    }
  }

  async function verifyOTP() {
    setLoading(true);
    setIsSubmitting(true);
    const data = await axios
      .put(LinkedAccountAPI + "/validate", {
        otp: otp,
        uid: user.uid,
        access_token: user.access_token,
        session: user.session,
        account_id: account_id,
        workspace_id: currentWorkspace.workspace_id,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.status !== ResStatus.Success) {
      alert(data.message);
      return;
    }
    window.location.reload();
    setLoading(false);
    setIsSubmitting(false);
  }

  function handleValueChange(num: number) {
    if (num === 2) {
      if (proxyDetails.country === "" && proxyDetails.isCustom === false) {
        setErrors({
          hasError: true,
          field: "country",
          message: "Country is required",
        });
        return;
      }
      if (
        proxyDetails.isCustom === true &&
        (proxyDetails.ip === "" || proxyDetails.port === "")
      ) {
        setErrors({
          hasError: true,
          field: "ip",
          message: "Proxy is required",
        });
        return;
      }
    }
    if (num === 3) {
      if (
        account.timezone === "" ||
        account.active_from === "" ||
        account.active_to === ""
      ) {
        setErrors({
          hasError: true,
          field: "timezone",
          message: "All fields are required",
        });
        return;
      }
    }
    setValues(num);
  }

  function handleProxyChange(name: string, value: any) {
    setProxyDetails({ ...proxyDetails, [name]: value });
  }

  function handleChange(name: string, value: any) {
    setAccount({ ...account, [name]: value });
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  const handleShow = () => setShow(!show);

  function s2ab(s: any) {
    // converting string to array buffer
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  function importLinkedinAccounts(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("xsxs");
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = Xlsx.read(data, { type: "array" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];
      const dataParse = Xlsx.utils.sheet_to_json(ws, { header: 0 });

      if (dataParse.length === 0) {
        alert("No data found in file");
        return;
      }
      dataParse.forEach(async (account: any) => {
        const proxy = {
          country: account["Country"],
          isCustom: account["Is Custom Proxy"] === "Yes" ? true : false,
          isDomain: account["Is Domain Proxy"] === "Yes" ? true : false,
          ip: account["Proxy-IP"],
          domain: account["Proxy-Domain"],
          port: account["Proxy-Port"],
          username: account["Proxy-Username"],
          password: account["Proxy-Password"],
        };
        const accountData = {
          email: account["Email"],
          password: account["Password"],
          status: account["Status"],
          country: account["Country"],
          timezone: account["Timezone"],
          active_from: account["Active From"],
          active_to: account["Active To"],
          workspace_id: currentWorkspace.workspace_id,
          uid: user.uid,
        };
        await saveLinkedInAccount(accountData, proxy, false);
      });
    };
    reader.readAsArrayBuffer(file);
    setLoading(false);
  }

  function exportAccounts() {
    const header = [
      "Email",
      "Password",
      "Status",
      "Country",
      "Timezone",
      "Active From",
      "Active To",
      "Is Custom Proxy",
      "Is Domain Proxy",
      "Proxy-IP",
      "Proxy-Domain",
      "Proxy-Port",
      "Proxy-Username",
      "Proxy-Password",
    ];
    const data = linkedinAccounts.map((account: any) => {
      return [
        linkedinAccounts.email,
        linkedinAccounts.password,
        linkedinAccounts.status,
        linkedinAccounts.country,
        linkedinAccounts.timezone,
        linkedinAccounts.active_from,
        linkedinAccounts.active_to,
        linkedinAccounts.isCustom ? "Yes" : "No",
        linkedinAccounts.isDomain ? "Yes" : "No",
        linkedinAccounts.ip,
        linkedinAccounts.domain,
        linkedinAccounts.port,
        linkedinAccounts.username,
        linkedinAccounts.proxy_password,
      ];
    });

    // craete and download file
    const ws = Xlsx.utils.aoa_to_sheet([header, ...data]);
    const wb = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(wb, ws, "Linkedin Accounts");
    const wbout = Xlsx.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "LinkedinAccounts.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    getLinkedinAccounts.current();
  }, []);

  return (
    <>
      <div className="linkedin-accounts-content">
        <div className="row g-0">
          <div className="col-md-12">
            <div className="content-top d-flex justify-content-end">
              <div className="relative w-auto h-auto">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".xlsx"
                  onChange={importLinkedinAccounts}
                />
                <label
                  htmlFor="fileInput"
                  className="btn btn-primary2 mt-6 md:mt-0 mr-2"
                >
                  Import <TfiImport size={15} className="text-white ml-1" />
                </label>
              </div>
              <button
                className="btn btn-primary2 mt-6 md:mt-0 mr-2"
                onClick={exportAccounts}
              >
                Export <TfiExport size={15} className="text-white ml-1" />
              </button>
              <button
                className="btn btn-primary2 mt-6 md:mt-0"
                onClick={handleShow}
              >
                Add Account <AiOutlinePlus size={18} />
              </button>
            </div>
            <div className="content-main main-bg p-4 mt-3 custom-scrollbar">
              {loading ? (
                <Loader />
              ) : (
                <div className="d-flex flex-wrap">
                  {linkedinAccounts.length === 0 ? (
                    <div className="no-data d-flex justify-content-center align-items-center w-100">
                      <p>No Accounts</p>
                    </div>
                  ) : (
                    linkedinAccounts.map(
                      (linkedin_account: any, idx: number) => {
                        return (
                          <AccountBox
                            key={idx}
                            data={linkedin_account}
                            Reconnect={sendOTP}
                          />
                        );
                      }
                    )
                  )}
                </div>
              )}
            </div>
            <Modal show={show} onHide={handleShow} size="lg" centered>
              <Modal.Header closeButton>
                <Modal.Title>Add New LinkedIn Account</Modal.Title>
              </Modal.Header>
              <div>
                <Modal.Body>
                  {values === 1 && (
                    <ProxyForm
                      values={proxyDetails}
                      handleChange={handleProxyChange}
                      errors={errors}
                    />
                  )}
                  {values === 2 && (
                    <div>
                      <div className="mb-3">
                        <InputSelect
                          label="Your regular location timezone"
                          name="timezone"
                          selectArray={timeZones}
                          onChange={handleChange}
                          defValue=""
                          error={
                            errors.hasError && errors.field === "timezone"
                              ? errors.message
                              : ""
                          }
                        />
                      </div>

                      <Form.Label>Your regular work hours</Form.Label>
                      <div className="d-flex mb-3">
                        <InputSelect
                          label="From"
                          name="active_from"
                          selectArray={workHourOpts}
                          inputClassName="w-1/2 mr-2"
                          onChange={handleChange}
                          defValue=""
                          error={
                            errors.hasError && errors.field === "active_from"
                              ? errors.message
                              : ""
                          }
                        />

                        <InputSelect
                          label="To"
                          name="active_to"
                          selectArray={workHourOpts}
                          inputClassName="w-1/2 "
                          onChange={handleChange}
                          defValue=""
                          error={
                            errors.hasError && errors.field === "active_to"
                              ? errors.message
                              : ""
                          }
                        />
                      </div>
                    </div>
                  )}
                  {values === 3 && (
                    <div>
                      <div className="d-flex mb-3">
                        <BsLinkedin size={40} color={"#15569f"} />
                        <p className="fs-4 ms-3">LinkedIn Sign In</p>
                      </div>
                      <div className="d-flex">
                        <div className="mb-3 me-2 flex-grow-1">
                          <InputEmail
                            name="email"
                            placeholder="Enter LinkedIn Email"
                            onChangeHandler={handleOnChange}
                            defValue=""
                            error={
                              errors.hasError && errors.field === "email"
                                ? errors.message
                                : ""
                            }
                            label="Email"
                          />
                        </div>
                        <div className="mb-3 ms-2 flex-grow-1">
                          <InputPass
                            label="Password"
                            name="password"
                            defValue=""
                            onChangeHandler={handleOnChange}
                            placeholder="Enter LinkedIn Password"
                            error={
                              errors.hasError && errors.field === "password"
                                ? errors.message
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {values === 4 && (
                    <div className="mb-3">
                      <InputNumber
                        label={`  Please enter linkedin verification code that was sent
                        to ${account.email}`}
                        name="code"
                        defValue=""
                        onChangeHandler={handleOnChange}
                        placeholder="Enter LinkedIn Verification Code"
                        error=""
                      />
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  {values > 1 ? (
                    <button
                      className="btn btn-primary2"
                      onClick={() => handleValueChange(values - 1)}
                    >
                      Back
                    </button>
                  ) : (
                    ""
                  )}
                  {values < 3 && values > 0 ? (
                    <button
                      className="btn btn-primary2"
                      onClick={() => handleValueChange(values + 1)}
                    >
                      Next
                    </button>
                  ) : (
                    ""
                  )}
                  {values === 3 ? (
                    <button
                      className="btn btn-primary2"
                      onClick={connectToLinkedIn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Connecting..." : "Connect"}
                    </button>
                  ) : (
                    ""
                  )}
                  {values === 4 ? (
                    <button
                      className="btn btn-primary2"
                      disabled={isSubmitting}
                      onClick={verifyOTP}
                    >
                      {isSubmitting
                        ? "Adding verification code..."
                        : "Add verification code"}
                    </button>
                  ) : (
                    ""
                  )}
                </Modal.Footer>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
