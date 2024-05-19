import axios from "axios";
import { BsFillChatTextFill } from "react-icons/bs";
import { BASE_URL, LinkedAccountAPI } from "../../constants/api";
import { AppContext } from "../../context/Context";
import React from "react";
import ResStatus from "../../constants/ResStatus";
import Status from "../../constants/Status";

export default function AccountBox({ data,Reconnect }: { data: any,Reconnect:any }) {
  const { user } = React.useContext(AppContext);

  async function deleteAccount() {
    const res = await axios
      .delete(
        LinkedAccountAPI +
          "/delete?" +
          new URLSearchParams({
            uid: user.uid,
            account_id: data.account_id,
            access_token: user.access_token,
            session: user.session,
          })
      )
      .then((res) => res.data).catch((err) => err.response.data);

    if (res.status === ResStatus.Success) {
      window.location.reload();
    }
  }

  async function disconnectAccount() {
    const res = await axios
      .put(
        LinkedAccountAPI +
          "/disconnect" ,{
            uid: user.uid,
            account_id: data.account_id,
            access_token: user.access_token,
            session: user.session,
          }
      )
      .then((res) => res.data).catch((err) => err.response.data);

    if (res.status !== ResStatus.Success) {
      alert(res.message);
      return
    }
    window.location.reload();
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
          className={data.status === Status.Connected ? "active me-1" : "inactive me-1"}
        ></span>
      {data.status === Status.Connected ? "Active" : "Inactive"}
      </div>
      <p className="email mb-0">{data.email}</p>
      <p className="connect-status">
        {data.status === Status.Connected  ? "Connected to Linkedin" : "Not Connected"}
      </p>
      <div className="flex justify-center items-center">
        {data.status === Status.Connected  ? (
          <button className="btn btn-primary2" onClick={disconnectAccount}>
            Disconnect
          </button>
        ) : (
          <button
            className="btn btn-primary2"
            onClick={()=>Reconnect(data)}
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
