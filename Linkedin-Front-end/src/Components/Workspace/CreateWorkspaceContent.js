import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CreateWorkspaceContent() {
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

  return (
    <div className='create-workspace main-bg p-4'>
        <div className='row g-0 box-card p-4'>
            <div className='col-md-12'>
                <Form.Label>Workspace Name</Form.Label>
                <Form.Control
                    type='text'
                    name='workspace-name'
                    placeholder='Enter Workspace Name'
                    />
                <Button variant='primary' className='mt-3 mb-2' onClick={handleShow}>
                    Invite User <AiOutlinePlus size={18} />
                </Button>
                <div className='text-end'>
                    <Button variant='secondary' className='me-2' onClick={handleCancel}>Cancel</Button>
                    <Button variant='primary' type='submit'>Create Workspace</Button>
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
        </div>
    </div>
  )
}
