import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BiCheck, BiEnvelope, BiPhone } from 'react-icons/bi';
import { MdOutlineContentCopy, MdOutlineEdit } from "react-icons/md";
import { TbBrandTwitter } from 'react-icons/tb';
import { BsX } from "react-icons/bs";
import { ToastContainer, toast } from 'react-toastify';

export default function ChatInfoContactItem({type, itemValue, setInputValue}) {
  const [itemReadOnly, setItemReadOnly] = useState(true);
  const [inputRefValue, setInputRefValue] = useState(itemValue);
  let savedValue = itemValue;

  const iconType = (type) => {
    switch (type) {
        case 'email':
            return <BiEnvelope size={15} />;
        case 'phone':
            return <BiPhone size={15} />;
        case 'twitter':
            return <TbBrandTwitter size={15} />;
        default:
            break;
    }
  };

  const placeholderTye = () => {
    switch (type) {
        case 'email':
            return 'No Email';
        case 'phone':
            return 'No Phone';
        case 'twitter':
            return 'No Twitter';
        default:
            break;
    }
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputRefValue);
    toast.success('Contact Copied!');
  };
  
  return (
    <div className='contact-item d-flex justify-content-between align-items-center'>
        <div className='item-left d-flex'>
            {iconType(type)}
            <p className='mx-1 mb-0'>{type}:</p>
        </div>
        <div className='item-right d-flex'>
            <Form.Control
                type='text'
                name='direct-email-input'
                value={inputRefValue}
                onChange={(e) => setInputRefValue(e.target.value)}
                placeholder={placeholderTye()}
                readOnly={itemReadOnly}
                />
            {
                itemReadOnly ?
                <div>
                    <Button 
                        variant='action' 
                        className='mx-1'
                        onClick={handleCopyInput}
                        >
                        <MdOutlineContentCopy size={12} />
                    </Button>
                    <Button 
                        variant='action' 
                        onClick={() => setItemReadOnly(false)}>
                        <MdOutlineEdit size={12} />
                    </Button>
                </div> :
                <div>
                    <Button 
                        variant='action' 
                        className='mx-1' 
                        onClick={() => {
                            setItemReadOnly(true); 
                            setInputValue(inputRefValue);
                            toast.success('Contact Updated!')
                            }}>
                        <BiCheck size={11} />
                    </Button>
                    <Button 
                        variant='red' 
                        onClick={() => {
                            setItemReadOnly(true); 
                            setInputValue(savedValue); 
                            setInputRefValue(savedValue);
                            }}>
                        <BsX size={12} />
                    </Button>
                </div>
            }
        </div>
        <ToastContainer theme='colored' />
    </div>
  )
}
