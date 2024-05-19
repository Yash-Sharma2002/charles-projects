import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

export default function ForgotPasswordContent() {
  const [validated, setValidated] = useState(false);
  const naviagte = useNavigate();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
        event.preventDefault();
        event.stopPropagation();
        naviagte('/reset-pass');
    }

    setValidated(true);
  };

  return (
    <div className='forgot-pass-content'>
      <h2 className='text-center'>Forgot Password?</h2>
      <p className='text-center px-3 mb-4'>We’ll send an email to you so you can reset your password</p>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className='mb-3 mt-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            name='forgot-pass-email'
            placeholder='Enter Registered Email Address'
            required
            />
          <Form.Control.Feedback type="invalid">
            Invalid Email.
          </Form.Control.Feedback>
        </div>
        <Button type='submit' variant='primary w-100'>
          Send
        </Button>
        <p className='mt-3 text-center'>Don't want to reset? 
          <NavLink to={'/login'} className='colored-link'> Login</NavLink>
        </p>
      </Form>
    </div>
  )
}
