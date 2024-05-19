import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import Details from '../components/organisation/Details';

export default function OrganisationDetails() {
  return (
    <LoginLayout title='Organisation Details'>
       <Details />
    </LoginLayout>
  )
}