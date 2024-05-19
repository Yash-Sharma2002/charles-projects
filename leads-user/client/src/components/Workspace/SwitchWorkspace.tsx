import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/Context";

export default function SwitchWorkspace({ show, handleShow }: any) {
  const navigate = useNavigate();
  const {  currentWorkspace, setCurrentWorkspace,workspaces } =
    React.useContext(AppContext);
  
  return (
    <Modal
      show={show}
      onHide={handleShow}
      size="lg"
      centered
      className="max-heighted-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Switch Workspace</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap justify-content-center align-items-center">
          {workspaces.map((item:any, idx:number) => {
            return (
              <div
                key={idx}
                onClick={() => {
                  setCurrentWorkspace(item);
                  handleShow();
                }}
                className={
                  "workspace-box box-card p-4 mb-3 me-3 text-center d-flex justify-content-center align-items-center " +
                  (item.workspace_id === currentWorkspace.workspace_id
                    ? "active"
                    : "")
                }
              >
                <p className="workspace-name">{item.workspace_name}</p>
              </div>
            );
          })}
          <div
            className="workspace-box box-card p-4 mb-3 d-flex justify-content-center align-items-center"
            onClick={() => navigate("/create-workspace")}
          >
            <p className="mb-0">
              Create New <AiOutlinePlus size={20} className="mx-auto" />
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
