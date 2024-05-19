
import { FaEnvelope } from "react-icons/fa";

export default function EmailBox({data}:any) {
    const checkImg = () => {
        switch (data.type) {
            case 'gmail':
                return <img src='/images/email/gmail.png' alt='' />;

            case 'outlook':
                return <img src='/images/email/outlook.png' alt='' />;
            
            case 'sendgrid':
                return <img src='/images/email/sendgrid.png' alt='' />;
            case 'smtp':
                return <FaEnvelope size={50} color='#2A83EC' />;
        
            default:
                break;
        }
    }
  return (
    <div className='email-box box-card p-4 me-4 mb-4'>
        <div className='d-flex align-items-center mb-3'>
            {checkImg()}
            <p className='title fw-600 ms-3 mb-0'>{data.title}</p>
        </div>
        <p>{data.desc}</p>
        <button className='btn btn-primary2' onClick={() => data.onClick()}>Connect {data.title}</button>
    </div>
  )
}
