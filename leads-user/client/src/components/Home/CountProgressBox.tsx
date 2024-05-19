import React from 'react';
import CustomProgressBar from '../input/CustomProgressBar';

export default function CountProgressBox({data}:any) {
  return (
    <div className='count-progress-box box-card p-4 me-3 my-2'>
        <h2>{data.totaValue}</h2>
        <p className='title'>{data.title}</p>
        <CustomProgressBar value={data.progressValue} />
    </div>
  )
}
