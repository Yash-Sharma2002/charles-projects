import { BsBriefcase } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import Avatar from "../common/Avatar";
import { AppContext } from "../../context/Context";
import React from "react";
import axios from "axios";
import { CampaignAPI } from "../../constants/api";
import ResStatus from "../../constants/ResStatus";

export default function PipelineItem(props: {
  data: any;
  items: any;
  setItems: any;
}) {
  const { user, setLoading } = React.useContext(AppContext);

  async function enrich() {
    setLoading(true);
    let email = await axios
      .post(CampaignAPI + "/pipeline/enrich", {
        uid: user.uid,
        session: user.session,
        access_token: user.access_token,
        id: props.data.Id,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);

      console.log(email);

    if (email.status === ResStatus.Success) {
      let temp = [...props.items];
      temp.forEach((item: any) => {
        if (item.Id === props.data.Id) {
          item.Email = email.data;
        }
      });
      props.setItems(temp);
    } else {
      alert(email.message);
    }
    setLoading(false);
  }


  return (
    <tr>
      <td>
        <Avatar image={props.data.ProfileImage} />
      </td>
      <td>{props.data.FirstName}</td>
      <td>{props.data.LastName}</td>
      <td>{props.data.Company}</td>
      <td>{props.data.Position}</td>
      <td>{props.data.Title}</td>
      <td>
        {props.data.Email ? (
          props.data.Email
        ) : (
          <button
          onClick={enrich}
          className="flex w-max btn-secondary p-2 rounded-md justify-start items-center">
            <BsBriefcase className="mr-1" /> Enrich
          </button>
        )}
      </td>
      <td>{props.data.Address}</td>
      <td>{props.data.Campaign}</td>
      <td>{props.data.isConnected ? "Yes" : "No"}</td>
      <td>{props.data.ConnectionRequestSend ? "Yes" : "No"}</td>
      <td>{props.data.ConnectionMessage}</td>
      <td>{props.data.Likes}</td>
      <td>{props.data.isMessage ? "Yes" : "No"}</td>
      <td>{props.data.message}</td>
      <td>{props.data.isInMail ? "Yes" : "No"}</td>
      <td>{props.data.inmail}</td>
      <td>
        <a
          href={props.data.ProfileLink}
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer"
        >
          <FaExternalLinkAlt className="text-primary" />
        </a>
      </td>
    </tr>
  );
}
