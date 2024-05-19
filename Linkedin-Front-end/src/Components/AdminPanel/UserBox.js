import React from 'react';
import { Button } from 'react-bootstrap';
import { BsMegaphone, BsPerson } from "react-icons/bs";
import { MdOutlineEdit, MdOutlineRemoveRedEye, MdOutlineLogin } from "react-icons/md";
import Avatar from '../UI/Avatar';

export default function UserBox({data}) {
  return (
    <div className='user-box box-card text-center p-3 me-4 mb-3'>
        <div className='content-main d-flex mb-2'>
            <Avatar image={data.image} imageClass='user-image' />
            <div>
                <p className='title fw-600 mb-0 ms-2'>{data.title}</p>
                <span className='me-3'>
                    <BsPerson size={15} className='me-1' /> {data.accountCount}
                </span>
                <span>
                    <BsMegaphone size={15} className='me-1' /> {data.campCount}
                </span>
            </div>
        </div>
        <div className='labels d-flex flex-wrap'>
            <p className=''>{data.active ? 'active' : ''}</p>
        </div>
        <div className='content-foot pt-2 d-flex align-items-center justify-content-between'>
            <p className='amount mb-0'>${data.amount}</p>
            <div className='user-actions'>
                <Button variant='action' className='me-2'>
                    <MdOutlineRemoveRedEye size={16} />
                </Button>
                <Button variant='action' className='me-2'>
                    <MdOutlineEdit size={16} />
                </Button>
                <Button variant='action'>
                    <MdOutlineLogin size={16} />
                </Button>
            </div>
        </div>
    </div>
  )
}
