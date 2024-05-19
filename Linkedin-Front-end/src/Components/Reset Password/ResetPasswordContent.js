import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

export default function ResetPasswordContent() {
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
        naviagte('/login');
    }

    setValidated(true);
  };

  return (
    <div className='reset-pass-content'>
      <h2 className='text-center mb-4'>Forgot Password?</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <div className='mb-3 mt-3'>
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type='password'
            name='reset-pass-new'
            placeholder='Create New Password'
            required
            />
          <Form.Control.Feedback type="invalid">
            Invalid Password.
          </Form.Control.Feedback>
        </div>
        <div className='mb-3 mt-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            name='reset-pass-confirm'
            placeholder='Repeat Password'
            required
            />
          <Form.Control.Feedback type="invalid">
            Invalid Password.
          </Form.Control.Feedback>
        </div>
        <Button type='submit' variant='primary w-100'>
          Reset
        </Button>
      </Form>
    </div>
  )
}
