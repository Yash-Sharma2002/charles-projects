import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function CustomProgressBar({value}) {
  return (
    <div className='progress-bar'>
        <p className='progress-val text-start mb-0'>{value}%</p>
        <ProgressBar now={parseInt(value)} />
    </div>
  )
}
