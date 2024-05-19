import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { MdOutlineMarkEmailUnread, MdOutlineRefresh, MdOutlinePersonSearch } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoCalendarOutline } from "react-icons/io5";
import { BsHandThumbsUp } from "react-icons/bs";
import Avatar from '../UI/Avatar';

import routes from '../../Config/routes/api';
import { getRecord } from '../../Config/apiFunctions';
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";


const { buildAvatarRoute } = routes;


export default function ChatItem({
    room, activeChat,
    setActiveChat, setLead,
    setAppointment,
    setDeal, setUnread
}) {
    const user = useSelector(selectProfile);

    const selectChat = (e) => {
        if (e.target.classList.contains('menu-element')) {
            e.stopPropagation();
        }
        else {
            setActiveChat(room);
        }
    };

    const statusColor = () => {
        switch (room.msgStatus) {
            case 'Contacted':
                return 'blue-color';
            case 'Connected':
                return 'orange-color';
            case 'Replied':
                return 'purple-color';
            default:
                break;
        }
    };

    const selectLabelColor = (color) => {
        switch (color) {
            case "#f44336":
                return 'red-color';
            case "#e91e63":
                return 'pink-color';
            case "#9c27b0":
                return 'light-purple-color';
            case "#673ab7":
                return 'purple-color';
            case "#3f51b5":
                return 'dark-blue-color';
            case "#009688":
                return 'sea-green-color';
            case "#795548":
                return 'brown-color';
            case "#607d8b":
                return 'grey-color';
            default:
                break;
        }
    };

    return (
        <div className={'chat-item-wrapper ' + ((room.total_customer_messages - room.customer_message_readed) ? 'unread ' : '') + (activeChat.id === room.id ? 'active ' : '')} onClick={selectChat}>
            <div className='chat-item d-flex'>
                <Avatar image={buildAvatarRoute(room.prospect_details.linkedin_avatar)} />
                <div className='item-content ms-3 flex-grow-1'>
                    <p className='name fw-600 mb-0'>{room.prospect_details.name}</p>
                    <p className='last-msg mb-1'>{room.last_message.message ? room.last_message.message.replace('{first_name}', room.prospect_details.first_name) : room.last_message.message}</p>
                    <div className='item-status d-flex justify-content-end'>
                        <div className='status-right'>
                            <span className={'msg-status ' + (statusColor())}>Replied</span>
                            <span className='dot-separator'></span>
                            <span className='time'>{room.last_message.time}</span>
                        </div>
                    </div>
                </div>
                <Dropdown className='chat-item-menu menu-element'>
                    <Dropdown.Toggle variant='action' className='menu-element'>
                        <BiDotsVerticalRounded size={18} className='menu-element' />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='user-menu shadow-sm menu-element'>
                        <Dropdown.Item className='link d-flex menu-element' onClick={() => setUnread(room.id)}>
                            <MdOutlineMarkEmailUnread size={18} className={'menu-element'} />
                            {
                                room.unread ?
                                    <p className='menu-element'>Mark as Read</p> :
                                    <p className='menu-element'>Mark as Unread</p>
                            }
                        </Dropdown.Item>
                        <Dropdown.Item className='link d-flex menu-element'>
                            <MdOutlineRefresh size={18} className={'menu-element'} />
                            <p className='menu-element'>Refresh Dialog</p>
                        </Dropdown.Item>
                        <Dropdown.Item className='link d-flex menu-element' onClick={() => setLead(room.id)}>
                            <MdOutlinePersonSearch size={18} className={'menu-element'} />
                            {
                                room.lead ?
                                    <p className='menu-element'>Remove from Lead</p> :
                                    <p className='menu-element'>Add to Lead</p>
                            }
                        </Dropdown.Item>
                        <Dropdown.Item className='link d-flex menu-element' onClick={() => setAppointment(room.id)}>
                            <IoCalendarOutline size={18} className={'menu-element'} />
                            {
                                room.appointment ?
                                    <p className='menu-element'>Remove from Appointment</p> :
                                    <p className='menu-element'>Add to Appointment</p>
                            }
                        </Dropdown.Item>
                        <Dropdown.Item className='link d-flex menu-element' onClick={() => setDeal(room.id)}>
                            <BsHandThumbsUp size={18} className={'menu-element'} />
                            {
                                room.deal ?
                                    <p className='menu-element'>Remove from Deal</p> :
                                    <p className='menu-element'>Add to Deal</p>
                            }
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className='labels d-flex flex-wrap align-items-center'>
                {
                    room.lead &&
                    <span className='green-color'>
                        Lead
                    </span>
                }
                {
                    room.appointment &&
                    <span className='light-blue-color'>
                        Appointment
                    </span>
                }
                {
                    room.deal &&
                    <span className='yellow-color'>
                        Deal
                    </span>
                }
                {
                    room.prospect_labels.map((item, index) => {
                        return item.active ?
                            <span key={index} className={item.active && selectLabelColor(item.color)}>
                                {item.active && item.name}
                            </span> :
                            ''
                    })
                }
            </div>
        </div>
    )
}
