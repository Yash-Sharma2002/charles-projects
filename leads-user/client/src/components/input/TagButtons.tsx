import React from 'react';

export default function TagButtons({tagAction}:any) {
  return (
    <div className='d-flex flex-wrap mt-2'>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{first_name}')}
            >
            First Name
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{last_name}')}
            >
            Last Name
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{full_name}')}
            >
            Full Name
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{email}')}
            >
            Email
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{location}')}
            >
            Location
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{company_name}')}
            >
            Company Name
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{college_name}')}
            >
            College Name
        </button>
        <button className='tag-btn mb-1 bg-[#e5e5e5] rounded-lg px-1 py-1 capitalize min-h-[unset] h-[unset]'
            onClick={tagAction('{occupation}')}
            >
            Occupation
        </button>
    </div>
  )
}
