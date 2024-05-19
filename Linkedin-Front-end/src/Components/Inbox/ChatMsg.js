import React from 'react';
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import routes from '../../Config/routes/api';
import Avatar from '../UI/Avatar';

const { buildAvatarRoute } = routes;

export default function ChatMsg({ message, room }) {
  return (
    <div className={`chat-msg mb-2 d-flex align-items-end justify-content-end ${message.message_from === "Prospect" ? 'other' : 'me'}`}>
        <div className='msg-content mx-1'>
            <div className='msg p-3'>
                {message.message ? message.message.replace('{first_name}', room.prospect_details.first_name) : message.message}
            </div>
            <div className='meta mt-1 d-flex align-items-center'>
                {/* <span className='date me-1'>{data.date}</span> */}
                <span className='dot-separator me-1'></span>
                <span className='time me-1'>{message.time}</span>
                {
                    message.type !== 'Prospect' ?
                    <span className={'sent'}>
                        {
                            <HiCheckCircle size={13} />
                            // data.sentStatus ? <HiCheckCircle size={13} /> : <HiExclamationCircle size={13} />
                        }
                    </span> :
                    ''
                }
            </div>
        </div>
        <Avatar image={message.message_from === "Prospect" ? buildAvatarRoute(room.prospect_details.linkedin_avatar) : room.linkedin_account.avatar} />
    </div>
  )
}
