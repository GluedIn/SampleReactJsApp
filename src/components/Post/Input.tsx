import React, { useRef } from "react";

function Input({
  type = "text",
  placeholder = "Enter",
  onChange = () => {},
  value,
  error = "",
  ...restInputProps
}: any) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    if (value.length > inputRef.current?.maxLength!) {
      return;
    }
    onChange(event);
  };

  return (
    <div className="uploadContentInput">
      {type === "textarea" ? (
        <textarea
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="border border-x-0 border-t-0 border-b-[2px] border-disabled focus:border-active outline-none w-full h-[100px] bg-transparent"
          {...restInputProps}
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="border border-x-0 border-t-0 border-b-[2px] border-disabled focus:border-active outline-none w-full h-[40px] bg-transparent"
          {...restInputProps}
        />
      )}
      <div className="relative flex items-center justify-between mt-1 text-sm">
        {error && <div className="text-danger">{error}</div>}
        {inputRef.current?.maxLength !== -1 && (
          <div className="uploadContentInputMaxLength absolute top-0 right-0 flex items-center">
            <div>{inputRef.current?.value.length}</div>/
            <div>{inputRef.current?.maxLength}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
