import React from 'react';
import AccountSettingsContent from '../Components/AccountSettings/AccountSettingsContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function AccountSettings() {
  return (
    <LoginLayout title='Account Settings'>
        <AccountSettingsContent />
    </LoginLayout>
  )
}
