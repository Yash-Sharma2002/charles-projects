import React from 'react';
import { AiOutlineLinkedin } from "react-icons/ai";
import { BsChatText } from "react-icons/bs";

export default function CountIconBox({data}) {
  return (
    <div className='count-icon-box box-card d-flex p-3 mb-3'>
        {data.icon === 'message' ?
         <BsChatText className='me-3' /> :
         <AiOutlineLinkedin className='me-3' />}
        <div>
            <p className='mb-0'>{data.title}</p>
            <h4 className='mb-0'>{data.totalValue}</h4>
        </div>
    </div>
  )
}
