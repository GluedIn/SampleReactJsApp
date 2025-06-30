import CloseIcon from "../VerticalPlayer/Icons/Close";
import React, { useRef } from "react";

function InputWithChips({
  type = "text",
  placeholder = "Enter",
  onChange = () => {},
  value,
  values = [],
  onRemoveValue = () => {},
  error = "",
  name,
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
    <div
      className="flex items-center border-disabled focus:border-active outline-none overflow-visible min-h-[40px] cursor-text input-chips"
      onClick={() => inputRef.current?.focus()}
    >
      <ul className="flex flex-wrap items-center gap-2 w-full">
        {values.map((item: any) => (
          <li>
            <div className="bg-active pl-2 py-0 flex items-center rounded-full">
              <div>
                {name === "taggedUsers" ? "@" : "#"}
                {item?.title ?? "default"}
              </div>
              <button
                className="bg-transparent"
                onClick={(event) => {
                  event.preventDefault();
                  onRemoveValue(item);
                }}
              >
                <CloseIcon width="35" height="35" />
              </button>
            </div>
          </li>
        ))}
        <li className="flex-1">
          <input
            ref={inputRef}
            type={type}
            placeholder={!values.length ? placeholder : ""}
            onChange={handleInputChange}
            className="w-full outline-none !border-b-0 bg-primary-dark"
            {...restInputProps}
          />
        </li>
      </ul>
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

export default InputWithChips;
