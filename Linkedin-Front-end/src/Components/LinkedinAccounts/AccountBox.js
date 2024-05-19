import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { BsFillChatTextFill } from "react-icons/bs";
import { createRecord } from '../../Config/apiFunctions';
import { useSelector } from "react-redux";
import { selectProfile } from "../../features/profile/profileSlice";
import routes from '../../Config/routes/api';
import Avatar from '../UI/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../UI/Loader';

const { userLinkedinAccountDisconnectRoute } = routes;

export default function AccountBox({ data, refetch, setSelectedLinkedinAccount, setReconnectShow }) {
  const user = useSelector(selectProfile);
  const [disconnecting, setDisconnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [reconnectSwitch, setReconnectSwitch] = useState(false);

  const handleShow = () => setShow(!show);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      toast.error('Invalid Credentials!');
    }
    else {
        event.preventDefault();
        event.stopPropagation();
        setValidated(false);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShow(false);
          setReconnectSwitch(false);
        }, 1500);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true)

    try {
        await createRecord({
            url: `${userLinkedinAccountDisconnectRoute}${data.id}/`,
            values: {},
            user,
        });
        refetch();
        toast.success('Linkedin Account Is Disconnected.');
    } catch (err) {
        console.log(err);
        if (err && err.response && err.response.data && err.response.data.column) {
            toast.error(err.response.data.column)
        } else {
            toast.error("Sorry, something went wrong, please try again later.")
        }
    } finally {
      setDisconnecting(false);
    }
};

  return (
    <div className='account-box box-card text-center p-4 me-4 mb-3'>
        <span className='unread-msg py-1 px-2'>
          <BsFillChatTextFill size={13} className='me-1' /> {data.msgCount ? data.msgCount : 0}
        </span>
        <Avatar src={data.avatar} />
        <div className='active-status mt-2 mb-2'>
            <span className={data.connected && data.ready_for_use ? 'active me-1' : 'inactive me-1'}></span>
            {data.connected && data.ready_for_use ? 'Active' : 'Inactive'}
        </div>
        <p className='email mb-0'>{data.name || data.username}</p>
        <p className='connect-status'>{data.connected ? 'Connected to Linkedin' : 'Not Connected'}</p>
        {data.connected ? 
         <Button variant='primary' onClick={handleDisconnect}>Disconnect Account</Button> :
         <Button variant='primary' onClick={() => {
          setSelectedLinkedinAccount(data)
          setReconnectShow(true)
         }}>Reconnect Account</Button>}
      <Modal
        show={show}
        onHide={handleShow}
        size='lg'
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title>Reconnect LinkedIn Account</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            {
              isLoading ?
              <Loader /> :
              <>
                <div className='mb-3'>
                  <Form.Switch
                    id='reconnect-switch'
                    name='reconnect-switch'
                    label='Reconnect with saved credentials?'
                    onChange={(e) => e.target.checked ? setReconnectSwitch(true) : setReconnectSwitch(false)}
                    checked={reconnectSwitch}
                    />
                </div>
                {
                  !reconnectSwitch &&
                  <div className='d-flex'>
                    <div className='mb-3 me-2 flex-grow-1'>
                      <Form.Control
                        type='email'
                        name='username'
                        placeholder='Enter LinkedIn Email'
                        required
                        />
                      <Form.Control.Feedback type="invalid">
                        Invalid Email
                      </Form.Control.Feedback>
                    </div>
                    <div className='mb-3 ms-2 flex-grow-1'>
                      <Form.Control
                        type='password'
                        name='password'
                        placeholder='Enter LinkedIn Password'
                        required
                        />
                      <Form.Control.Feedback type="invalid">
                        Invalid Password
                      </Form.Control.Feedback>
                    </div>
                  </div>
                }
              </>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant='primary' disabled={isLoading}>{isLoading ? 'Reconnecting' : 'Reconnect'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <ToastContainer theme='colored' className='text-start' />
    </div>
  )
}
