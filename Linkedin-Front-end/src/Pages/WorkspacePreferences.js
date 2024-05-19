import React from 'react';
import WorkspacePreferencesContent from '../Components/Workspace/WorkspacePreferencesContent';
import LoginLayout from '../Layouts/LoginLayout';

export default function WorkspacePreferences() {
  return (
    <LoginLayout title='Edit Workspace'>
        <WorkspacePreferencesContent />
    </LoginLayout>
  )
}
