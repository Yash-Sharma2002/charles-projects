import React from 'react';
import PublicLayout from '../Layouts/PublicLayout';
import LoginContent from '../Components/Login/LoginContent';

export default function Login() {
  return (
    <PublicLayout page='login'>
        <LoginContent />
    </PublicLayout>
  )
}
