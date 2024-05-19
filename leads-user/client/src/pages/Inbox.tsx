import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import InboxContent from '../components/Inbox/InboxContent';

export default function Inbox() {
  return (
    <LoginLayout title='Inbox'>
        <InboxContent />
    </LoginLayout>
  )
}
