import classname from "classnames";
import { useMemo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";

export function TextInput({
  label,
  value,
  variable,
  onChange,
  classNames,
  type,
  disabled,
  placeholder,
  prefix,
}: any) {
  const { currentUser } = useFirebase()
  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value, disabled]);

  const labelClassName = classname("text-xs px-4 text-gray-600 font-medium", {
    "text-gray-400": isDisabled,
  });

  return (
    <div
      className={`${classNames} py-2 flex flex-nowrap whitespace-nowrap w-full place-items-center`}
    >
      <label htmlFor="" className={labelClassName}>
        {label}
      </label>
      <div className="relative h-full w-1/2 flex place-items-center">
        {prefix && (
          <span className="h-full font-black flex place-items-center absolute px-2 text-xs">
            {prefix}
          </span>
        )}

        <input
          type={type || "text"}
          className="w-full px-5 py-2 border border-gray-400 rounded-md text-xs justify-center my-auto"
          value={value}
          name={variable}
          onChange={onChange}
          disabled={isDisabled}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
