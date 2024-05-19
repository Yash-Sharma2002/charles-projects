import React from 'react';
import { TbWebhook } from "react-icons/tb";

export default function WebhookContent() {
  return (
    <div className='webhook-content main-bg p-4 custom-scrollbar'>
        <div className='row g-0'>
            <div className='col-md-12'>
                <div className='d-flex flex-wrap'>
                    <div className='box-card p-4 mt-6 md:mt-0'>
                        <div className='d-flex mb-4 '>
                            <TbWebhook size={40} />
                            <p className='title fw-600 ms-3'>Webhook</p>
                        </div>
                        <div className='d-flex'>
                            <button className="btn btn-primary2 me-3" >Create Webhook</button>
                            <button className="btn btn-primary2">Manage Webhook</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
