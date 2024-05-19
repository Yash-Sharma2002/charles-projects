import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import EmailIntegrationContent from '../components/EmailIntegration/EmailIntegrationContent';

export default function EmailIntegration() {
  return (
    <LoginLayout title='Email Integration'>
        <EmailIntegrationContent />
    </LoginLayout>
  )
}
