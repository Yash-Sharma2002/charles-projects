import React, { useState } from 'react';
import WorkspaceMemberItem from './WorkspaceMemberItem';
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function WorkspacePreferencesContent() {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [inviteFields, setInviteFields] = useState([{email:''}]);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else {
        event.preventDefault();
        event.stopPropagation();
        setValidated(false);
        setShow(false);
        navigate('/edit-workspace');
    }
  };
  const handleShow = () => setShow(!show);
  const handleCancel = () => navigate(-1);

  //Set Invite User Input value on change
  const handleInviteUser = (index, e) => {
    let data = [...inviteFields];
    data[index][e.target.name] = e.target.value;
    setInviteFields(data); 
  };

  //Add Invite User Input
  const addInviteUser = () => {
    let newField = {email: ''};
    setInviteFields([...inviteFields, newField])
  };

  //Remove Invite User Input
  const removeInviteUser = (index) => {
    let data = [...inviteFields];
    data.splice(index, 1);
    setInviteFields(data);
  };

  const workspaceMembers = [
    {
        id: '1',
        image: '/images/account/account.jpg',
        name: 'Chris Evans',
        email: 'milli.bob@gmail.com',
        accounts: [
            {
                id: '1',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan123@gmail.com',
                activeStatus: true
            },
            {
                id: '2',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan2@gmail.com',
                activeStatus: true
            },
            {
                id: '3',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan2@gmail.com',
                activeStatus: true
            },
            {
                id: '4',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan2@gmail.com',
                activeStatus: false
            },
            {
                id: '5',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan2@gmail.com',
                activeStatus: true
            },
            {
                id: '6',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan2@gmail.com',
                activeStatus: true
            }
        ],
        adminRight: true
    },
    {
        id: '2',
        image: '/images/account/account.jpg',
        name: 'Chris Evans',
        email: 'milli.bob@gmail.com',
        accounts: [
            {
                id: '1',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan3@gmail.com',
                activeStatus: true
            },
            {
                id: '2',
                image: '/images/account/account.jpg',
                name: 'Chris Evans',
                email: 'chris.evan4@gmail.com',
                activeStatus: true
            }
        ],
        adminRight: false
    },
    {
        id: '3',
        image: '/images/account/account.jpg',
        name: 'Chris Evans',
        email: 'milli.bob@gmail.com',
        accounts: [],
        adminRight: false
    }
  ];

  const workspaceName = 'Alpha Team';
  const inviteCode = 'fh39988jdsss0';

  return (
    <div className='workspace-preferences-content main-bg p-4'>
        <div className='row g-0 box-card p-4'>
            <div className='col-md-6 pe-4'>
                <Form.Label>Workspace Name</Form.Label>
                <Form.Control
                    type='text'
                    name='workspace-name'
                    value={workspaceName}
                    />
            </div>
            <div className='col-md-6 ps-4'>
                <Form.Label>Invite Code</Form.Label>
                <Form.Control
                    type='text'
                    name='invite-code'
                    value={inviteCode}
                    readOnly
                    />
                <Button variant='primary' className='mt-3'>Reset Code</Button>
            </div>
        </div>
        <div className='text-end'>
            <Button variant='primary' className='mt-3 mb-2' onClick={handleShow}>
                Invite User <AiOutlinePlus size={18} />
            </Button>
        </div>
        <table className='table table-borderless workspace-table align-middle text-center mb-5'>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Allowed LinkedIn Accounts</th>
                    <th>Has Admin Rights</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    workspaceMembers.map((item) => {
                        return <WorkspaceMemberItem key={item.id} data={item} />
                    })
                }
            </tbody>
        </table>
        <div className='d-flex justify-content-between'>
            <Button variant='red'>Delete Workspace</Button>
            <div>
                <Button variant='secondary' className='me-2' onClick={handleCancel}>Cancel</Button>
                <Button variant='primary' type='submit'>Save</Button>
            </div>
        </div>
        
        { /***** Inite User Popup *****/ }
        
        <Modal 
            show={show} 
            onHide={handleShow}
            size='lg'
            centered
            className='max-heighted-modal'
            >
            <Modal.Header closeButton>
                <Modal.Title>Invite User</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                    {
                        inviteFields.map((item, index) => {
                            return (
                                <div key={index} className='d-flex align-items-end mb-3'>
                                    <div className='flex-grow-1'>
                                        <Form.Label>Member's Email</Form.Label>
                                        <Form.Control
                                            type='email'
                                            name='invite-email'
                                            placeholder={'Enter Member\'s Email'}
                                            required
                                            value={item.email}
                                            onChange={e => handleInviteUser(index, e)}
                                            />
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Email.
                                        </Form.Control.Feedback>
                                    </div>
                                    {
                                        inviteFields.length > 1 ?
                                        <div>
                                            <Button variant='red' className='ms-2' onClick={() => removeInviteUser(index)}>
                                                <AiOutlineDelete size={20}/>
                                            </Button>
                                        </div> :
                                        ''
                                    }
                                </div>
                                )
                            })
                        }
                    <Button variant='primary' onClick={addInviteUser}>Add Another</Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' variant="primary">
                        Invite
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </div>
  )
}
