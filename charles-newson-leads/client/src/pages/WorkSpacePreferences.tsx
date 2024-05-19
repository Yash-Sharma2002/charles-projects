import React from 'react';
import LoginLayout from '../components/layouts/LoginLayout';
import WorkspacePreferencesContent from '../components/Workspace/WorkspacePreferencesContent';

export default function WorkspacePreferences() {
  return (
    <LoginLayout title='Edit Workspace'>
        <WorkspacePreferencesContent />
    </LoginLayout>
  )
}
