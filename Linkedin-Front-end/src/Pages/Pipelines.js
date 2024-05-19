import React from 'react';
import PipelinesContent from '../Components/Pipelines/PipelinesContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function Pipelines() {
  return (
    <LoginLayout title='Pipelines'>
        <PipelinesContent />
    </LoginLayout>
  )
}
