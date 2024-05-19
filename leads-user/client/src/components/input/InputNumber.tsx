import React from "react";
import Input from "../../interface/Input";

export default function InputNumber(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {
      props.onChangeHandler(e);
    }
    if(props.onChange){
      props.onChange(e.target.name, e.target.value)
    }
  }
  return (
    <div className={"text-start px-2  my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "number"}
          className="text-[16px] block leading-[24px] mx-2 text-[#23262F] font-[700] ml-2 md:ml-0 my-2"
        >
          {props.label}
        </label>
      )}
      <input
        type="number"
        name={props.name ? props.name : "number"}
        disabled={props.disabled ? true : false}
        defaultValue={props.defValue}
        placeholder={props.placeholder ? props.placeholder : `Enter Phone Number`}
        onChange={(e) => onChange(e)}
        className={
          "input rounded-lg w-full text-[14px] text-black font-medium  disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[black] bg-white"
        }
        style={{ borderColor: "rgb(189, 189, 189)" }}
      />
      {props.error && <p className="text-[12px] text-red-500">{props.error}</p>}
    </div>
  );
}
