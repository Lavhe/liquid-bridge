import { Icon } from "@mdi/react";
import { mdiMenuDown } from "@mdi/js";
import classnames from "classnames";
import { useCallback, useState } from "react";

export function DropDown({
  label,
  name,
  items,
  onChange,
  className,
  placeholder,
  disabled,
}: DropDownProps) {
  const [show, setShow] = useState(false);

  const dropDownContent = classnames(
    "z-10 w-min-44 bg-white rounded-b-lg border border-gray-300 divide-y divide-gray-100 shadow-lg dark:bg-gray-700 absolute",
    {
      hidden: !show,
    }
  );
  const mainClassname = classnames(
    "text-black border border-gray-400 hover:bg-opacity-50 hover:border-gray-800 font-medium rounded-md text-sm px-4 py-1 text-center inline-flex items-center whitespace-nowrap",
    className,
    {
      'bg-gray-200 hover:bg-opacity-100 hover:border-gray-400': disabled
    }
  );

  const handleSelect = useCallback(
    (value: any) => {
      setShow(false);
      onChange({ target: { value, name } });
    },
    [name]
  );

  const labelClassName = classnames("text-gray-500 text-opacity-80", {
    "text-gray-800": disabled,
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShow((s) => !s)}
        className={mainClassname}
        disabled={disabled}
        type="button"
      >
        {label || <span className={labelClassName}>{placeholder}</span>}
        <Icon
          path={mdiMenuDown}
          size={1}
          color="currentColor"
          className="pl-2"
        />
      </button>
      <div className={dropDownContent}>
        <ul
          className="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefault"
        >
          {items.map((item, i) => (
            <li key={i}>
              <a
                onClick={() => handleSelect(item.value)}
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export interface DropDownProps {
  items: {
    label: string;
    value: any;
  }[];
  name: string;
  label: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: { target: { value: any; name: any } }) => void;
}
