
import Input from "../../interface/Input";
import React from "react";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function InputPass(props: Input) {
  const [show, setShow] = React.useState(false);

  function Show() {
    setShow(!show);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
    if(props.onChange){
      props.onChange(e.target.name, e.target.value)
    }
  }
  return (
    <div className={"w-full h-fit text-start px-2 my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "password"}
          className="text-[16px] block leading-[24px] text-[#23262F] ml-2 font-[700] my-2 md:ml-0 "
        >
          {props.label}
        </label>
      )}
      <div className="relative w-full">
        <div
          className="absolute right-4"
          onClick={Show}
          style={{ top: "13.5px" }}
        >
          {show ? (
            <AiFillEyeInvisible className="text-[#777E91] text-[20px] cursor-pointer" />
          ) : (
            <AiFillEye className="text-[#777E91] text-[20px] cursor-pointer" />
          )}
        </div>
        <input
          type={show ? "text" : "password"}
          defaultValue={props.defValue}
          disabled={props.disabled ? true : false}
          name={props.name ? props.name : "password"}
          onChange={(e) => onChange(e)}
          placeholder={props.placeholder ? props.placeholder : `Enter Password`}
          className={
            "input w-full rounded-lg text-[14px] text-black font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white focus:outline-none"
          }
          style={{ borderColor: "rgb(189, 189, 189)" }}
        />
        {props.error && (
          <p className="text-[12px] text-red-500">{props.error}</p>
        )}
      </div>
    </div>
  );
}
