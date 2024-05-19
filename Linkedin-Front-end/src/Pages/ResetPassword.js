import React from 'react';
import ResetPasswordContent from '../Components/Reset Password/ResetPasswordContent';
import PublicLayout from '../Layouts/PublicLayout';

export default function ResetPassword() {
  return (
    <PublicLayout page='reset-pass'>
        <ResetPasswordContent />
    </PublicLayout>
  )
}
