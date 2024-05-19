import React from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SwitchWorkspace({show, handleShow}) {
  const navigate = useNavigate();

  const workspaces = [
    {
        id: '1',
        name: 'Workspace 1',
        memberCount: '1',
        activeStatus: true
    },
    {
        id: '2',
        name: 'Workspace 2',
        memberCount: '43',
        activeStatus: false
    }
  ];

  return (
    <Modal 
        show={show} 
        onHide={handleShow}
        size='lg'
        centered
        className='max-heighted-modal'
        >
        <Modal.Header closeButton>
            <Modal.Title>Switch Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex flex-wrap justify-content-center align-items-center'>
                {
                    workspaces.map((item) => {
                        return <div 
                            key={item.id} 
                            className={'workspace-box box-card p-4 mb-3 me-3 text-center d-flex justify-content-center align-items-center '+ (item.activeStatus ? 'active' : '')}
                            >
                            <div>
                                {
                                    item.activeStatus ?
                                    <p className='status mb-0'>Active</p> :
                                    ''
                                }
                                <p className='workspace-name'>{item.name}</p>
                                <p className='member-count mb-0'>
                                    {item.memberCount}{item.memberCount === '1' ? ' Member' : ' Members'}
                                </p>
                            </div>
                        </div>
                    })
                }
                <div className='workspace-box box-card p-4 mb-3 d-flex justify-content-center align-items-center'
                    onClick={() => navigate('/create-workspace')}
                    >
                    <p className='mb-0'>Create New <AiOutlinePlus size={20} /></p>
                </div>
            </div>
        </Modal.Body>
    </Modal>
  )
}
