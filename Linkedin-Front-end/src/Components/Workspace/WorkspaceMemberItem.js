import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Modal } from 'react-bootstrap';
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import WorkspaceMemberAccountBox from './WorkspaceMemberAccountBox';
import Avatar from '../UI/Avatar';

export default function WorkspaceMemberItem({data}) {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [adminRight, setAdminRight] = useState(data.adminRight);

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

  return (
    <tr className='workspace-member-item box-card'>
        <td>
            <div className='d-flex align-items-center justify-content-center'>
                <Avatar image={data.image} />
                <p className='ms-2 mb-0'>{data.email}</p>
            </div>
        </td>
        <td>
            {
                <div className='d-flex flex-wrap justify-content-center'>
                    {
                        data.accounts.length !== 0 ?
                        data.accounts.slice(0,4).map((item) => {
                            return <div key={item.id} className='me-2'>
                                        <div className="custom-tooltip">
                                            <Avatar image={item.image} />
                                            <span className="tooltiptext">{item.name}<br/>{item.email}</span>
                                        </div>
                                    </div>
                          }) :
                          <p className='mb-0'>No accounts</p>
                    }
                    {
                        data.accounts.length > 4 ?
                        <div className='more d-flex align-items-center justify-content-center'>
                            { '+'+data.accounts.slice(4).length }
                        </div> :
                        ''
                    }
                </div>
            }
        </td>
        <td>
            <Form.Switch
                id={'admin-right-switch-'+data.id}
                checked={adminRight ? true : false}
                onChange={() => setAdminRight(!adminRight)}
                />
        </td>
        <td>
            <Button variant='action' className='me-2' onClick={handleShow}>
                <MdOutlineEdit size={20}/>
            </Button>
            <Button variant='action'>
                <AiOutlineDelete size={20}/>
            </Button>
        </td>

        { /***** Edit Member Item Popup *****/ }
        
        <td>
            <Modal 
                show={show} 
                onHide={handleShow}
                size='lg'
                centered
                className='max-heighted-modal'
                >
                <Modal.Header closeButton>
                    <Modal.Title>Update Credentials for <br/>
                        <span>{data.name}</span>
                        <span className='fs-6'>{' ('+data.email+')'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className='mb-3'>
                            <Form.Control
                                type='text'
                                name='edit-member-search'
                                placeholder={'Search...'}
                                />
                        </div>
                        <div className='d-flex flex-wrap justify-content-center align-items-center'>
                            {
                                data.accounts.length !== 0 ?
                                data.accounts.map((item) => {
                                    return <WorkspaceMemberAccountBox key={item.id} data={item} />
                                }) :
                                <p className='my-5'>No accounts</p>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShow}>
                            Cancel
                        </Button>
                        <Button type='submit' variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </td>
    </tr>
  )
}
