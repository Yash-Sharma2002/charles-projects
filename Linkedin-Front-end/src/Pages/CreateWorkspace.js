import React from 'react';
import LoginLayout from '../Layouts/LoginLayout';
import CreateWorkspaceContent from '../Components/Workspace/CreateWorkspaceContent';

export default function CreateWorkspace() {
  return (
    <LoginLayout title='Create Workspace'>
        <CreateWorkspaceContent />
    </LoginLayout>
  )
}
