import React from "react";
import { BsBriefcase, BsBuilding } from "react-icons/bs";
import { VscWand } from "react-icons/vsc";
import { Button } from 'react-bootstrap';
import Avatar from '../UI/Avatar';

export default function PipelineItem({ data }) {
    return (
        <tr>
            <td>
                <Avatar image={data.linkedin_avatar} />
            </td>
            <td>
                <p className='name'>{data.name}</p>
            </td>
            <td>
                <p><BsBriefcase size={13} /> {data.occupation}</p>
                <p><BsBuilding size={13} /> {data.current_company}</p>
            </td>
            <td>
                {data.connection_request_sent && !data.connected ?
                    (
                        <p className='status'>Connection Request Sent</p>
                    ) : null
                }

        {/* {data.connection_request_sent && !data.connected ? (
          <p className="status">Connection Request Sent</p>
        ) : null} */}

        {/* {!data.connection_request_sent &&
        !data.connection_request_failed &&
        !data.connected &&
        !data.state &&
        !data.state_status ? (
          <p className="status">Pending</p>
        ) : null} */}

        {/* {data.connected && data.connection_request_sent ? (
          <p className="status">Connected</p>
        ) : null} */}

        {/* {data.statuses.map((status) => {
          return <p className="status">{status.status}</p>;
        })} */}
      </td>
      <td>
        <p>
          <BsBriefcase size={13} /> {data.occupation}
        </p>
        <p>
          <BsBuilding size={13} /> {data.current_company}
        </p>
      </td>
      <td className="capsule-main">
        {data?.statuses?.map((status) => {
          return <span className="capsule" style={{backgroundColor : status?.color}} key={status.id}>{status?.status}</span>;
        })}
      </td>
      <td>
        <p>{data.enrichEmail || "No Enriched Emails"}</p>
      </td>
      <td>
        <p>{data.email || "No Emails"}</p>
      </td>
    </tr>
  );
}
