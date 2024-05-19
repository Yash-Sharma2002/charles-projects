import React from "react";

import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Input from "../../interface/Input";
import AllCountriesData from "../../constants/Allcountries";
import CountriesInterface from "../../interface/Countries";

export default function InputCountry(props: Input) {
  const [show, setShow] = React.useState(false);
  const [fileteredCountries, setFilteredCountries] =
    React.useState<CountriesInterface[]>(AllCountriesData);

  const inputRef = React.useRef<HTMLInputElement>(null);

  function Show() {
    if (!props.disabled) {
      setShow(!show);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setShow(true);
    let filtered = AllCountriesData.filter((data: CountriesInterface) => {
      return data.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    if (filtered.length === 0) {
      filtered = AllCountriesData.filter((data: CountriesInterface) => {
        return data.dial_code
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
    }
    setFilteredCountries(filtered);
  }

  function onCountryClick(data: CountriesInterface) {
    inputRef.current!.value = data.name;
    setShow(false);
    if (props.onChange) {
      props.onChange(props.name, data.name);
    }
    setFilteredCountries(AllCountriesData);
  }

  React.useEffect(() => {
   inputRef.current!.value = props.defValue || "";
  }, [props.defValue]);

  return (
    <>
      <div className={"text-start px-2 my-1 " + props.inputClassName}>
      {props.label && (
        <label
          htmlFor={props.name ? props.name : "name"}
          className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2 md:ml-0 my-2"
        >
          {props.label}
        </label>
      )}
        <div className="relative w-full">
          <div
            className="absolute right-5"
            onClick={Show}
            style={{ top: "13.5px" }}
          >
            {show ? (
              <IoMdArrowDropup className="text-[#777E91] text-[20px] cursor-pointer" />
            ) : (
              <IoMdArrowDropdown className="text-[#777E91] text-[20px] cursor-pointer" />
            )}
          </div>
          <input
            type="text"
            ref={inputRef}
            disabled={props.disabled ? true : false}
            name={props.name ? props.name : "password"}
            onChange={(e) => onChange(e)}
            placeholder={
              props.placeholder ? props.placeholder : `Enter Country`
            }
            className={
              "input rounded-lg text-[14px] text-black w-full font-medium disabled:bg-white disabled:text-black placeholder:font-normal placeholder:text-[#000] bg-white focus:outline-none"
            }
            style={{ borderColor: "rgb(189, 189, 189)" }}
          />
          {props.error && (
            <p className="text-[12px] text-red-500">{props.error}</p>
          )}
          <div
            className={`absolute z-50 mt-2 top-full left-0 w-full bg-white rounded-lg shadow-md border border-gray-200 h-fit  max-h-[200px] overflow-y-scroll scroll-hide ${
              show ? "block" : "hidden"
            }`}
          >
            {" "}
            {fileteredCountries.map((data: CountriesInterface, i) => (
              <div
                key={i}
                onClick={() => onCountryClick(data)}
                className="flex items-center justify-between px-4 transition hover:bg-green-500 py-2 border-b border-gray-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <p className="text-[20px] country-flag ">{data.flag}</p>
                  <p className="text-[black] ml-2 text-[14px]">{data.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
