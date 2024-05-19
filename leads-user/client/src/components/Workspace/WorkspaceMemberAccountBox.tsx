import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import Avatar from '../common/Avatar';

export default function WorkspaceMemberAccountBox({data}:any) {
  const [selected, setSelected] = useState(true);

  const handleSelect = () => {
    setSelected(!selected);
  }

  return (
    <div className={'workspace-member-account-box box-card d-flex align-items-center p-3 mb-3 ' + (selected ? 'active': '')}
         onClick={handleSelect}
    >
      <Form.Check
        type='checkbox'
        id={'member-allowed-acc'+data.id}
        checked={selected}
        />
      <Avatar image={data.image} imageClass='ms-3' />
      <div className='ms-2'>
        <p className='fw-600 mb-0'>{data.name}</p>
        <p className='mb-0'>{data.email}</p>
      </div>
      <div className='active-status mt-2 mb-2 ms-3'>
            <span className={data.activeStatus ? 'active me-1' : 'inactive me-1'}></span>
            {data.activeStatus ? 'Active' : 'Inactive'}
        </div>
    </div>
  )
}
