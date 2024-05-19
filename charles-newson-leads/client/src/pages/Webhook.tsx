import React from 'react'
import LoginLayout from '../components/layouts/LoginLayout'
import WebhookContent from '../components/Webhook/WebhookContent'
export default function Webhook() {
  return (
    <LoginLayout title={'Webhook'}>
        <WebhookContent />
    </LoginLayout>
  )
}
