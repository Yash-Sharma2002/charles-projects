import React from 'react';
import EmailIntegrationContent from '../Components/EmailIntegration/EmailIntegrationContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function EmailIntegration() {
  return (
    <LoginLayout title='Email Integration'>
        <EmailIntegrationContent />
    </LoginLayout>
  )
}
