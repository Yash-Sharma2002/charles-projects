import React from "react";
import { BsBriefcase, BsBuilding } from "react-icons/bs";
import { VscWand } from "react-icons/vsc";
import { Button } from "react-bootstrap";
import Avatar from "../common/Avatar";

export default function PipelineItem({ data }: any) {
  return (
    <tr>
      <td>
        <Avatar image={data.linkedin_avatar} />
      </td>
      <td>
        <p className="name">{data.name}</p>
      </td>
      <td>
        <p>
          {/* <BsBriefcase size={13} /> */}
          {data.occupation || "No Occupation"}
        </p>
      </td>
      {/* <td>
        <p>
         {data.current_company || "No Company"}
        </p>
      </td> */}

      <td>
        <p>{data.address || "No Address"}</p>
      </td>

      <td className="capsule-main">
        {data.statuses || "No Status"}
        {/* {data?.statuses?.map((status: any) => {
          return (
            <span
              className="capsule"
              style={{ backgroundColor: status?.color }}
              key={status.id}
            >
              {status?.status}
            </span>
          );
        })} */}
      </td>
      <td>
        <p>{data.enrichEmail || "No Enriched Emails"}</p>
      </td>
      <td>
        <p>{data.email || "No Emails"}</p>
      </td>
      <td>
        <a href={data.profileUrl} target="_blank" rel="noreferrer">
          <button className="btn btn-primary2 min-h-[unset] h-[unset] px-3">
            Link
          </button>
        </a>
      </td>
    </tr>
  );
}
