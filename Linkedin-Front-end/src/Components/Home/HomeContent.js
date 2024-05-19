import React, { useEffect, useState } from 'react';
import CountProgressBox from './CountProgressBox';
import CountIconBox from './CountIconBox';
import GraphBox from './GraphBox';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { BsMegaphone } from "react-icons/bs";
import { MdAccessTime, MdMoreTime } from "react-icons/md";
import Loader from '../UI/Loader';
import { ToastContainer } from 'react-toastify';

export default function HomeContent() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [campInput, setCampInput] = useState('');
  const [periodInput, setPeriodInput] = useState('1 week');
  const [isLoading, setIsLoading] = useState(true);

  const progressBoxes = [
    {
      id: '1',
      totaValue: '120',
      title: 'Campaigns',
      progressValue: '50'
    },
    {
      id: '2',
      totaValue: '120',
      title: 'Prospects',
      progressValue: '50'
    }
  ];

  const iconBoxes = [
    {
      id: '3',
      icon: 'message',
      totalValue: '120',
      title: 'New Messages',
    },
    {
      id: '4',
      icon: 'account',
      totalValue: '120',
      title: 'Linkedin Accounts',
    }
  ];

  const campPerformGraphs = [
    {
      id: '5',
      title: 'New Leads',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '6',
      title: 'Appointments Booked',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    }
  ];

  const outreachGraphs = [
    {
      id: '7',
      title: 'Connection Requests Sent',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '8',
      title: 'LinkedIn Messages Sent',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '9',
      title: 'Connects by Email Sent',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '10',
      title: 'InMails Sent',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '11',
      title: 'Viewed Profiles',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '12',
      title: 'Followed Profiles',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    }
  ];

  const engagementGraphs = [
    {
      id: '13',
      title: 'Accepted Invites',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '14',
      title: 'Replied Profiles',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    }
  ];

  const emailGraphs = [
    {
      id: '15',
      title: 'Emails Sent',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '16',
      title: 'Emails Opened',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    },
    {
      id: '17',
      title: 'Links Clicked',
      labels: ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
      values: [50, 100, 300, 100, 342, 534, 99,]
    }
  ];

  const campaigns = [
    {
      id: '8',
      title: 'Camp Title 1'
    },
    {
      id: '9',
      title: 'Camp Title 2'
    },
    {
      id: '10',
      title: 'Camp Title 3'
    }
  ];

  const periods = [
    {
      id: '11',
      title: '3 days'
    },
    {
      id: '12',
      title: '1 week'
    },
    {
      id: '13',
      title: '2 weeks'
    },
    {
      id: '14',
      title: '1 month'
    },
    {
      id: '15',
      title: '3 months'
    },
    {
      id: '16',
      title: '6 months'
    },
    {
      id: '17',
      title: '1 year'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  return (
    <div className='home-content'>
      <div className='row g-0'>
        <div className='col-md-9'>
          <div className='content-section main-bg p-4 me-3 custom-scrollbar'>
            {
              isLoading ?
              <Loader /> :
              <>
                <div className='d-flex flex-wrap mb-5'>
                <div className='d-flex me-3 mb-3'>
                  {progressBoxes.map(function(item){
                    return <CountProgressBox key={item.id} data={item} />
                  })}
                </div>
                <div>
                  {iconBoxes.map(function(item){
                    return <CountIconBox key={item.id} data={item} />
                  })}
                </div>
              </div>
              <h4 className='fw-600 mb-3'>Campaigns Performance</h4>
              <div className='d-flex flex-wrap mb-4'>
                {campPerformGraphs.map(function(item){
                  return <GraphBox key={item.id} content={item} />
                })}
              </div>
              <Accordion flush>
                <Accordion.Item eventKey="0-0" className='mb-3'>
                  <Accordion.Header>Linkedin Outreach</Accordion.Header>
                  <Accordion.Body>
                    <div className='d-flex flex-wrap mb-4'>
                      {outreachGraphs.map(function(item){
                        return <GraphBox key={item.id} content={item} />
                      })}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="0-1" className='mb-3'>
                  <Accordion.Header>Linkedin Engagement</Accordion.Header>
                  <Accordion.Body>
                    <div className='d-flex felx-wrap mb-4'>
                      {engagementGraphs.map(function(item){
                        return <GraphBox key={item.id} content={item} />
                      })}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="0-2" className='mb-3'>
                  <Accordion.Header>Email Outreach & Engagement</Accordion.Header>
                  <Accordion.Body>
                    <div className='d-flex flex-wrap mb-4'>
                      {emailGraphs.map(function(item){
                        return <GraphBox key={item.id} content={item} />
                      })}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              </>
            }
          </div>
        </div>
        <div className='col-md-3'>
          <div className='filter-section main-bg p-3'>
            <p className='fw-600'>Filters</p>
            <Accordion flush>
              <Accordion.Item eventKey="1-0" className='mb-2'>
                <Accordion.Header><BsMegaphone size={15} className='me-3' /> Campaigns</Accordion.Header>
                <Accordion.Body>
                  {campaigns.map(function(item){
                    return <Form.Check 
                            key={item.id}
                            type='radio'
                            id={'camp-'+item.id}
                            name={'campaigns'}
                            label={item.title}
                           />;
                      })}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1-1" className='mb-2'>
                <Accordion.Header><MdAccessTime size={17} className='me-3' /> Period</Accordion.Header>
                <Accordion.Body>
                  {periods.map(function(item){
                    return <Form.Check 
                            key={item.id}
                            type='radio'
                            id={'period-'+item.id}
                            name={'periods'}
                            label={item.title}
                            onChange={(e) => e.target.checked && setPeriodInput(item.title)}
                            checked={periodInput === item.title}
                           />;
                      })}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1-2" className='mb-2'>
                <Accordion.Header><MdMoreTime size={17} className='me-3' /> Custom Period</Accordion.Header>
                <Accordion.Body>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    isClearable={true}
                    placeholderText="Select a period"
                    monthsShown={2}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Button variant='primary' className='w-100 p-1' disabled={isLoading}>Apply Filters</Button>
          </div>
        </div>
      </div>
      <ToastContainer theme='colored' />
    </div>
  )
}
