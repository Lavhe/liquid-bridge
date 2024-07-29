import classname from "classnames";
import { useMemo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";

export function TextArea({
  label,
  value,
  variable,
  onChange,
  classNames,
  type,
  disabled,
  placeholder,
}: any) {
  const { currentUser } = useFirebase();
  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value]);

  const labelClassName = classname("text-xs text-gray-600 font-medium py-2", {
    "text-gray-400": isDisabled,
  });

  return (
    <div
      className={`${classNames} mx-4 py-2 flex flex-col flex-nowrap whitespace-nowrap w-full`}
    >
      <label htmlFor="" className={labelClassName}>
        {label}
      </label>
      <textarea
        className="w-full px-4 py-2 border border-gray-400 rounded-md text-xs"
        value={value}
        name={variable}
        placeholder={placeholder}
        onChange={onChange}
        disabled={isDisabled}
      />
    </div>
  );
}
