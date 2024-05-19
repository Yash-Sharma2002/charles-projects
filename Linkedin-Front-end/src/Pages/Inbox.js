import React from 'react';
import InboxContent from '../Components/Inbox/InboxContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function Inbox() {
  return (
    <LoginLayout title='Inbox'>
        <InboxContent />
    </LoginLayout>
  )
}
