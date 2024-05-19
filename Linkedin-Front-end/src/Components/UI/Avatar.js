import React from 'react'

export default function Avatar({image, imageClass}) {
  return (
    <img src={image ? image : '/images/account/user-avatar.png'} className={imageClass || ''} alt='' />
  )
}
