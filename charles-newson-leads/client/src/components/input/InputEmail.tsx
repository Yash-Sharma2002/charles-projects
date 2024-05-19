import Input from "../../interface/Input";
import React from "react";

export default function InputEmail(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
  }
  return (
    <div className={"text-start my-1 px-2 " +
    props.inputClassName}
  >
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "email"}
          className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2 md:ml-0 pt-3 my-2"
        >
          {props.label}
        </label>
      )}
      <input
        type="email"
        name={props.name ? props.name : "email"}
        disabled={props.disabled ? true : false}
        defaultValue={props.defValue}
        placeholder={props.placeholder ? props.placeholder : `Enter Email`}
        onChange={(e) => onChange(e)}
        className={
          "input rounded-lg w-full text-[14px]  text-black font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white mt-2" 
        }
        style={{ borderColor: "rgb(189, 189, 189)" }}
      />
      {props.error && (
        <p className="text-[12px] text-red-500">{props.error}</p>
      )}
    </div>
  );
}
