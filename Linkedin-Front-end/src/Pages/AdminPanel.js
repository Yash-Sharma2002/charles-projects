import React from 'react'
import AdminPanelContent from '../Components/AdminPanel/AdminPanelContent'
import LoginLayout from '../Layouts/LoginLayout'

export default function AdminPanel() {
  return (
    <LoginLayout title='Admin Panel'>
        <AdminPanelContent />
    </LoginLayout>
  )
}
