import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import Details from '../components/user/Details';

export default function UserDetails() {
  return (
    <LoginLayout title='User Details'>
       <Details />
    </LoginLayout>
  )
}