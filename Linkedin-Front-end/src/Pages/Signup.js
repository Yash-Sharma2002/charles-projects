import React from 'react';
import SignupContent from '../Components/Signup/SignupContent';
import PublicLayout from '../Layouts/PublicLayout';

export default function Signup() {
  return (
    <PublicLayout page='signup'>
        <SignupContent />
    </PublicLayout>
  )
}
