import Input from "../../interface/Input";
import React from "react";

export default function InputFile(props: Input) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (props.onChangeHandler) {

      props.onChangeHandler(e);
    }
  }
  return (
    <div className={"text-start my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "email"}
          className="text-[16px] mt-7 px-2 block leading-[24px] text-[#23262F] font-[700] py-2"
        >
          {props.label}
        </label>
      )}
      {props.defValue && props.disabled ? (
        <img
          src={props.defValue}
          alt=""
          className="w-20 h-20 object-cover"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          name={props.name ? props.name : "image"}
          placeholder={props.placeholder ? props.placeholder : `Enter Email`}
          onChange={(e) => onChange(e)}
          className={
            "file-input w-[97%] md:mx-0 my-1 mx-2 file-input-bordered file-input-info rounded-lg text-[14px] text-black font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white  "
          }
          style={{ borderColor: "rgb(189, 189, 189)" 
        }}
        />
      )}
      {props.error && <p className="text-[12px] text-red-500">{props.error}</p>}
    </div>
  );
}
