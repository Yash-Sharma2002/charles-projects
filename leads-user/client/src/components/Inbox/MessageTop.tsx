
import React, { useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
const MessageTop = () => {

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const togglePopover = () => {
      setIsPopoverOpen(!isPopoverOpen);
    };
  
    const closePopover = () => {
      setIsPopoverOpen(false);
    };
  

  return (
    <>

      <div className='w-full h-[4.1rem]' style={{ borderBottom: '4px solid #2A83EC', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
        <div className='flex justify-between items-center'>
          {/* for logo */}
          <div className='flex justify-start items-center w-[50%] p-2 gap-3'>
            <img src='/images/organisation.png' alt='logo' className='h-10 w-10 bg-[#b5b3b3] rounded-full' />
            <div>
              <p className='font-bold text-lg'>Vinay Kumar Singh</p>
              <p className='text-sm'>last seen 2:00 am</p>
            </div>
          </div>
          <div className='flex justify-end items-center p-2 gap-4 mr-8'>
            <img src="/camera.webp" alt="camera" className='h-10 w-10' />
            <button onClick={togglePopover}><img src="/more.webp" className='h-10 w-10' alt="setting" /></button>
            <img src="" alt="" />
          </div>
        </div>
      </div>
   
    {isPopoverOpen && (
      <div className="popover" style={{ position: 'absolute', right: '13px', top: '135px' ,width:'124px',border:'none'}}>
        {/* Popover content here */}
        <ul className='p-1 font-bold'>
          <div className='flex justify-between items-center'>
          <li>Option 1</li>
        <button onClick={closePopover}><MdOutlineClose /></button>
          </div>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      </div>
    )}
  </>
  )}

export default MessageTop
