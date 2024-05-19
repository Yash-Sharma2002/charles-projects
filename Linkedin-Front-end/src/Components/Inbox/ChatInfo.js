import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { BiCheck, BiPause, BiPlay } from 'react-icons/bi';
import { MdPersonAddAlt, MdOutlineChat, MdOutlineEditNote, MdOutlineMarkEmailRead, 
  MdOutlineEmail } from "react-icons/md";
import { TbHandClick, TbWebhook } from "react-icons/tb";
import { VscWand } from "react-icons/vsc";
import { ToastContainer, toast } from 'react-toastify';
import Avatar from '../UI/Avatar';
import Loader from '../UI/Loader';
import ChatInfoContactItem from './ChatInfoContactItem';

import routes from '../../Config/routes/api';
import { getRecord } from '../../Config/apiFunctions';
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";


const { buildAvatarRoute } = routes;

export default function ChatInfo({activeChat, statusColor}) {
  const workExperiences = [
    {
      id: '1',
      image: '/images/defaultCompany.svg',
      profileURL: 'https://www.linkedin.com/in/',
      compName: "Method Workers' Comp",
      compURL: 'https://www.linkedin.com/company/',
      designation: 'Director Claims Compliance',
      startDate: 'Jul 2020',
      endDate: 'present'
    },
    {
      id: '2',
      image: '/images/defaultCompany.svg',
      profileURL: 'https://www.linkedin.com/in/',
      compName: "Sedgwick",
      compURL: 'https://www.linkedin.com/company/',
      designation: 'Project Manager',
      startDate: 'Mar 2019',
      endDate: 'Jan 2020'
    },
    {
      id: '3',
      image: '/images/defaultCompany.svg',
      profileURL: 'https://www.linkedin.com/in/',
      compName: "Sedgwick CMS",
      compURL: 'https://www.linkedin.com/company/',
      designation: 'Director Claims',
      startDate: 'Jun 2011',
      endDate: 'jun 2015'
    }
  ];

  const [refCampaign, setRefCampaign] = useState(
    {
      title: 'Camp Title 1',
      status: true,
      steps: [
        {
          name: 'Send Connection Request',
          waitTime: '0'
        },
        {
          name: 'Perform Action',
          waitTime: '0'
        },
        {
          name: 'Send Message',
          waitTime: '0'
        },
        {
          name: 'Send Message',
          waitTime: 'in queue'
        },
        {
          name: 'Send Message',
          waitTime: 'in 4 days'
        }
      ]
    }
  );

  const [contacts, setContacts] = useState({
    directEmail: 'millie.bob@gmail.com',
    directPhone: '111-111-1111',
    directTwitter: '',
    workEmail: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  const setDirectEmail = (value) => {
    setContacts({...contacts, directEmail: value});
  };
  const setDirectPhone = (value) => {
    setContacts({...contacts, directPhone: value});
  };
  const setDirectTwitter = (value) => {
    setContacts({...contacts, directTwitter: value});
  };
  const setWorkEmail = (value) => {
    setContacts({...contacts, workEmail: value});
  };

  const toggleCampStatus = () => {
    setRefCampaign({...refCampaign, status: !refCampaign.status});
    !refCampaign.status ? toast.success('Campaign Started!') : toast.success('Campaign Paused!');
  };

  /* Get Icon based on Step Type */
  const stepIcon = (name) => {
    switch (name) {
        case 'Send Connection Request':
            return <MdPersonAddAlt size={15} />;
        case 'Send Message':
            return <MdOutlineChat size={15} />;
        case 'Send InMail':
            return <MdOutlineEditNote size={15} />;
        case 'Perform Action':
            return <TbHandClick size={15} />;
        case 'Send Connection by Email':
            return <MdOutlineMarkEmailRead size={15} />;
        case 'Send Email':
            return <MdOutlineEmail size={15} />;
        case 'Enrich Profile':
            return <VscWand size={15} />;
        case 'Send Webhook':
            return <TbWebhook size={15} />;
        default:
            break;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  return (
    <div className='chat-info p-3 custom-scrollbar'>
      {
        isLoading ?
        <Loader /> :
        <>
          <div className='user-info mb-3'>
            <div className='d-flex'>
              <a 
                href={workExperiences[0].profileURL} 
                target='_blank' 
                rel='noreferrer'
                >
                <img src={buildAvatarRoute(activeChat.prospect_details.linkedin_avatar)} alt='' />
              </a>
              <div className='ms-2'>
                <a 
                  href={activeChat.prospect_details.linkedin_profile_url} 
                  target='_blank' 
                  rel='noreferrer' 
                  className='name link mb-0'
                  >
                  {activeChat.prospect_details.name}
                </a>
                <p className={'msg-status mb-0 '+(statusColor())}>{"Replied"}</p>
              </div>
            </div>
            <p className='small-heading mt-2 mb-2'>Designation</p>
            <div className='company-item d-flex'>
              <img src={"images/defaultCompany.svg"} alt='' />
              <div className='comp-data ms-2'>
                <a 
                  href="#" 
                  target='_blank' 
                  rel='noreferrer' 
                  className='comp-name mb-0'
                  >
                  {activeChat.prospect_details.current_company}
                </a>
                <p className='designation mb-0'>{activeChat.prospect_details.occupation}</p>
              </div>
            </div>
          </div>
          <Accordion defaultActiveKey={['1', '2', '3']} flush alwaysOpen>
            <Accordion.Item eventKey="1" className='mb-2'>
              <Accordion.Header>Campaign</Accordion.Header>
              <Accordion.Body>
                <div className='camp-data'>
                  <p className='small-heading mb-1'>Title</p>
                  <div className='camp-data-head d-flex justify-content-between'>
                    <p className='camp-title mb-0'>{activeChat.campaign_details.name}</p>
                    <p className={`camp-status mb-0 ${activeChat.campaign_details.status !== "Running" ? 'inactive' : ''}`}>
                      {activeChat.campaign_details.status === "Running" ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <p className='small-heading mt-2 mb-2'>Steps</p>
                  {
                    refCampaign.steps.map((item, index) => {
                      return <div  key={index} className='camp-step d-flex justify-content-between'>
                        <div className='d-flex'>
                          <p>{index + 1}. </p>
                          <p className='mx-2'>{stepIcon(item.name)}</p>
                          <p>{item.name}</p>
                        </div>
                        <p className='wait-time'>{item.waitTime === '0' ? <BiCheck size={15} /> : item.waitTime}</p>
                      </div>
                    })
                  }
                  <div className='text-center'>
                    {
                      refCampaign.status ?
                      <Button variant='secondary' onClick={toggleCampStatus}><BiPause size={15} /> Pause Campaign</Button> :
                      <Button variant='primary' onClick={toggleCampStatus}><BiPlay size={15} /> Start Campaign</Button>
                    }
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" className='mb-2'>
              <Accordion.Header>Contacts</Accordion.Header>
              <Accordion.Body>
                <div className='contacts-data'>
                  <p className='small-heading mb-2'>Direct</p>
                  <ChatInfoContactItem 
                    type='email' 
                    itemValue={activeChat.prospect_details.email} 
                    setInputValue={setDirectEmail}
                    />
                  <ChatInfoContactItem 
                    type='phone' 
                    itemValue={activeChat.prospect_details.phone} 
                    setInputValue={setDirectPhone}
                    />
                  <ChatInfoContactItem 
                    type='twitter' 
                    itemValue={activeChat.prospect_details.twitter} 
                    setInputValue={setDirectTwitter}
                    />
                  <p className='small-heading mt-2 mb-2'>Work</p>
                  <ChatInfoContactItem 
                    type='email' 
                    itemValue={activeChat.prospect_details.work_email} 
                    setInputValue={setWorkEmail}
                    />
                  <div className='text-center mt-3'>
                    <Button variant='secondary'><VscWand size={15} /> Enrich Profile</Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" className='mb-2'>
              <Accordion.Header>Work Experiences</Accordion.Header>
              <Accordion.Body>
                <div className='company-item d-flex align-items-center mb-3'>
                  <img src={"images/defaultCompany.svg"} alt='' />
                  <div className='comp-data ms-2'>
                    <p className='comp-name mb-0'>{activeChat.prospect_details.current_company}</p>
                    <p className='designation mb-0'>{activeChat.prospect_details.occupation}</p>
                    <p className='start-end-date mb-0'>
                      <span>Mar 2019 - </span>
                      <span>Jan 2020</span>
                    </p>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Button 
            href={activeChat.prospect_details.linkedin_profile_url} 
            target='_blank' 
            rel='noreferrer' 
            variant='primary' 
            className='w-100 p-1'
            >
              Open in Linkedin
            </Button>
        </>
      }
      <ToastContainer theme='colored' />
    </div>
  )
}
