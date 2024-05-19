import React from 'react';
import LoginLayout from '../Layouts/LoginLayout';
import HomeContent from '../Components/Home/HomeContent';

export default function Home() {
  return (
    <LoginLayout title='Home' >
        <HomeContent />
    </LoginLayout>
  )
}
