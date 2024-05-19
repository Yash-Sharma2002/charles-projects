
import React from "react";
import Input from "../../interface/Input";

export default function InputName(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
  }


  return (
    <div className={"text-start px-2 my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "name"}
          className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2 md:ml-0 pt-3 my-2"
        >
          {props.label}
        </label>
      )}
      <input
        type="text"
        name={props.name ? props.name : "name"}
        disabled={props.disabled ? true : false}
        defaultValue={props.defValue}
        placeholder={props.placeholder ? props.placeholder : `Enter Name`}
        onChange={(e) => onChange(e)}
        className={
          "input rounded-lg text-[14px] text-black w-full font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white focus:outline-none mt-2"
        }
        style={{ borderColor: "rgb(189, 189, 189)" }}
      />
      {props.error && <p className="text-[12px] text-red-500">{props.error}</p>}
    </div>
  );
}
