// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function SigninGoogle() {
	
	return (
		<div
			// onClick={handleGoogleSignIn}
			className="border-[rgba(117, 117, 117, 0.25)] mx-auto flex w-11/12 lg:w-[45%] cursor-pointer rounded-xl items-center justify-center border-[1px] border-solid bg-[#F9F9F9] py-4 my-2 px-2"
		>
            {/* @ts-ignore */}
			<FcGoogle className="mr-4 text-[24px] text-[#1B454D]" />
			<p className="text-[16px] font-[600] leading-[20px] text-[black]">Log in with Google</p>
		</div>
	);
}

