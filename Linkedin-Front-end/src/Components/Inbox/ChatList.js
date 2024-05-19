import React from 'react';
import Searchbar from '../Inputs/Searchbar';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { FiFilter } from "react-icons/fi";
import ChatItem from './ChatItem';
import { useEffect } from 'react';
import Loader from '../UI/Loader';

export default function ChatList({
    rooms, activeChat, setActiveChat,
    setLead, setAppointment, setDeal, setUnread, setSearchTerm,
    campaigns, includeCampaigns, setIncludeCampaigns,
    labels, includeLabels, setIncludeLabels,
    unReadMessagesOnly, setUnReadMessagesOnly,
    includePlatforms, setIncludePlatforms,
}) {

    return (
        <div className='chat-list primary-light-bg p-3 me-2'>
            <div className='d-flex align-items-center justify-content-between'>
                <Searchbar setSearchTerm={setSearchTerm} />
                <Dropdown autoClose='outside' className='chat-filter'>
                    <Dropdown.Toggle variant='primary'>
                        <FiFilter size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='shadow-sm p-3 custom-scrollbar' align='end'>
                        <p className='section-heading'>Campaigns</p>
                        {
                            campaigns.map((campaign) => {
                                return <Form.Check
                                    key={campaign.id}
                                    checked={includeCampaigns.includes(campaign.id)}
                                    onChange={(e) => {
                                        e.target.checked ? (
                                            setIncludeCampaigns([
                                                ...includeCampaigns,
                                                campaign.id
                                            ])
                                        ) : (
                                            setIncludeCampaigns(includeCampaigns.filter((campaignId) => campaignId !== campaign.id))
                                        )
                                    }}
                                    type='checkbox'
                                    name={`by-camps-${campaign.id}`}
                                    label={campaign.name}
                                />
                            })
                        }
                        <p className='section-heading mt-3'>Statistics</p>
                        <Form.Check
                            type='checkbox'
                            name='by-stats-1'
                            label='Email Open Rate'
                        />
                        <Form.Check
                            type='checkbox'
                            name='by-stats-2'
                            label='Bounce Rate'
                        />
                        <p className='section-heading mt-3'>Filters</p>
                        <Form.Check
                            type='checkbox'
                            name='by-filters-1'
                            label='Unread Messages'
                            checked={unReadMessagesOnly}
                            onChange={(e) => setUnReadMessagesOnly(e.target.checked)}
                        />
                        <Form.Check
                            type='checkbox'
                            name='by-filters-2'
                            label='Linkedin Messages Only'
                            checked={includePlatforms.includes("Linkedin")}
                            onChange={(e) => {
                                e.target.checked ? (
                                    setIncludePlatforms([
                                        ...includePlatforms,
                                        "Linkedin"
                                    ])
                                ) : (
                                    setIncludePlatforms(includePlatforms.filter((platform) => platform !== "Linkedin"))
                                )
                            }}
                        />
                        <Form.Check
                            type='checkbox'
                            name='by-filters-3'
                            label='Linkedin Sales Navigator Only'
                            checked={includePlatforms.includes("Linkedin Sales")}
                            onChange={(e) => {
                                e.target.checked ? (
                                    setIncludePlatforms([
                                        ...includePlatforms,
                                        "Linkedin Sales"
                                    ])
                                ) : (
                                    setIncludePlatforms(includePlatforms.filter((platform) => platform !== "Linkedin Sales"))
                                )
                            }}
                        />
                        <p className='section-heading mt-3'>Campaign Status</p>
                        <Form.Check
                            type='checkbox'
                            name='by-campstatus-1'
                            label='Got Reply'
                        />
                        <Form.Check
                            type='checkbox'
                            name='by-campstatus-2'
                            label='Lead'
                        />
                        <Form.Check
                            type='checkbox'
                            name='by-campstatus-3'
                            label='Customer'
                        />
                        <p className='section-heading mt-3'>Labels</p>
                        {

                            labels.map((label, index) => {
                                return <Form.Check
                                    key={index}
                                    type='checkbox'
                                    name={`by-labels-${index}`}
                                    label={label.name}
                                    checked={includeLabels.includes(label.id)}
                                    onChange={(e) => {
                                        e.target.checked ? (
                                            setIncludeLabels([
                                                ...includeLabels,
                                                label.id
                                            ])
                                        ) : (
                                            setIncludeLabels(includeLabels.filter((labelId) => labelId !== label.id))
                                        )
                                    }}
                                />
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className='d-flex flex-wrap my-3'>
                <Button
                    variant='tab'
                    onClick={() => {
                        setUnReadMessagesOnly(false)
                        setIncludeLabels(
                            includeLabels.filter(
                                (labelId) => !labels.filter((label) => label.default_label).map((item) => item.id).includes(labelId)
                            )
                        )
                    }}
                    className={'me-1 mb-1 ' + (!unReadMessagesOnly && !includeLabels.length ? 'active' : '')}
                >
                    All
                </Button>
                <Button
                    variant='tab'
                    onClick={() => setUnReadMessagesOnly(!unReadMessagesOnly)}
                    className={'me-1 mb-1 ' + (unReadMessagesOnly ? 'active' : '')}
                >
                    Unread
                </Button>
                {
                    labels.filter((label) => label.default_label).map((label, index) => {
                        return <Button
                            variant='tab'
                            onClick={(e) => {
                                !e.target.classList.contains("active") ? (
                                    setIncludeLabels([
                                        ...includeLabels,
                                        label.id
                                    ])
                                ) : (
                                    setIncludeLabels(includeLabels.filter((labelId) => labelId !== label.id))
                                )
                            }}
                            className={'me-1 mb-1 ' + (includeLabels.includes(label.id) ? 'active' : '')}
                        >
                            {label.name}
                        </Button>
                    })
                }
            </div>
            <div className='chat-list-items custom-scrollbar mt-2'>
                {
                    rooms.map((room) => {
                        return <ChatItem
                            key={room.id}
                            room={room}
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                            setLead={setLead}
                            setAppointment={setAppointment}
                            setDeal={setDeal}
                            setUnread={setUnread}
                        />
                    })
                }
            </div>
        </div>
    )
}
