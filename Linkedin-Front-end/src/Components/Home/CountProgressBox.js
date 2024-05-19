import React from 'react';
import CustomProgressBar from '../Inputs/CustomProgressBar';

export default function CountProgressBox({data}) {
  return (
    <div className='count-progress-box box-card p-4 me-3'>
        <h2>{data.totaValue}</h2>
        <p className='title'>{data.title}</p>
        <CustomProgressBar value={data.progressValue} />
    </div>
  )
}
