import React from 'react';
import { Button } from 'react-bootstrap';

export default function TagButtons({tagAction}) {
  return (
    <div className='d-flex flex-wrap mt-2'>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{first_name}')}
            >
            First Name
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{last_name}')}
            >
            Last Name
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{full_name}')}
            >
            Full Name
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{email}')}
            >
            Email
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{location}')}
            >
            Location
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{company_name}')}
            >
            Company Name
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{college_name}')}
            >
            College Name
        </Button>
        <Button 
            variant='secondary' 
            className='tag-btn mb-1'
            onClick={tagAction('{occupation}')}
            >
            Occupation
        </Button>
    </div>
  )
}
