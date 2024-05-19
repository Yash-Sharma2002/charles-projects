import CreateWorkspaceContent from "../components/Workspace/CreateWorkspaceContent";
import LoginLayout from "../components/layouts/LoginLayout";

export default function CreateWorkspace() {
  return (
    <LoginLayout title='Create Workspace'>
        <CreateWorkspaceContent />
    </LoginLayout>
  )
}
