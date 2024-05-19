import React from 'react';
import UserSettingsContent from '../Components/UserSettings/UserSettingsContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function UserSettings() {
  return (
    <LoginLayout title='User Settings'>
        <UserSettingsContent />
    </LoginLayout>
  )
}
