import React from 'react';
import LinkedinAccountsContent from '../Components/LinkedinAccounts/LinkedinAccountsContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function LinkedinAccounts() {
  return (
    <LoginLayout title='Linkedin Accounts'>
        <LinkedinAccountsContent />
    </LoginLayout>
  )
}