import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import PipelinesContent from '../components/Pipelines/PipelinesContent';

export default function Pipelines() {
  return (
    <LoginLayout title='Pipelines'>
        <PipelinesContent />
    </LoginLayout>
  )
}
