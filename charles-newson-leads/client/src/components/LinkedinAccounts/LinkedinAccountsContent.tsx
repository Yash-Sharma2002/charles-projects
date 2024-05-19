import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsLinkedin } from "react-icons/bs";

import ProxyForm from "./ProxyForm";
import InputSelect from "../input/InputSelect";
import InputEmail from "../input/InputEmail";
import InputPass from "../input/InputPass";
import InputNumber from "../input/InputNumber";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import { AppContext } from "../../context/Context";
import UserErrorInterface from "../../interface/UserErrorInterface";
import AccountBox from "./AccountBox";
import { TimeZones } from "../../constants/Timezones";
import Loader from "../loader/Loader";

export default function LinkedinAccountsContent() {
  const { user, currentWorkspace } = React.useContext(AppContext);

  const workHourOpts = [
    {
      id: "00:00",
      name: "00:00",
      value: "00:00",
    },
    {
      id: "01:00",
      name: "01:00",
      value: "01:00",
    },
    {
      id: "02:00",
      name: "02:00",
      value: "02:00",
    },
    {
      id: "03:00",
      name: "03:00",
      value: "03:00",
    },
    {
      id: "04:00",
      name: "04:00",
      value: "04:00",
    },
    {
      id: "05:00",
      name: "05:00",
      value: "05:00",
    },
    {
      id: "06:00",
      name: "06:00",
      value: "06:00",
    },
    {
      id: "07:00",
      name: "07:00",
      value: "07:00",
    },
    {
      id: "08:00",
      name: "08:00",
      value: "08:00",
    },
    {
      id: "09:00",
      name: "09:00",
      value: "09:00",
    },
    {
      id: "10:00",
      name: "10:00",
      value: "10:00",
    },
    {
      id: "12:00",
      name: "12:00",
      value: "12:00",
    },
    {
      id: "13:00",
      name: "13:00",
      value: "13:00",
    },
    {
      id: "14:00",
      name: "14:00",
      value: "14:00",
    },
    {
      id: "15:00",
      name: "15:00",
      value: "15:00",
    },
    {
      id: "16:00",
      name: "16:00",
      value: "16:00",
    },
    {
      id: "17:00",
      name: "17:00",
      value: "17:00",
    },
    {
      id: "18:00",
      name: "18:00",
      value: "18:00",
    },
    {
      id: "19:00",
      name: "19:00",
      value: "19:00",
    },
    {
      id: "20:00",
      name: "20:00",
      value: "20:00",
    },
    {
      id: "21:00",
      name: "21:00",
      value: "21:00",
    },
    {
      id: "22:00",
      name: "22:00",
      value: "22:00",
    },
    {
      id: "23:00",
      name: "23:00",
      value: "23:00",
    },
  ];

  const [errors, setErrors] = useState<UserErrorInterface>(
    {} as UserErrorInterface
  );

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [account_id, setAccount_id] = useState("");

  const [values, setValues] = useState(1);

  const [accDetails, setAccDetails] = useState<any>({
    country: "",
    use_custom_proxy: false,
    isDomain: false,
    custom_proxy_server: "",
    custom_proxy_port: "",
    username: "",
    password: "",
    code: "",
    timezone: "",
    from_hour: "",
    to_hour: "",
    linkedin_username: "",
    linkedin_password: "",
  });

  const [linkedinAccounts, setLinkedinAccounts] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLinkedinAccounts = React.useRef(() => {});

  getLinkedinAccounts.current = async () => {
    setLoading(true);
    const data = await axios
      .get(
        BASE_URL +
          "/get-linkedin-accounts?" +
          new URLSearchParams({
            uid: user.uid,
            workspace_id: currentWorkspace.workspace_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.message !== "Accounts") {
      alert(data.message);
      setLoading(false);
      return;
    }
    setLinkedinAccounts(data.data);
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
    const data = await axios
      .post(BASE_URL + "/connect-linkedin", {
        ...accDetails,
        uid: user.uid,
        access_token: user.access_token,
        session: user.session,
        workspace_id: currentWorkspace.workspace_id,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.message === "OTP Required") {
      setLoading(false);
      setIsSubmitting(false);
      setAccount_id(data.account_id);
      handleValueChange(4);
      return;
    }
    if (data.message === "Connected") {
      setLoading(false);
      setIsSubmitting(false);
      window.location.reload();
      return;
    }else if (data.message) {
      alert(data.message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }
    setLoading(false);
    setIsSubmitting(false);
    setAccount_id(data.account_id);
    handleValueChange(4);
  }

  async function verifyOTP() {
    setLoading(true);
    setIsSubmitting(true);
    const data = await axios
      .post(BASE_URL + "/verify-otp", {
        otp: accDetails.code,
        uid: user.uid,
        access_token: user.access_token,
        session: user.session,
        account_id: account_id,
        workspace_id: currentWorkspace.workspace_id,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if(data.message === "OTP Verified"){
      setLoading(false);
      setIsSubmitting(false);
      window.location.reload();
      return;
    }  
    if (data.message) {
      alert(data.message);
      setLoading(false);
      setIsSubmitting(false);
      return;
    }
    setLoading(false);
    setIsSubmitting(false);
    // window.location.reload();
  }

  function handleValueChange(num: number) {
    if (num === 2) {
      if (accDetails.country === "" && accDetails.use_custom_proxy === false) {
        setErrors({
          hasError: true,
          field: "country",
          message: "Country is required",
        });
        return;
      }
      if (
        accDetails.use_custom_proxy === true &&
        (accDetails.custom_proxy_server === "" ||
          accDetails.custom_proxy_port === "")
      ) {
        setErrors({
          hasError: true,
          field: "custom_proxy_server",
          message: "Proxy is required",
        });
        return;
      }
    }
    if (num === 3) {
      if (
        accDetails.timezone === "" ||
        accDetails.from_hour === "" ||
        accDetails.to_hour === ""
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

  function handleChange(type: string, value: string | boolean) {
    setAccDetails({ ...accDetails, [type]: value });
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAccDetails({ ...accDetails, [e.target.name]: e.target.value });
  }

  const handleShow = () => setShow(!show);

  useEffect(() => {
    getLinkedinAccounts.current();
  }, []);

  return (
    <div className="linkedin-accounts-content">
      <div className="row g-0">
        <div className="col-md-12">
          <div className="content-top d-flex justify-content-end">
            <div>
              <button className="btn btn-primary2 mt-6 md:mt-0" onClick={handleShow}>
                Add New Account <AiOutlinePlus size={18} />
              </button>
            </div>
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
                  linkedinAccounts.map((linkedin_account: any, idx: number) => {
                    return (
                      <AccountBox
                        key={idx}
                        data={linkedin_account}
                        // refetch={linkedinAccountsRefetch}
                        // setSelectedLinkedinAccount={setSelectedLinkedinAccount}
                        // setReconnectShow={setReconnectShow}
                      />
                    );
                  })
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
                    values={accDetails}
                    handleChange={handleChange}
                    errors={errors}
                    onChange={handleOnChange}
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
                        name="from_hour"
                        selectArray={workHourOpts}
                        inputClassName="w-1/2 mr-2"
                        onChange={handleChange}
                        defValue=""
                        error={
                          errors.hasError && errors.field === "from_hour"
                            ? errors.message
                            : ""
                        }
                      />

                      <InputSelect
                        label="To"
                        name="to_hour"
                        selectArray={workHourOpts}
                        inputClassName="w-1/2 "
                        onChange={handleChange}
                        defValue=""
                        error={
                          errors.hasError && errors.field === "to_hour"
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
                          name="linkedin_username"
                          placeholder="Enter LinkedIn Email"
                          onChangeHandler={handleOnChange}
                          defValue=""
                          error={
                            errors.hasError &&
                            errors.field === "linkedin_username"
                              ? errors.message
                              : ""
                          }
                          label="Email"
                        />
                      </div>
                      <div className="mb-3 ms-2 flex-grow-1">
                        <InputPass
                          label="Password"
                          name="linkedin_password"
                          defValue=""
                          onChangeHandler={handleOnChange}
                          placeholder="Enter LinkedIn Password"
                          error={
                            errors.hasError &&
                            errors.field === "linkedin_password"
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
                        to ${accDetails.linkedin_username}`}
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
  );
}
