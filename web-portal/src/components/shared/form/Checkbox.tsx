import { useMemo, useRef } from "react";
import classname from "classnames";

import checkIcon from "../../../assets/icons/check.svg";
import { useFirebase } from "../../../context/FirebaseContext";

export function Checkbox({
  label,
  value,
  variable,
  onChange,
  classNames,
  disabled,
}: any) {
  const { currentUser } = useFirebase();
  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value]);

  const checkbox = useRef<any>(null);
  const labelClassName = classname("text-sm px-4 text-gray-600 font-medium", {
    "text-gray-400": isDisabled,
  });
  const boxClassName = classname(
    "h-6 w-6 min-w-6 min-h-6 border border-gray-700 rounded-sm grid place-items-center hover:bg-gray-100 cursor-pointer",
    {
      "bg-gray-200 hover:bg-gray-200 cursor-not-allowed": isDisabled,
    }
  );

  return (
    <div
      className={`${classNames} mx-10 py-2 flex flex-nowrap whitespace-nowrap w-full place-items-center`}
    >
      <input
        ref={checkbox}
        type="checkbox"
        className="hidden"
        value={value}
        name={variable}
        onChange={onChange}
        disabled={isDisabled}
      />
      <div onClick={(e) => checkbox.current?.click()} className={boxClassName}>
        {value && <img src={checkIcon} />}
      </div>
      <label htmlFor="" className={labelClassName}>
        {label}
      </label>
    </div>
  );
}
