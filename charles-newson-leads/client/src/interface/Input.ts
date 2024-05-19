import React from "react";

export default interface Input {
  defValue: string;
  label?: string;
  name: string;
  onChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  error?: string;
  onChange?: (type:string,value:string) => void;
  selectArray?: { id: string; name: string; image?: string; value?: string }[];
}
