// import React from 'react'


export default function InputEmail({
  onChangeHandler,
  defValue,
}: {
  onChangeHandler?: (type: string, value: string) => void;
  defValue: string;
}) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChangeHandler) {
      onChangeHandler("email", e.target.value);
    }
  }

  return (
    <div className="text-start my-4">
      <input
        type="email"
        name="email"
        defaultValue={defValue}
        placeholder={`Enter Email`}
        onChange={(e) => onChange(e)}
        className="input w-full text-[14px] text-black font-[900] placeholder:font-[900] placeholder:text-[black] bg-white"
        style={{ borderColor: 'rgb(189, 189, 189)' }}
      />
    </div>
  );
}
