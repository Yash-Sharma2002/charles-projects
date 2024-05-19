import React from 'react';
import ForgotPasswordContent from '../Components/Reset Password/ForgotPasswordContent';
import PublicLayout from '../Layouts/PublicLayout';

export default function ForgotPassword() {
  return (
    <PublicLayout page='forgot-pass'>
        <ForgotPasswordContent />
    </PublicLayout>
  )
}
