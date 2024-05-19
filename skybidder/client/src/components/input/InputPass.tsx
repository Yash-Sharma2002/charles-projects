import React from 'react'

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

export default function InputPass({ onChangeHandler, defValue }: { onChangeHandler?: (type: string, value: string) => void, defValue: string }) {
    const [show, setShow] = React.useState(false)

    function Show() {
        setShow(!show)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (onChangeHandler) {
          onChangeHandler("password", e.target.value);
        }
      }

    return (
        <div className='w-full h-fit text-start my-4'>
            <div className='relative w-full'>
                <div className='absolute right-4' onClick={Show} style={{top:'13.5px'}}>
                    {
                        show ? <AiFillEyeInvisible className='text-[#777E91] text-[20px] cursor-pointer' /> : <AiFillEye className='text-[#777E91] text-[20px] cursor-pointer' />
                    }
                </div>
                <input type={show?"text":"password"} defaultValue={defValue} name='password' onChange={(e) => onChange(e)} placeholder="Password" className="input w-full font-[900] text-[14px] text-black placeholder:font-[900] placeholder:text-[black] bg-white" style={{ borderColor: 'rgb(189, 189, 189)' }} />
            </div>
        </div>
    )
}