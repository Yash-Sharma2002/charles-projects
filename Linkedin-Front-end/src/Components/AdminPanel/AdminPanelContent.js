import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Tabs, Tab } from 'react-bootstrap';
import { AiOutlinePlus } from "react-icons/ai";
import Searchbar from '../Inputs/Searchbar';
import Loader from '../UI/Loader';
import { ToastContainer } from 'react-toastify';
import UserBox from './UserBox';

export default function AdminPanelContent() {
  const users = [
    {
        id: '1',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    },
    {
        id: '2',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    },
    {
        id: '3',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    },
    {
        id: '4',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    },
    {
        id: '5',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    },
    {
        id: '6',
        image: '/images/account/account.jpg',
        title: 'B2B Finance',
        accountCount: '12',
        campCount: '100',
        amount: '0',
        active: true
    }
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 1500);
  }, [isLoading]);

  return (
    <div className='admin-panel-content'>
        <div className='row g-0'>
            <div className='col-md-12'>
                <div className='content-top d-flex justify-content-between'>
                    <Searchbar />
                    <Button variant='primary'>
                        Add User <AiOutlinePlus size={18} />
                    </Button>
                </div>
                <div className='content-section main-bg p-4 mt-3 custom-scrollbar'>
                    <Tabs
                        defaultActiveKey="customers"
                        id="users-tabs"
                        className="custom-tabs pb-3"
                        >
                        <Tab eventKey="customers" title="Customers">
                            <div className='d-flex flex-wrap'>
                                {
                                    isLoading ?
                                    <Loader /> :
                                    <>
                                        {
                                            users.length === 0 ?
                                            <div className='no-data d-flex justify-content-center align-items-center w-100'>
                                                <p>No Users</p>
                                            </div> :
                                            users.map((item) => {
                                                return <UserBox key={item.id} data={item} />
                                            })
                                        }
                                    </>
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="white-labels" title="White-labels">
                            <div className='d-flex flex-wrap'>
                                {
                                    isLoading ?
                                    <Loader /> :
                                    <>
                                        {
                                            users.length === 0 ?
                                            <div className='no-data d-flex justify-content-center align-items-center w-100'>
                                                <p>No Users</p>
                                            </div> :
                                            users.map((item) => {
                                                return <UserBox key={item.id} data={item} />
                                            })
                                        }
                                    </>
                                }
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
        <ToastContainer theme='colored' />
    </div>
  )
}
