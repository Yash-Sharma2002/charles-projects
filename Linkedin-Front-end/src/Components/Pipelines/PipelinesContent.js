import React, { useState, useRef, useEffect } from 'react';
import { HiDownload } from "react-icons/hi";
import { Dropdown, Button, Form, Accordion, Tabs, Tab } from 'react-bootstrap';
import Searchbar from '../Inputs/Searchbar';
import axios from "axios";
import { BsMegaphone, BsBarChart, BsReply } from "react-icons/bs";
import { IoPricetagOutline } from "react-icons/io5";
import { AiOutlineUser, AiOutlineEye } from "react-icons/ai";
import Pagination from '../UI/Pagination';

import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import { getRecord } from '../../Config/apiFunctions';
import { useQuery } from "react-query";
import routes from '../../Config/routes/api';

import PipelineItem from './PipelineItem';
import Loader from '../UI/Loader';
import { ToastContainer } from 'react-toastify';


const { prospectsRoute, campaignRoute, labelsRoute } = routes;


export default function PipelinesContent() {
    const user = useSelector(selectProfile);
    const [peopleCount, setPeopleCount] = useState(0);
    const peopleCountRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    const [prospects, setProspects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [labels, setLabels] = useState([]);
    const [campaignSelected, setCampaignSelected] = useState({});
    const [labelSelected, setLabelSelected] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    
      const statuses = [
        {
          id: '23',
          title: 'Waiting in queue'
        },
        {
          id: '24',
          title: 'Contacted'
        },
        {
          id: '25',
          title: 'Connected'
        },
        {
          id: '26',
          title: 'Unconnectable'
        },
        {
          id: '27',
          title: 'Got Reply'
        },
        {
          id: '28',
          title: 'Lead'
        },
        {
          id: '29',
          title: 'Customer'
        }
      ];

      const profileOptions = [
        {
            id: '30',
            title: 'Default'
        },
        {
            id: '31',
            title: 'Opened'
        },
        {
            id: '32',
            title: 'Closed'
        }
      ];

      const viewedOptions = [
        {
            id: '33',
            title: 'Default'
        },
        {
            id: '34',
            title: 'Viewed'
        },
        {
            id: '35',
            title: 'Not Viewed'
        }
      ];

    //   const labels = [
    //     {
    //         id: '40',
    //         title: 'Lead'
    //     },
    //     {
    //         id: '41',
    //         title: 'Appointment'
    //     }
    //   ];


      const pipelines = [
        {
            id: '36',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '37',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Replied'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '38',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '39',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '40',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '41',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '42',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '43',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '44',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '45',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '46',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '47',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        },
        {
            id: '48',
            linkedin_avatar: '/images/account/account.jpg',
            name: 'Chris Evans',
            statuses: ['Connected'],
            occupation: 'Digital Marketer & Social  Media Manager',
            current_company: 'upwork.com',
            enrichEmail: '',
            workPersEmail: 'No Emails'
        }
      ];

    const [pipelineCurrentItems, setPipelineCurrentItems] = useState([]);

    const {
        refetch: refetchProspects,
        data: prospectsList,
    } = useQuery(
        ["prospects", user, searchTerm, campaignSelected, labelSelected],
        () =>
            getRecord(`${prospectsRoute}?search=${searchTerm}&campaign_linkedin_account__campaign=${campaignSelected.id || ''}&prospect_labels__label=${labelSelected.id || ''}`, user),
        { enabled: !!user.token }
    );

    const {
        refetch: refetchCampaigns,
        data: campaignsList,
    } = useQuery(
        ["campaigns", user],
        () =>
            getRecord(
                `${campaignRoute}`,
                user
            ),
        { enabled: !!user.token }
    );

    const {
        refetch: refetchLabels,
        data: labelsList,
    } = useQuery(
        ["labels", user],
        () =>
            getRecord(`${labelsRoute}`, user),
        { enabled: !!user.token }
    );

    useEffect(() => {
        if (!labelsList) return
        setLabels(labelsList)
    }, [labelsList])

    useEffect(() => {
        if (!campaignsList) return
        setCampaigns(campaignsList)
    }, [campaignsList])

    useEffect(() => {
        if (!prospectsList) return
        setProspects(prospectsList)
    }, [prospectsList])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, [isLoading]);

  return (
    <div className='pipelines-content'>
        <div className='row g-0'>
            <div className='col-md-12'>
                <div className='content-top d-flex justify-content-end mb-3'>
                    <Dropdown className='people-count-filter' autoClose='outside'>
                        <Dropdown.Toggle variant='primary' className='filter-dropdown me-2'>
                            <span>{peopleCount}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='p-2'>
                            <div className='d-flex align-items-center mb-2'>
                                <Form.Label className='me-2 flex-grow-1'>Select no. of people</Form.Label>
                                <Form.Control type='number' name='select-people-count' ref={peopleCountRef} />
                            </div>
                            <Button 
                                variant='primary'
                                className='w-100 p-1'
                                onClick={() => setPeopleCount(peopleCountRef.current.value)}
                                disabled={isLoading}
                                >
                                Apply Selection
                            </Button>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Searchbar />
                    <Button variant='primary' className='ms-3' disabled={isLoading}>Export as CSV <HiDownload size={18} /></Button>
                </div>
                <div className='row g-0'>
                    <div className='col-md-9'>
                        <div className='content-section main-bg p-4 me-3 custom-scrollbar'>
                            <Tabs
                                defaultActiveKey="my-pipes"
                                id="pipelines-tabs"
                                className="custom-tabs pb-3"
                                >
                                <Tab eventKey="my-pipes" title="My Pipelines">
                                    <div className='table-responsive'>
                                        <table className='table table-borderless align-middle pipelines-table'>
                                            <thead>
                                                <tr>
                                                    <th>Photo</th>
                                                    <th>Name</th>
                                                    <th>Position / Company</th>
                                                    <th>Statuses</th>
                                                    <th>Enriched Email</th>
                                                    <th>Work / Personal Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    isLoading ?
                                                    <tr className='no-data'>
                                                        <td colSpan={6}>
                                                            <Loader />
                                                        </td>
                                                    </tr> :
                                                    <>
                                                        {
                                                            prospects.length === 0 ?
                                                            <tr className='no-data'>
                                                                <td colSpan={6}>
                                                                    <p>No Prospects</p>
                                                                </td>
                                                            </tr> :
                                                            pipelineCurrentItems.map((prospect) => {
                                                                return <PipelineItem key={prospect.id} data={prospect} />
                                                            })
                                                        }
                                                    </>
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            !isLoading && prospects.length > 10 &&
                                            <div className='d-flex justify-content-end'>
                                                <Pagination 
                                                    data={prospects}
                                                    setCurrentItems={setPipelineCurrentItems}
                                                    />
                                            </div>
                                        }
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='filter-section main-bg p-3 custom-scrollbar'>
                            <p className='fw-600'>Filters</p>
                            <Accordion className='mt-2' flush>
                            <Accordion.Item eventKey="3-0" className='mb-2'>
                                <Accordion.Header><IoPricetagOutline size={17} className='me-3' /> Labels</Accordion.Header>
                                <Accordion.Body>
                                    <Form.Check 
                                        type='radio'
                                        id='all-labels'
                                        name='labels'
                                        defaultChecked
                                        onChange={(e) => setLabelSelected({})}
                                        label='Show Prospects From All Labels'
                                    />
                                    {labels.map((label) => {
                                        return <Form.Check 
                                            key={label.id}
                                            type='radio'
                                            onClick={(e) => setLabelSelected(label)}
                                            id={`labels-${label.id}`}
                                            name='labels'
                                            label={label.name}
                                        />;
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3-1" className='mb-2'>
                                <Accordion.Header><BsMegaphone size={15} className='me-3' /> Campaigns</Accordion.Header>
                                <Accordion.Body>
                                    <Form.Check 
                                        type='radio'
                                        id='all-campaigns'
                                        name='campaigns'
                                        defaultChecked
                                        onChange={(e) => setCampaignSelected({})}
                                        label='Show Prospects From All Campaigns'
                                    />
                                    {campaigns.map((campaign) => {
                                        return <Form.Check 
                                            key={campaign.id}
                                            type='radio'
                                            onClick={(e) => setCampaignSelected(campaign)}
                                            id={`campaigns-${campaign.id}`}
                                            name={'campaigns'}
                                            label={campaign.name}
                                        />;
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3-2" className='mb-2'>
                                <Accordion.Header><BsBarChart size={17} className='me-3' /> Statuses</Accordion.Header>
                                <Accordion.Body>
                                    {statuses.map((item) => {
                                        return <Form.Check 
                                            key={item.id}
                                            type='checkbox'
                                            id={'period-'+item.id}
                                            name={'periods'}
                                            label={item.title}
                                        />;
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3-3" className='mb-2'>
                                <Accordion.Header><AiOutlineUser size={17} className='me-3' /> Profile Options</Accordion.Header>
                                <Accordion.Body>
                                    {profileOptions.map(function(item){
                                        return <Form.Check 
                                            key={item.id}
                                            type='checkbox'
                                            id={'period-'+item.id}
                                            name={'periods'}
                                            label={item.title}
                                        />;
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3-4" className='mb-2'>
                                <Accordion.Header><AiOutlineEye size={17} className='me-3' /> Viewed Options</Accordion.Header>
                                <Accordion.Body>
                                    {viewedOptions.map(function(item){
                                        return <Form.Check 
                                            key={item.id}
                                            type='checkbox'
                                            id={'period-'+item.id}
                                            name={'periods'}
                                            label={item.title}
                                        />;
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3-5" className='mb-2'>
                                <Accordion.Header><BsReply size={17} className='me-3' /> Replied After</Accordion.Header>
                                <Accordion.Body>
                                
                                </Accordion.Body>
                            </Accordion.Item>
                            </Accordion>
                            {/* <Button onClick={(e) => {filter(e)}} variant='primary' className='w-100 p-1'>Apply Filters</Button> */}
                            <Button variant='primary' className='w-100 p-1' disabled={isLoading}>Apply Filters</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer theme='colored' />
    </div>
  )
}
