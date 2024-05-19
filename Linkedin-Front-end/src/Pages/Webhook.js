import React from 'react'
import WebhookContent from '../Components/Webhook/WebhookContent'
import LoginLayout from '../Layouts/LoginLayout'

export default function Webhook() {
  return (
    <LoginLayout title={'Webhook'}>
        <WebhookContent />
    </LoginLayout>
  )
}
