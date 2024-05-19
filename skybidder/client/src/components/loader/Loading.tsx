import React from 'react'
import HashLoader from "react-spinners/HashLoader";

const override: React.CSSProperties  = {
display:'flex',
justifyContent:'center',
alignItems:'center',
}
export default function Loading() {
    return (
        <div className='w-full h-screen fixed z-[10000] top-0 left-0 flex justify-center items-center bg-white'>
                <HashLoader color='#002F53' loading={true} cssOverride={override} speedMultiplier={1} />
        </div>
    );
}