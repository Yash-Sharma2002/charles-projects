import axios from "axios";
import { BsFillChatTextFill } from "react-icons/bs";
import { BASE_URL } from "../../constants/api";
import { AppContext } from "../../context/Context";
import React from "react";

export default function AccountBox({
  data,
}: // refetch,
// setSelectedLinkedinAccount,
// setReconnectShow,
{
  data: any;
  // refetch: any;
  // setSelectedLinkedinAccount: any;
  // setReconnectShow: any;
}) {
  const { user } = React.useContext(AppContext);

  async function deleteAccount() {
    const res = await axios
      .delete(
        BASE_URL +
          "/delete-account?" +
          new URLSearchParams({
            uid: user.uid,
            account_id: data.account_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data);

    if (res.message === "Account Deleted") {
      window.location.reload();
    }
  }

  async function disconnectAccount() {
    const res = await axios
      .delete(
        BASE_URL +
          "/delete-cookies?" +
          new URLSearchParams({
            uid: user.uid,
            account_id: data.account_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data);

    if (res.message === "Cookies Deleted") {
      window.location.reload();
    }else{
      alert("Error in disconnecting account")
    }
  }

  return (
    <div className="account-box box-card text-center p-4 me-4 mb-3">
      <span className="unread-msg py-1 px-2">
        <BsFillChatTextFill size={13} className="me-1" />{" "}
        {/* {data.msgCount ? data.msgCount : 0} */}
      </span>
      {/* <Avatar src={data.avatar} /> */}
      <div className="active-status mt-2 mb-2">
        <span
          className={data.otpVerified ? "active me-1" : "inactive me-1"}
        ></span>
        {data.otpVerified ? "Active" : "Inactive"}
      </div>
      <p className="email mb-0">{data.name || data.linkedin_username}</p>
      <p className="connect-status">
        {data.otpVerified ? "Connected to Linkedin" : "Not Connected"}
      </p>
      <div className="flex justify-center items-center">
        {data.otpVerified ? (
          <button className="btn btn-primary2" onClick={disconnectAccount}>
            Disconnect
          </button>
        ) : (
          <button
            className="btn btn-primary2"
            onClick={() => {
              // setSelectedLinkedinAccount(data);
              // setReconnectShow(true);
            }}
          >
            Reconnect
          </button>
        )}
        <button
          onClick={deleteAccount}
          className="btn btn-red capitalize min-h-[unset] h-[unset] ml-2 py-[13px]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
