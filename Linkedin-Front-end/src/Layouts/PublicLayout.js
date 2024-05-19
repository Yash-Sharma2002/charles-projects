import React from 'react'

export default function PublicLayout({children, page}) {
  const handleImg = () => {
    switch (page) {
      case 'login':
        return '/images/login.png';
      case 'signup':
        return '/images/signup.png';
      case 'forgot-pass':
        return '/images/forgot-pass.png';
      case 'reset-pass':
        return '/images/reset-pass.png';
      default:
        break;
    }
  }
  return (
    <div className='public-layout'>
        <div className='container-fluid p-0 align-items-center'>
            <div className='row g-0'>
              <div className='col-md-6 left-side d-flex'>
                <img src={handleImg()} className='public-img' alt='' />
              </div>
              <div className='col-md-6 right-side d-flex align-items-center custom-scrollbar'>
                <div className='content'>
                  {children}
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}
