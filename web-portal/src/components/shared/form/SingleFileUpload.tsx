import { Icon } from "@mdi/react";
import { mdiDownload } from "@mdi/js";
import classname from "classnames";
import { useMemo } from "react";
import { useFirebase } from "../../../context/FirebaseContext";

export function SingleFileUpload({
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
  const { currentUser } = useFirebase();
  const isDisabled = useMemo(() => {
    return disabled?.(value, currentUser);
  }, [value]);

  const labelClassName = classname("text-xs px-4 text-gray-600 font-medium", {
    "text-gray-400": isDisabled,
  });
  const buttonClassName = classname(
    "flex rounded-full justify-center align-center py-2 px-4 grid place-items-center whitespace-nowrap text-primary hover:text-opacity-70",
    {
      "cursor-not-allowed bg-opacity-70 bg-gray-600": isDisabled,
    }
  );

  return (
    <div
      className={`${classNames} py-2 flex flex-nowrap whitespace-nowrap w-full place-items-center`}
    >
      <label htmlFor="" className={labelClassName}>
        {label}
      </label>
      <div className="relative h-full w-1/2 flex">
        {prefix && (
          <span className="h-full italic grid place-items-center absolute px-2 py-2 text-xs text-gray-500">
            {prefix}
          </span>
        )}
        {typeof value === "string" && (
          <button
            disabled={isDisabled}
            onClick={() => window.open(value, "_blank")}
            className={buttonClassName}
          >
            <Icon size={1} path={mdiDownload} />
          </button>
        )}

        <input
          type={"file"}
          className="w-full px-5 py-2 border border-gray-400 rounded-md text-xs"
          name={variable}
          onChange={onChange}
          disabled={isDisabled}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
